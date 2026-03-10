import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap, Code2, BugPlay } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.4, 0.25, 1] } }
    };

    return (
        <div className="flex flex-col items-center relative overflow-hidden bg-slate-50 min-h-screen">
            {/* Ambient background glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full mix-blend-multiply filter blur-[120px] opacity-20 pointer-events-none animate-blob" />
            <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-purple-500 rounded-full mix-blend-multiply filter blur-[120px] opacity-20 pointer-events-none animate-blob animation-delay-2000" />
            <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-emerald-500 rounded-full mix-blend-multiply filter blur-[120px] opacity-20 pointer-events-none animate-blob animation-delay-4000" />

            {/* Hero Section */}
            <motion.section
                className="text-center py-32 px-4 max-w-5xl mx-auto relative z-10 w-full"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={itemVariants} className="inline-block mb-4">
                    <span className="bg-white/60 backdrop-blur-md border border-slate-200 shadow-sm text-slate-800 text-sm font-semibold px-4 py-1.5 rounded-full inline-flex items-center gap-2 tracking-wide uppercase">
                        <Zap className="w-4 h-4 text-blue-600" /> CodeLens AI v2.0
                    </span>
                </motion.div>

                <motion.h1
                    variants={itemVariants}
                    className="text-5xl sm:text-6xl md:text-8xl font-extrabold text-[#111111] tracking-tight leading-[1.05] mb-6 sm:mb-8 px-2"
                >
                    Uncover the truth behind <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-300% animate-gradient">
                        every line of code.
                    </span>
                </motion.h1>

                <motion.p
                    variants={itemVariants}
                    className="text-lg sm:text-xl md:text-2xl text-slate-500 mb-10 sm:mb-12 max-w-3xl mx-auto font-medium leading-relaxed px-4 sm:px-0"
                >
                    Pro-level repository and website code analysis. Detect AI authorship, pinpoint critical bugs, flag security risks, and instantly optimize performance.
                </motion.p>

                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 px-4">
                    <Link
                        to="/analyzer"
                        className="group flex items-center justify-center gap-2 bg-[#111111] hover:bg-black text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-full font-semibold text-base sm:text-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(0,0,0,0.2)] w-full sm:w-auto"
                    >
                        Start Analyzing
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        to="/history"
                        className="flex items-center justify-center gap-2 bg-white/70 backdrop-blur-md hover:bg-white text-slate-800 border border-slate-200 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full font-semibold text-base sm:text-lg transition-all duration-300 hover:shadow-lg w-full sm:w-auto"
                    >
                        View Reports
                    </Link>
                </motion.div>
            </motion.section>

            {/* Features Grid */}
            <motion.section
                className="py-24 px-4 w-full max-w-7xl relative z-10"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
            >
                <motion.div variants={itemVariants} className="text-center mb-12 sm:mb-16">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#111111] tracking-tight leading-tight">Everything you need to ship confident code.</h2>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <FeatureCard
                        icon={<Code2 className="w-8 h-8 text-blue-600" />}
                        title="AI Authorship"
                        description="Identify the probability of AI-generated code across multiple languages with extreme precision."
                        variants={itemVariants}
                    />
                    <FeatureCard
                        icon={<BugPlay className="w-8 h-8 text-indigo-600" />}
                        title="Bug Discovery"
                        description="Automatically spot logical flaws, memory leaks, and unused structures in your codebase."
                        variants={itemVariants}
                    />
                    <FeatureCard
                        icon={<ShieldCheck className="w-8 h-8 text-purple-600" />}
                        title="Security Radar"
                        description="Instantly detect exposed API keys, dangerous eval patterns, and missing security headers."
                        variants={itemVariants}
                    />
                    <FeatureCard
                        icon={<Zap className="w-8 h-8 text-slate-900" />}
                        title="Performance"
                        description="Diagnose bloated files, duplicate architectures, and get actionable speed optimizations."
                        variants={itemVariants}
                    />
                </div>
            </motion.section>
        </div>
    );
};

const FeatureCard = ({ icon, title, description, variants }) => (
    <motion.div
        variants={variants}
        className="bg-white/60 backdrop-blur-xl p-8 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 group overflow-hidden relative"
    >
        {/* Subtle shine effect */}
        <div className="absolute top-0 left-[-100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] group-hover:animate-shine" />

        <div className="bg-slate-100/80 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-inner border border-white">
            {icon}
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">{title}</h3>
        <p className="text-slate-600 font-medium leading-relaxed">{description}</p>
    </motion.div>
);

export default Home;
