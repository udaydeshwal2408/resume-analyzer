import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts"; // Fixed import path
import { getResumeText } from "./parser.js";
import dotenv from "dotenv";

dotenv.config();

// Initialize the Groq model
const model = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.3-70b-versatile", // Use 'model' instead of 'modelName'
});

async function main() {
    console.log("Reading resume...");
    
    // Ensure you have a file named 'sample_resume.pdf' in your project root
    const resumeText = await getResumeText("sample_resume.pdf");

    if (!resumeText) {
        console.error("Failed to extract resume text. Check if the file path is correct.");
        return;
    }

    const jobDescription = `
        Looking for a MERN Stack Developer. 
        Must know React, Node.js, and MongoDB. 
        Experience with AWS and Redis is a huge plus.
    `;

    // Prompt Template Configuration
    // Note: Use {{double braces}} for sections you want the AI to fill in 
    // but don't want LangChain to treat as an input variable.
    const template = `
        You are a Senior Technical Recruiter and Career Coach.
        Compare the following Resume with the Job Description.

        RESUME TEXT:
        {resumeText}

        JOB DESCRIPTION:
        {jobDescription}

        Provide the analysis in the following strict format:

        ### 1. Match Overview
        * **Match Score:** [0-100]%
        * **Summary:** A 2-line summary of the fit.

        ### 2. Skill Gap Analysis
        * **Missing Keywords:** [List 3-5 keywords]
        * **Major Skill Gap:** [Identify the most important skill the candidate is missing]

        ### 3. 4-Week Mastery Roadmap
        (Focus on the Major Skill Gap identified above)
        * **Week 1 (Basics):** [What to learn]
        * **Week 2 (Core Concepts):** [What to learn]
        * **Week 3 (Project):** [A small project to build using this skill]
        * **Week 4 (Interview Prep):** [Common interview questions for this skill]

        ### 4. Course Recommendation
        * Suggest one high-quality free resource (like a specific YouTube playlist, documentation, or freeCodeCamp link) for this skill.
    `;

    const prompt = new PromptTemplate({
        template: template,
        inputVariables: ["resumeText", "jobDescription"] // Names must match the single {braces} in template
    });

    // Create the Chain
    const chain = prompt.pipe(model);

    console.log("Analyzing with AI... (this may take a few seconds)");
    
    try {
        const result = await chain.invoke({
            resumeText: resumeText, 
            jobDescription: jobDescription
        });

        console.log("\n--- ANALYSIS RESULT ---");
        console.log(result.content);
    } catch (error) {
        console.error("Error during AI analysis:", error.message);
    }
}

main();