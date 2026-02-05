
export class SimpleVectorStore {
    constructor(embeddings) {
        this.embeddings = embeddings;
        this.documents = []; // { pageContent, metadata, embedding }
    }

    static async fromDocuments(docs, embeddings) {
        const store = new SimpleVectorStore(embeddings);
        await store.addDocuments(docs);
        return store;
    }

    async addDocuments(docs) {
        // Batch embed for efficiency? 
        // Xenova/transformers is local, so line-by-line is fine or batch.
        // Let's do map.
        const texts = docs.map(d => d.pageContent);
        const embeddedVectors = await this.embeddings.embedDocuments(texts);

        docs.forEach((doc, i) => {
            this.documents.push({
                pageContent: doc.pageContent,
                metadata: doc.metadata,
                embedding: embeddedVectors[i]
            });
        });
    }

    async similaritySearch(query, k = 4) {
        const queryEmbedding = await this.embeddings.embedQuery(query);

        // Calculate similarity for all docs
        const scoredDocs = this.documents.map(doc => {
            return {
                ...doc,
                score: this.cosineSimilarity(queryEmbedding, doc.embedding)
            };
        });

        // Sort descending
        scoredDocs.sort((a, b) => b.score - a.score);

        // Return top k
        return scoredDocs.slice(0, k).map(d => ({
            pageContent: d.pageContent,
            metadata: d.metadata
        }));
    }

    cosineSimilarity(vecA, vecB) {
        let dotProduct = 0.0;
        let normA = 0.0;
        let normB = 0.0;
        for (let i = 0; i < vecA.length; i++) {
            dotProduct += vecA[i] * vecB[i];
            normA += vecA[i] * vecA[i];
            normB += vecB[i] * vecB[i];
        }
        if (normA === 0 || normB === 0) return 0;
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }
}
