import React, { useState } from 'react';
import UploadSection from './components/UploadSection'; // We'll build this next
import ResultsDashboard from './components/ResultsDashboard'; // And this
import { motion, AnimatePresence } from 'framer-motion';

function App() {
    const [analysisResult, setAnalysisResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploadKey, setUploadKey] = useState(0);

    const handleReset = () => {
        setAnalysisResult(null);
        setUploadKey(prev => prev + 1);
    };

    return (
        <div className="min-h-screen">
            <div className="container">

                {/* Header / Nav */}
                <header className="flex justify-between items-center py-6 mb-10">
                    <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
                        ResumeAI
                    </div>
                    <button onClick={handleReset} className="text-slate-400 hover:text-white transition cursor-pointer">Reset</button>
                </header>

                <AnimatePresence mode="wait">
                    {!analysisResult ? (
                        <motion.div
                            key={`upload-${uploadKey}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="text-center mb-16 relative">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-20 -z-10"></div>
                                <h1 className="mb-4 animate-float">Beat the ATS. Get the Job.</h1>
                                <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                                    Upload your resume and the job description. Our AI analyzes the gap,
                                    finds missing skills, and builds a custom roadmap for you.
                                </p>
                            </div>

                            <UploadSection
                                setLoading={setLoading}
                                setAnalysisResult={setAnalysisResult}
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8 }}
                        >
                            <ResultsDashboard data={analysisResult} />
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}

export default App;
