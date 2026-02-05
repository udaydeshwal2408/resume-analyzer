import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { getResumeText } from "./parser.js";
import { processResumeRAG } from "./ragservice.js";
import dotenv from "dotenv";

dotenv.config();

const model = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.3-70b-versatile",
    temperature: 0.1,
});

export async function analyzeResume(resumeFilePath, jobDescription) {
    try {
        const rawResumeText = await getResumeText(resumeFilePath);

        let relevantContext;
        if (rawResumeText.length < 15000) {
            console.log(`[Analyzer] Short resume (${rawResumeText.length} chars). Using FULL TEXT.`);
            relevantContext = rawResumeText;
        } else {
            console.log(`[Analyzer] Long resume. Using RAG.`);
            relevantContext = await processResumeRAG(rawResumeText, jobDescription);
        }

        const parser = new JsonOutputParser();

        const template = `
        You are an expert Technical Recruiter. Analyze the candidate's Resume Context against the Job Description.

        JOB DESCRIPTION:
        {jobDescription}

        RESUME CONTEXT:
        {resumeContext}

        TASK:
        1. Identify the match score (0-100).
        2. Identify MISSING skills (keywords).
        - If NO missing skills, return {{ "missingKeywords": [] }}.
        - If Missing skills exist, return simple array of strings.
        - DO NOT merge skills (e.g. "ReactJS" not "ReactJSNodeJS").
        3. Identify a single MAJOR gap.
        4. Provide a 4-week realistic roadmap to close gaps.
           - keys MUST be: "Week 1", "Week 2", "Week 3", "Week 4".
           - values MUST be concise strings describing the focus for that week.

        Return ONLY valid JSON.
        {format_instructions}`;

        const prompt = new PromptTemplate({
            template: template,
            inputVariables: ["resumeContext", "jobDescription"],
            partialVariables: { format_instructions: parser.getFormatInstructions() }
        });

        const chain = prompt.pipe(model).pipe(parser);
        const response = await chain.invoke({
            resumeContext: relevantContext,
            jobDescription: jobDescription
        });

        // --- DEBUG & CLEANING LAYER ---
        console.log("FULL AI RESPONSE:", JSON.stringify(response, null, 2));

        const verifiedAnalysis = { ...response };

        // Ensure structure exists
        if (!verifiedAnalysis.skillGapAnalysis) {
            verifiedAnalysis.skillGapAnalysis = { missingKeywords: [] };

            // CRITICAL FIX: If missingKeywords exists at root (common in Llama-3 output), move it to skillGapAnalysis
            if (verifiedAnalysis.missingKeywords && Array.isArray(verifiedAnalysis.missingKeywords)) {
                verifiedAnalysis.skillGapAnalysis.missingKeywords = verifiedAnalysis.missingKeywords;
            }
        } else if (verifiedAnalysis.missingKeywords && Array.isArray(verifiedAnalysis.missingKeywords)) {
            // Even if skillGapAnalysis exists, prefer root keywords if valid (sometimes AI splits them)
            if (!verifiedAnalysis.skillGapAnalysis.missingKeywords || verifiedAnalysis.skillGapAnalysis.missingKeywords.length === 0) {
                verifiedAnalysis.skillGapAnalysis.missingKeywords = verifiedAnalysis.missingKeywords;
            }
        }

        // Normalize missingKeywords (handle undefined, null, or flat arrays)
        let rawKeywords = verifiedAnalysis.skillGapAnalysis.missingKeywords || [];
        if (!Array.isArray(rawKeywords)) {
            // If it's a string, try to split it
            if (typeof rawKeywords === 'string') {
                rawKeywords = [rawKeywords];
            } else {
                rawKeywords = [];
            }
        }
        // Save normalized back so downstream logic works
        verifiedAnalysis.skillGapAnalysis.missingKeywords = rawKeywords;

        // 1. If AI score is very low, TRUST THE AI.
        const aiScore = verifiedAnalysis.matchScore || 0;
        if (aiScore < 60) {
            console.log(`[Analyzer] Score (${aiScore}) is low. Skipping verification to prevent false positives.`);
            return verifiedAnalysis;
        }

        // Processing logic
        const combinedStr = rawKeywords.join(' ');

        // Split by CamelCase, commas, or multiple spaces
        let cleaned = combinedStr
            .split(/(?=[A-Z][a-z])|[,/ ]+/)
            .map(s => s.trim())
            .filter(s => s.length > 1 && s.toLowerCase() !== "and");

        // Verify against resume text
        const verifiedMissing = [...new Set(cleaned)].filter(skill => {
            const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`\\b${escaped}\\b`, 'i');
            return !regex.test(rawResumeText);
        });

        console.log("FINAL VERIFIED MISSING SKILLS:", verifiedMissing);

        // --- DYNAMIC SCORING LOGIC ---
        // Score should be determined by the FACTS (missing skills), not just the AI's "feeling".
        const finalMissingCount = verifiedMissing.length;

        if (finalMissingCount === 0) {
            // No missing skills? That is a perfect match.
            // Even if AI gave 80, we override to 100 because empirical evidence says 0 gaps.
            console.log(`[Score Logic] 0 missing skills found. Overriding score to 100.`);
            verifiedAnalysis.matchScore = 100;
            verifiedAnalysis.summary = "Perfect match! Your profile aligns perfectly with the job requirements.";
        } else {
            // If there ARE missing skills, we ensure the score reflects that.
            // Base calculation: Start at 100, deduct 5-10 points per missing skill.
            // But we also respect the AI's qualitative assessment if it's lower.
            const calculatedScore = Math.max(0, 100 - (finalMissingCount * 10)); // Deduct 10 per missing skill

            // We take the averge of AI score and Calculated score to balance nuance with facts
            const currentScore = verifiedAnalysis.matchScore || 50;
            verifiedAnalysis.matchScore = Math.round((currentScore + calculatedScore) / 2);

            console.log(`[Score Logic] ${finalMissingCount} missing skills. Adjusted score to ${verifiedAnalysis.matchScore}`);
        }

        verifiedAnalysis.skillGapAnalysis.missingKeywords = verifiedMissing;

        return verifiedAnalysis;
    } catch (error) {
        console.error("Analysis Pipeline Error:", error);
        throw error;
    }
}