import { getResumeText } from './parser.js';
import path from 'path';

const fileName = 'uploads/1770310855494-resume1 (4).pdf';
const filePath = path.resolve(process.cwd(), fileName);

console.log(`Debug: processing ${filePath}`);

getResumeText(filePath)
    .then(text => {
        console.log("--- START EXTRACTED TEXT ---");
        console.log(text);
        console.log("--- END EXTRACTED TEXT ---");
    })
    .catch(err => {
        console.error("Debug Error:", err);
    });
