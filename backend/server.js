import "dotenv/config"; // Load env vars immediately
import fs from "fs";
import express from "express";
import cors from "cors";
import upload from "./middleware/upload.middleware.js";
import { analyzeResume } from "./analyzer.js";

const app = express();
const PORT = process.env.PORT || 8080;

// FORCE KEEP-ALIVE: Prevent process from exiting if event loop empties
setInterval(() => {
    // This empty interval keeps the process running indefinitely
}, 1000 * 60 * 60);

// Log exit code for debugging
process.on('exit', (code) => {
    console.log(`❌ Server process exited with code: ${code}`);
});

app.use(cors()); // Allow Frontend to talk to Backend
app.use(express.json()); // Good practice

// Health check
app.get("/", (req, res) => {
    res.send("Resume Analyzer Backend is Running!");
});

app.post("/api/analyze", upload.single("resume"), async (req, res) => {
    try {
        const { jobDescription } = req.body;

        if (!req.file) {
            return res.status(400).json({ success: false, error: "No resume file uploaded." });
        }

        const filePath = req.file.path;
        console.log(`Processing file: ${filePath}`);

        const analysis = await analyzeResume(filePath, jobDescription);

        res.status(200).json({
            success: true,
            data: analysis
        });
    } catch (err) {
        console.error("Server Error:", err);
        // Log to file for debugging
        fs.appendFileSync('backend_error.log', `[${new Date().toISOString()}] ${err.stack}\n\n`);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Global Error Handlers to prevent crash
process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! 💥 Shutting down gracefully...');
    console.error(err.name, err.message);
    console.error(err.stack);
});

process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥');
    console.error(err);
});