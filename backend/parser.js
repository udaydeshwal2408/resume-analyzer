import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfModule = require('pdf-parse');
// Handle both CommonJS and potentially weird import structures
const pdf = pdfModule.default || pdfModule;

export async function getResumeText(filePath) {
    try {
        const dataBuffer = fs.readFileSync(filePath);
        const logMsg = `[Parser] Reading: ${filePath}, Size: ${dataBuffer.length}\n`;
        fs.appendFileSync('parser.log', logMsg);

        console.log('[Parser] Type of pdf import:', typeof pdf); // Debug log
        if (typeof pdf !== 'function') {
            console.error('[Parser] pdf-parse import is not a function!', pdf);
            throw new Error('pdf-parse library not loaded correctly.');
        }



        const data = await pdf(dataBuffer);

        // [FIX] Post-processing: Replace newlines with spaces to prevent "wordmerging"
        // and excessive whitespace.
        data.text = data.text.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();

        const logMsg2 = `[Parser] Extracted Length: ${data.text.length}\n`;
        fs.appendFileSync('parser.log', logMsg2);

        return data.text;
    } catch (error) {
        fs.appendFileSync('parser.log', `[Parser ERROR] ${error.message}\n`);
        console.error("[Parser] Error parsing PDF:", error); // Detailed log
        throw error; // Re-throw to be caught by analyzer
    }
};