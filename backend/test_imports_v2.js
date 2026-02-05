
console.log("Testing imports V2...");

try {
    const { RecursiveCharacterTextSplitter } = await import("@langchain/textsplitters");
    console.log("✅ TextSplitter imported");
} catch (e) {
    console.error("❌ TextSplitter failed:", e.message);
}

try {
    const { HuggingFaceTransformersEmbeddings } = await import("@langchain/community/embeddings/huggingface_transformers");
    console.log("✅ Embeddings imported");
} catch (e) {
    console.error("❌ Embeddings failed:", e.message);
}

try {
    const { SimpleVectorStore } = await import("./SimpleVectorStore.js");
    console.log("✅ SimpleVectorStore imported");
} catch (e) {
    console.error("❌ SimpleVectorStore failed:", e.message);
}

try {
    await import("./embeddings.js");
    console.log("✅ embeddings.js imported");
} catch (e) {
    console.error("❌ embeddings.js failed:", e.message);
}
