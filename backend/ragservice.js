import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { SimpleVectorStore } from "./SimpleVectorStore.js";
import embeddings from "./embeddings.js"; // Your free Xenova model

export async function processResumeRAG(resumeText, jobDescription) {
    // 1. Chunking: Split resume into 1000-character pieces with overlap
    // Overlap ensures we don't cut a sentence in half!
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });
    const chunks = await splitter.createDocuments([resumeText]);

    // 2. Store: Create the "Brain" for this specific resume
    console.log(`Creating vector store for ${chunks.length} chunks...`);
    const vectorStore = await SimpleVectorStore.fromDocuments(chunks, embeddings);

    // 3. Search: Find the top 6 most relevant parts for the Job Description
    // This is the "Semantic Search" we discussed!
    const relevantDocs = await vectorStore.similaritySearch(jobDescription, 6);

    // Combine the relevant chunks into one context string
    const contextText = relevantDocs.map(doc => doc.pageContent).join("\n\n");

    return contextText;
}