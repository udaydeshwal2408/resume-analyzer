import fs from 'fs';
import pdf from 'pdf-parse';

export async function getResumeText(filePath) {
    try {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdf(dataBuffer);
        return data.text.replace(/\s+/g, ' ').trim();
    } catch (error) {
        console.error("Parser Error:", error.message);
        return null;
    }
};