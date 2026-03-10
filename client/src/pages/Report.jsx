import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Loader2, AlertTriangle, BugIcon, Activity, CheckCircle2, ChevronLeft, ShieldAlert, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Report = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBugsModal, setShowBugsModal] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5001');
        const response = await axios.get(`${API_URL}/api/report/${id}`);
        setReport(response.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch report");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.98, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.4, 0.25, 1] } }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-white flex flex-col items-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-slate-800 font-bold text-lg tracking-tight">Compiling Final Report...</p>
      </div>
    </div>
  );

  if (error) return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto mt-12 bg-red-50 text-red-700 p-8 rounded-3xl border border-red-200 text-center shadow-sm">
      <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
      <h2 className="text-2xl font-extrabold mb-2 tracking-tight">Analysis Error</h2>
      <p className="font-medium">{error}</p>
      <Link to="/analyzer" className="mt-6 inline-flex items-center gap-2 bg-red-100 px-6 py-3 rounded-full text-red-700 font-bold hover:bg-red-200 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Go back to Analyzer
      </Link>
    </motion.div>
  );

  if (!report) return null;

  const {
    repo_url,
    languages_detected,
    ai_scores,
    overall_ai_score,
    bugs,
    bug_details,
    security_issues,
    suggestions,
    created_at
  } = report;

  const aiScoreData = {
    labels: [...Object.keys(ai_scores)],
    datasets: [{
      label: 'AI Probability (%)',
      data: [...Object.values(ai_scores)],
      backgroundColor: 'rgba(17, 17, 17, 0.8)',
      borderRadius: 8,
    }]
  };

  const bugsData = {
    labels: Object.keys(bugs),
    datasets: [{
      label: 'Bugs Found',
      data: Object.values(bugs),
      backgroundColor: 'rgba(239, 68, 68, 0.8)',
      borderRadius: 8,
    }]
  };

  const getScoreColor = (score) => {
    if (score > 70) return 'text-red-500';
    if (score > 40) return 'text-amber-500';
    return 'text-emerald-500';
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto pb-24 px-4"
    >
      <motion.div variants={itemVariants} className="mb-8">
        <Link to="/history" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#111] font-semibold transition-colors bg-white/60 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200 shadow-sm">
          <ChevronLeft className="w-4 h-4" /> Back to History
        </Link>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white overflow-hidden mb-8">
        <div className="bg-[#111] text-white p-10 md:p-14 relative overflow-hidden">
          <div className="absolute top-[-50%] right-[-10%] w-[60%] h-[200%] bg-blue-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-20" />
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight relative z-10">Analysis Dashboard</h1>
          <p className="text-slate-300 break-all mb-8 font-medium text-lg relative z-10">
            {repo_url}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm relative z-10">
            <span className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 font-medium">
              Analyzed on {new Date(created_at).toLocaleString()}
            </span>
            <span className="flex items-center gap-2 text-emerald-400 font-bold bg-emerald-400/10 px-4 py-2 rounded-full border border-emerald-400/20">
              <CheckCircle2 className="w-4 h-4" /> Complete
            </span>
          </div>
        </div>

        <div className="p-8 md:p-12">
          <div className="grid lg:grid-cols-3 gap-8 mb-12">

            {/* Main Score Card */}
            <motion.div variants={itemVariants} className="lg:col-span-1 bg-slate-50 p-8 rounded-[2rem] border border-slate-100 flex flex-col items-center justify-center text-center relative overflow-hidden group hover:shadow-md transition-shadow">
              <h2 className="text-slate-500 font-bold mb-6 tracking-widest uppercase text-xs">Total AI Probability</h2>
              <div className="relative">
                <svg className="w-48 h-48 transform -rotate-90">
                  <circle cx="96" cy="96" r="84" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-200" />
                  <circle
                    cx="96" cy="96" r="84" stroke="currentColor" strokeWidth="12" fill="transparent"
                    strokeDasharray={527.787}
                    strokeDashoffset={527.787 - (overall_ai_score / 100) * 527.787}
                    className={`${getScoreColor(overall_ai_score)} transition-all duration-1000 ease-out`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-6xl font-black ${getScoreColor(overall_ai_score)}`}>
                    {overall_ai_score}<span className="text-3xl">%</span>
                  </span>
                </div>
              </div>
              <p className="mt-8 text-base font-semibold text-slate-700 bg-white px-6 py-3 rounded-full shadow-sm border border-slate-100">
                {overall_ai_score > 70 ? "High AI Authorship" : overall_ai_score > 40 ? "Mixed Authorship" : "Human Written"}
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-center">
                <h3 className="text-slate-500 font-bold mb-4 tracking-widest uppercase text-xs">Technologies Detected</h3>
                <div className="flex flex-wrap gap-2">
                  {languages_detected.map(lang => (
                    <span key={lang} className="px-4 py-2 bg-[#111] text-white rounded-full text-sm font-bold shadow-md">
                      {lang}
                    </span>
                  ))}
                  {languages_detected.length === 0 && <span className="text-slate-400 font-medium italic">Unrecognized</span>}
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-center gap-4">
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-2xl border border-red-100">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-100 p-2 rounded-full"><BugIcon className="text-red-600 w-5 h-5" /></div>
                    <span className="font-bold text-slate-800">Syntax Bugs</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-black text-red-600">{Object.values(bugs).reduce((a, b) => a + b, 0)}</span>
                    {bug_details && bug_details.length > 0 && (
                      <button
                        onClick={() => setShowBugsModal(true)}
                        className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full hover:bg-red-700 transition"
                      >
                        See bugs
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-2xl border border-purple-100">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-2 rounded-full"><ShieldAlert className="text-purple-600 w-5 h-5" /></div>
                    <span className="font-bold text-slate-800">Security Risks</span>
                  </div>
                  <span className="text-2xl font-black text-purple-600">{security_issues}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Charts */}
          <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
              <h3 className="text-sm font-bold mb-6 text-slate-800 uppercase tracking-widest">AI Profile per Language</h3>
              <div className="h-64">
                <Bar data={aiScoreData} options={{ maintainAspectRatio: false, scales: { y: { max: 100 } } }} />
              </div>
            </div>

            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
              <h3 className="text-sm font-bold mb-6 text-slate-800 uppercase tracking-widest">Bug Distribution</h3>
              <div className="h-64">
                {Object.keys(bugs).length > 0 ? (
                  <Bar data={bugsData} options={{ maintainAspectRatio: false }} />
                ) : (
                  <div className="h-full flex items-center justify-center font-medium text-slate-400 bg-white rounded-xl border border-slate-100">
                    Pristine codebase. No bugs detected.
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Actionable Insights */}
          <motion.div variants={itemVariants}>
            <h3 className="flex items-center gap-3 text-2xl font-extrabold mb-6 text-slate-900 tracking-tight">
              <Zap className="text-blue-600 w-8 h-8 p-1.5 bg-blue-100 rounded-lg" /> Actionable Insights
            </h3>
            <div className="bg-[#111] rounded-[2rem] p-8 md:p-10 shadow-xl overflow-hidden relative">
              <div className="absolute top-[-50%] right-[-10%] w-[30%] h-[200%] bg-white rounded-full mix-blend-overlay filter blur-[100px] opacity-10" />
              {suggestions && suggestions.length > 0 ? (
                <ul className="space-y-4">
                  {suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-4 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/20 transition-colors">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </span>
                      <p className="text-white font-medium text-lg pt-0.5 leading-relaxed">{suggestion}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-8 text-center border border-white/10 border-dashed rounded-2xl">
                  <p className="text-slate-400 font-medium text-lg">No critical suggestions generated at this time.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Bugs Modal */}
      {showBugsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white max-w-4xl w-full max-h-[80vh] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                <BugIcon className="text-red-500 w-6 h-6" /> Bug Details
              </h3>
              <button
                onClick={() => setShowBugsModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 transition font-bold"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50">
              {bug_details.map((bug, idx) => (
                <div key={idx} className="mb-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                  <div className="flex flex-col mb-3">
                    <h4 className="font-bold text-slate-800 text-lg mb-1">{bug.description}</h4>
                    <span className="text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded inline-flex self-start border border-slate-200">
                      <span className="font-semibold mr-1">File:</span> {bug.file} <span className="mx-2 text-slate-400">|</span> <span className="font-semibold mr-1">Line:</span> {bug.line}
                    </span>
                  </div>
                  <div className="bg-red-50/50 border border-red-100 rounded-xl p-3 mb-3 font-mono text-sm text-slate-700 overflow-x-auto whitespace-pre-wrap">
                    {bug.snippet}
                  </div>
                  <div className="flex gap-3 p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600 mt-0.5" />
                    <div>
                      <span className="font-bold block text-sm mb-0.5">Suggested Fix:</span>
                      <span className="text-sm leading-relaxed">{bug.fix}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Report;
