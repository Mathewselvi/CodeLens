import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Github, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Analyzer = () => {
  const navigate = useNavigate();
  const [inputUrl, setInputUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let response;
      const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5001');

      response = await axios.post(`${API_URL}/api/analyze/repository`, { repoUrl: inputUrl });

      if (response && response.data && response.data.reportId) {
        navigate(`/report/${response.data.reportId}`);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      let errMsg = "An error occurred during analysis.";
      if (err.response?.data) {
        if (typeof err.response.data.error === 'string') errMsg = err.response.data.error;
        else if (typeof err.response.data.message === 'string') errMsg = err.response.data.message;
        else if (typeof err.response.data === 'string') errMsg = err.response.data;
        else errMsg = JSON.stringify(err.response.data);
      } else if (err.message) {
        errMsg = err.message;
      }
      setError(errMsg);
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-3xl mx-auto w-full py-12 px-4 relative z-10"
    >
      <div className="text-center mb-12">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold text-[#111] mb-4 tracking-tight"
        >
          Start New Analysis
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-slate-500 text-lg font-medium"
        >
          Enter a public GitHub repository link to initiate a deep codebase scan.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white overflow-hidden relative"
      >
        {/* Content */}
        <div className="p-8 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-8">

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <label className="block text-sm font-semibold text-slate-700 mb-3 tracking-wide uppercase">
                Public GitHub Repository URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Github className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  type="url"
                  required
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="https://github.com/username/repository"
                  className="w-full pl-12 pr-5 py-4 rounded-xl border-2 border-slate-200 focus:border-[#111] focus:ring-4 focus:ring-slate-100 bg-slate-50 focus:bg-white text-lg outline-none transition-all placeholder:text-slate-400 font-medium text-slate-900"
                  disabled={loading}
                />
              </div>
            </motion.div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-3 text-red-600 bg-red-50/80 backdrop-blur-sm border border-red-100 p-4 rounded-xl text-sm font-medium"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p>{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading || !inputUrl}
              className="w-full bg-[#111] hover:bg-black disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 text-lg shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Executing Analysis...
                </>
              ) : (
                'Run Analysis'
              )}
            </button>
          </form>
        </div>
      </motion.div>

      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-8 bg-blue-50/80 backdrop-blur-md border border-blue-100 p-8 rounded-[2rem] flex items-start gap-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
          >
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-blue-900 mb-2 text-xl tracking-tight">Analysis Phase In Progress</h4>
              <p className="text-blue-700/80 font-medium leading-relaxed">
                CodeLens is actively cloning resources, mapping abstract syntax trees, scanning structural vectors, and deploying heuristic AI detection algorithms. This process usually completes within 30 seconds.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Analyzer;
