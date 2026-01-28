import express from "express";
import upload from "./middleware/upload.js"; // Import our new middleware
import { main as analyzeResume } from "./analyzer.js";

const app = express();

// The 'upload.single("resume")' tells Express: 
// "Before running my code, let Multer check for a file named 'resume'"
// Inside server.js
app.post("/api/analyze", upload.single("resume"), async (req, res) => {
    try {
        const { jobDescription } = req.body;
        const filePath = req.file.path;

        // Note: Change main() to analyzeResume if you renamed it
        const analysis = await analyzeResume(filePath, jobDescription);

        res.status(200).json({
            success: true,
            data: analysis // This will be the JSON from Llama
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});