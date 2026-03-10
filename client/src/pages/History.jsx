import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Loader2, Calendar, FileCode2, ChevronRight, Trash2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const History = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5001');
        const response = await axios.get(`${API_URL}/api/history`);
        setReports(response.data);
      } catch (err) {
        console.error("Failed to fetch history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm("Are you sure you want to delete this report?")) return;

    try {
      const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5001');
      await axios.delete(`${API_URL}/api/report/${id}`);
      setReports(reports.filter(r => r._id !== id));
    } catch (err) {
      console.error("Failed to delete report:", err);
      let errMsg = "Failed to delete report.";
      if (err.response?.data?.error) errMsg = err.response.data.error;
      else if (typeof err.response?.data === 'string') errMsg = err.response.data;
      alert(errMsg);
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm("Are you sure you want to delete ALL reports? This cannot be undone.")) return;

    try {
      const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5001');
      await axios.delete(`${API_URL}/api/history`);
      setReports([]);
    } catch (err) {
      console.error("Failed to clear history:", err);
      let errMsg = "Failed to clear history.";
      if (err.response?.data?.error) errMsg = err.response.data.error;
      else if (typeof err.response?.data === 'string') errMsg = err.response.data;
      alert(errMsg);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-5xl mx-auto py-12 px-4 relative z-10"
    >
      <div className="mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-extrabold text-[#111] mb-2 tracking-tight">Analysis History</motion.h1>
          <motion.p variants={itemVariants} className="text-slate-500 font-medium text-lg">Review and manage your past architectural scans.</motion.p>
        </div>

        <AnimatePresence>
          {reports.length > 0 && (
            <motion.button
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={handleClearHistory}
              className="flex items-center gap-2 px-6 py-3 bg-red-50/80 backdrop-blur-md text-red-600 border border-red-100/50 hover:bg-red-100 hover:text-red-700 rounded-full font-bold transition-colors shadow-sm"
            >
              <Trash2 className="w-5 h-5" />
              Clear History
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {loading ? (
        <div className="flex justify-center py-32">
          <Loader2 className="w-10 h-10 text-[#111] animate-spin" />
        </div>
      ) : reports.length === 0 ? (
        <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white p-16 text-center shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
          <FileCode2 className="w-20 h-20 text-slate-300 mx-auto mb-6" />
          <h3 className="text-2xl font-extrabold text-[#111] mb-3 tracking-tight">No analysis history</h3>
          <p className="text-slate-500 mb-8 font-medium text-lg max-w-md mx-auto">You haven't scanned any repositories or websites yet. Start your first analysis to see results here.</p>
          <Link to="/analyzer" className="inline-flex items-center gap-2 bg-[#111] hover:bg-black text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-lg">
            Start New Analysis <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.06)] relative">
          <div className="absolute top-[0%] left-[-10%] w-[30%] h-[50%] bg-blue-500 rounded-full mix-blend-overlay filter blur-[100px] opacity-10 pointer-events-none" />
          <div className="divide-y divide-slate-100/80 p-4 relative z-10">
            {reports.map((report) => (
              <motion.div
                key={report._id}
                variants={itemVariants}
                className="group p-2"
              >
                <Link
                  to={`/report/${report._id}`}
                  className="flex items-center justify-between p-6 rounded-3xl hover:bg-slate-50/80 hover:shadow-sm border border-transparent hover:border-slate-100 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-4 mb-3">
                      <h3 className="text-xl font-bold text-slate-900 truncate tracking-tight">{report.repo_url}</h3>
                      <span className={`text-sm font-bold px-3 py-1 rounded-full whitespace-nowrap ${report.overall_ai_score > 70 ? 'bg-red-100 text-red-700' :
                        report.overall_ai_score > 40 ? 'bg-amber-100 text-amber-700' :
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                        {report.overall_ai_score}% AI
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-slate-500 font-medium">
                      <span className="flex items-center gap-2 bg-slate-100/80 px-3 py-1.5 rounded-lg border border-slate-200/50">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {new Date(report.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                      <span className="hidden sm:inline bg-slate-100/80 px-3 py-1.5 rounded-lg border border-slate-200/50 truncate max-w-[200px] lg:max-w-none">
                        {report.languages_detected.length > 0 ? report.languages_detected.join(', ') : 'No identifiable code'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 sm:gap-6">
                    <button
                      onClick={(e) => handleDelete(e, report._id)}
                      className="p-3 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 z-10 relative"
                      title="Delete report"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <div className="p-3 bg-slate-50 group-hover:bg-[#111] rounded-xl transition-colors duration-300">
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors flex-shrink-0" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default History;
