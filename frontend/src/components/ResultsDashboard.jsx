import React from "react";
import { motion } from "framer-motion";
import {
    AlertCircle,
    CheckCircle,
    MapPinned as MapIcon,
    Sparkles,
    BookOpen,
    ArrowRight,
    Target,
    Trophy,
    Star,
    BarChart3,
    Zap,
    ChevronRight,
    LayoutDashboard
} from "lucide-react";

const ResultsDashboard = ({ data }) => {
    if (!data) return null;

    const { matchScore, summary, skillGapAnalysis, roadmap, courseRecommendation } = data;
    const score = matchScore || 0;

    const getScoreStyles = (s) => {
        if (s >= 80) return { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" };
        if (s >= 60) return { color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" };
        return { color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" };
    };

    const theme = getScoreStyles(score);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.12 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
    };

    return (
        <motion.div
            className="min-h-screen bg-[#050508] text-slate-300 font-sans selection:bg-indigo-500/30 overflow-hidden"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            {/* Ambient Background Glows */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
                <div className="absolute top-[20%] -right-[10%] w-[30%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full" />
            </div>

            <div className="relative max-w-7xl mx-auto px-6 py-12">

                {/* 1. Header with Breadcrumb-style UI */}
                <motion.header variants={itemVariants} className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-[0.2em] mb-3">
                            <LayoutDashboard size={14} />
                            <span>Recruiter Intelligence v1.0</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                            Optimization <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Report</span>
                        </h1>
                    </div>
                    <div className="flex gap-3 text-sm font-medium">
                        <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
                            Status: <span className="text-emerald-400">Analysis Complete</span>
                        </div>
                    </div>
                </motion.header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">

                    {/* 2. Massive Score Hero */}
                    <motion.div
                        variants={itemVariants}
                        className="lg:col-span-4 group relative bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-10 flex flex-col items-center justify-center backdrop-blur-xl overflow-hidden shadow-2xl"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${theme.bg} opacity-20 group-hover:opacity-30 transition-opacity duration-500`} />

                        <div className="relative w-56 h-56 mb-8 transform group-hover:scale-105 transition-transform duration-700">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="112" cy="112" r="100" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/5" />
                                <motion.circle
                                    cx="112" cy="112" r="100"
                                    stroke="currentColor"
                                    strokeWidth="10"
                                    fill="transparent"
                                    strokeDasharray={628}
                                    initial={{ strokeDashoffset: 628 }}
                                    animate={{ strokeDashoffset: 628 - (628 * score) / 100 }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    strokeLinecap="round"
                                    className={`${theme.color} drop-shadow-[0_0_15px_rgba(var(--color-glow))]`}
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <motion.span className={`text-7xl font-black tracking-tighter ${theme.color}`}>
                                    {score}
                                </motion.span>
                                <span className="text-xs uppercase tracking-[0.3em] text-slate-500 font-black">Score</span>
                            </div>
                        </div>
                        <div className="text-center z-10">
                            <h3 className="text-white font-bold text-xl mb-1">Professional Fit</h3>
                            <p className="text-slate-500 text-sm">Based on ATS semantic matching</p>
                        </div>
                    </motion.div>

                    {/* 3. AI Summary with Modern Border Beam */}
                    <motion.div
                        variants={itemVariants}
                        className="lg:col-span-8 bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-xl shadow-2xl flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400 border border-indigo-500/20">
                                    <BarChart3 size={24} />
                                </div>
                                <h2 className="text-2xl font-bold text-white tracking-tight">Executive Summary</h2>
                            </div>
                            <div className="relative">
                                <div className="absolute -left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-transparent rounded-full" />
                                <p className="text-xl leading-[1.6] text-slate-300 font-light italic">
                                    "{summary || "Initial analysis indicates a high degree of core competency alignment, though specific technical vertical gaps remain present."}"
                                </p>
                            </div>
                        </div>
                        <div className="mt-10 flex flex-wrap gap-4">
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5 text-xs font-bold text-slate-400">
                                <Zap size={14} className="text-amber-400" /> PROBABILISTIC MATCH
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5 text-xs font-bold text-slate-400">
                                <Target size={14} className="text-indigo-400" /> SEMANTICALLY VERIFIED
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* 4. Skills & Major Gap Section */}
                    <div className="space-y-8">
                        <motion.div variants={itemVariants} className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl shadow-2xl">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-rose-500/10 rounded-2xl text-rose-400 border border-rose-500/20">
                                        <AlertCircle size={22} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Skill Discrepancies</h3>
                                </div>
                                <span className="text-xs font-black text-rose-500/80 uppercase px-3 py-1 bg-rose-500/10 rounded-lg">Action Required</span>
                            </div>

                            <div className="flex flex-wrap gap-3 mb-10">
                                {(() => {
                                    // Robust extraction of missing keywords
                                    const missingSkills = (skillGapAnalysis?.missingKeywords)
                                        || (data?.missingKeywords)
                                        || [];

                                    const hasSkills = Array.isArray(missingSkills) && missingSkills.length > 0;

                                    if (hasSkills) {
                                        return missingSkills.map((skill, idx) => (
                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                                key={idx}
                                                className="px-5 py-2.5 bg-white/5 border border-white/10 text-slate-200 rounded-2xl text-sm font-semibold hover:border-indigo-500/50 transition-all cursor-default"
                                            >
                                                {skill}
                                            </motion.div>
                                        ));
                                    } else {
                                        return (
                                            <div className="w-full p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-3xl flex items-center gap-4 text-emerald-400">
                                                <CheckCircle size={24} />
                                                <span className="font-bold">Resume meets all indexed technical requirements.</span>
                                            </div>
                                        );
                                    }
                                })()}
                            </div>

                            {skillGapAnalysis?.majorGap && (
                                <div className="p-6 bg-gradient-to-r from-indigo-500/10 to-transparent rounded-3xl border border-indigo-500/20">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">High Impact Gap</p>
                                            <h4 className="text-2xl font-black text-white">{skillGapAnalysis.majorGap}</h4>
                                        </div>
                                        <Trophy size={32} className="text-indigo-400/30" />
                                    </div>
                                </div>
                            )}
                        </motion.div>

                        {/* Learning Card */}
                        <motion.div variants={itemVariants} className="relative group bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden">
                            <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                                <BookOpen size={180} />
                            </div>
                            <div className="relative z-10">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[10px] font-black text-white uppercase tracking-widest mb-6">
                                    <Star size={12} className="fill-white" /> Recommended Growth
                                </div>
                                <h3 className="text-3xl font-black text-white mb-6 leading-tight">Master {skillGapAnalysis?.majorGap || "Your Tech Stack"}</h3>
                                <p className="text-indigo-100 text-lg mb-8 max-w-sm font-medium leading-relaxed">
                                    {courseRecommendation || "Access curated technical resources to bridge your current placement gaps."}
                                </p>
                                <button
                                    onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(skillGapAnalysis?.majorGap || 'tech')} tutorial`, '_blank')}
                                    className="bg-white text-indigo-900 px-8 py-4 rounded-2xl font-black text-sm inline-flex items-center gap-3 hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] transition-all transform active:scale-95"
                                >
                                    Explore Pathway <ChevronRight size={18} />
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    {/* 5. Modern Timeline Roadmap */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-xl shadow-2xl"
                    >
                        <div className="flex items-center gap-4 mb-12">
                            <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-400 border border-purple-500/20">
                                <MapIcon size={24} />
                            </div>
                            <h3 className="text-2xl font-bold text-white tracking-tight">Upskilling Roadmap</h3>
                        </div>

                        <div className="space-y-6">
                            {roadmap && Object.entries(roadmap).map(([week, task], idx) => {
                                const stepIcons = [<Target />, <BookOpen />, <Zap />, <Trophy />];
                                const stepColors = ["indigo", "purple", "blue", "cyan"];

                                return (
                                    <div key={week} className="group flex gap-8">
                                        <div className="flex flex-col items-center">
                                            <div className={`w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-indigo-600 transition-all duration-300 shadow-xl`}>
                                                {stepIcons[idx % 4]}
                                            </div>
                                            {idx < 3 && <div className="w-px h-full bg-gradient-to-b from-white/10 to-transparent mt-2" />}
                                        </div>
                                        <div className="pb-8 flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400">
                                                    {week.replace(/([A-Z])/g, ' $1').trim()}
                                                </h4>
                                                <span className="text-[10px] font-bold text-slate-600">Phase 0{idx + 1}</span>
                                            </div>
                                            <div className="bg-white/[0.03] border border-white/5 p-5 rounded-3xl group-hover:border-white/20 transition-colors">
                                                <p className="text-slate-300 font-medium text-sm leading-relaxed">
                                                    {task}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>

                <motion.footer variants={itemVariants} className="mt-20 pt-8 border-t border-white/5 text-center">
                    <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.5em]">
                        Intelligence Report &bull; Powered by Gemini AI &bull; {new Date().getFullYear()}
                    </p>
                </motion.footer>
            </div>
        </motion.div>
    );
};

export default ResultsDashboard;