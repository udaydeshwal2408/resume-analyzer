import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { getResumeText } from "./parser.js";
import { processResumeRAG } from "./rag_service.js"; // Our new RAG logic
import dotenv from "dotenv";

dotenv.config();

// 1. Initialize the Model
const model = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.3-70b-versatile",
    temperature: 0.2, // Lower temperature = more consistent/factual output
});

export async function analyzeResume(resumeFilePath, jobDescription) {
    try {
        console.log("--- Starting Analysis Pipeline ---");

        // 2. Extract raw text from PDF
        const rawResumeText = await getResumeText(resumeFilePath);
        if (!rawResumeText) throw new Error("Failed to extract text from PDF.");

        // 3. RAG STEP: Semantic Retrieval
        // Instead of the whole resume, we get the 'Influential Areas'
        const relevantContext = await processResumeRAG(rawResumeText, jobDescription);

        // 4. Setup JSON Parser
        const parser = new JsonOutputParser();

        // 5. Define the Prompt Template
        const template = `
        You are a Senior Technical Recruiter and Career Coach. 
        Analyze the provided Resume Context against the Job Description.

        RESUME CONTEXT (Relevant Sections):
        {resumeContext}

        JOB DESCRIPTION:
        {jobDescription}

        Return the analysis ONLY as a valid JSON object. Do not include any intro or outro text.
        Structure:
        {{
            "matchScore": (number between 0-100),
            "summary": "2-line summary of fit",
            "skillGapAnalysis": {{
                "missingKeywords": ["skill1", "skill2"],
                "majorGap": "The most critical missing skill"
            }},
            "roadmap": {{
                "week1": "Basics of the major gap",
                "week2": "Core concepts",
                "week3": "Hands-on project",
                "week4": "Interview preparation"
            }},
            "courseRecommendation": "Name of a free resource/playlist"
        }}
        
        {format_instructions}`;

        const prompt = new PromptTemplate({
            template: template,
            inputVariables: ["resumeContext", "jobDescription"],
            partialVariables: { format_instructions: parser.getFormatInstructions() }
        });

        // 6. The Pipeline (The "Pipe" assembly line)
        const chain = prompt.pipe(model).pipe(parser);

        console.log("Llama-3 is generating structured analysis...");
        const response = await chain.invoke({
            resumeContext: relevantContext,
            jobDescription: jobDescription
        });

        return response; // This is now a clean JS Object!

    } catch (error) {
        console.error("Error in analyzer.js:", error.message);
        throw error;
    }
}