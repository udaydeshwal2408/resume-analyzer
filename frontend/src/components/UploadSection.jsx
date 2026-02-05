import React, { useState } from "react";
import axios from "axios";
import { Upload, FileText, Sparkles, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const UploadSection = ({ setLoading, setAnalysisResult }) => {
    const [file, setFile] = useState(null);
    const [jobDesc, setJobDesc] = useState("");
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
            setError(null);
        }
    };

    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError(null);
        }
    };

    const handleAnalyze = async () => {
        if (!file || !jobDesc) {
            setError("Please provide both a resume and a job description.");
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append("resume", file);
        formData.append("jobDescription", jobDesc);

        try {
            const response = await axios.post("http://localhost:8080/api/analyze", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data.success) {
                setAnalysisResult(response.data.data);
            } else {
                setError("Analysis failed. Please try again.");
            }
        } catch (err) {
            console.error(err);
            setError("Server error. Ensure backend is running.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            className="glass-card max-w-3xl mx-auto"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
        >
            <div className="flex flex-col gap-6">

                <input
                    type="file"
                    id="resume-upload"
                    className="hidden"
                    accept=".pdf"
                    onChange={handleChange}
                />

                {/* Upload Area */}
                <div
                    className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer relative overflow-hidden
            ${dragActive ? "border-indigo-400 bg-indigo-500/10 scale-[1.02]" : "border-slate-700 hover:border-slate-500"}
            ${file ? "bg-green-500/10 border-green-500/50" : ""}
          `}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById("resume-upload").click()}
                >

                    <div className="z-10 relative flex flex-col items-center gap-3">
                        {file ? (
                            <>
                                <FileText className="w-12 h-12 text-green-400" />
                                <p className="text-lg font-medium text-green-300">{file.name}</p>
                                <p className="text-sm text-slate-400">{(file.size / 1024).toFixed(0)} KB • Ready to scan</p>
                            </>
                        ) : (
                            <>
                                <Upload className="w-12 h-12 text-indigo-400 mb-2" />
                                <p className="text-lg text-slate-200">Drag & drop your Resume (PDF)</p>
                                <p className="text-sm text-slate-500">or click to browse</p>
                            </>
                        )}
                    </div>
                </div>

                {/* Job Description */}
                <div className="relative group">
                    <textarea
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none h-40"
                        placeholder="Paste the Job Description here..."
                        value={jobDesc}
                        onChange={(e) => setJobDesc(e.target.value)}
                    ></textarea>
                    <div className="absolute top-4 right-4 text-slate-600 group-focus-within:text-indigo-400">
                        <FileText className="w-5 h-5" />
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="flex items-center gap-2 text-red-400 bg-red-400/10 p-3 rounded-lg">
                        <AlertCircle className="w-5 h-5" />
                        <span className="text-sm">{error}</span>
                    </div>
                )}

                {/* Action Button */}
                <button
                    onClick={handleAnalyze}
                    disabled={!file || !jobDesc}
                    className="btn-primary w-full py-4 flex items-center justify-center gap-2 group relative overflow-hidden"
                >
                    <span className="relative z-10 flex items-center gap-2">
                        Analyze Resume <Sparkles className="w-5 h-5 group-hover:animate-spin" />
                    </span>
                    {/* Subtle sheen effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </button>

            </div>
        </motion.div>
    );
};

export default UploadSection;
