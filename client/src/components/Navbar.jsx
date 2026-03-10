import { Link, useLocation } from 'react-router-dom';
import { Activity, History as HistoryIcon, Home as HomeIcon, Code } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItemClass = (path) => `flex items-center space-x-1 sm:space-x-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full transition-all duration-300 ${isActive(path)
    ? 'bg-[#111] text-white font-medium shadow-md'
    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
    }`;

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4 pointer-events-none"
    >
      <nav className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-full px-4 py-3 flex justify-between items-center w-full max-w-3xl pointer-events-auto">
        <Link to="/" className="flex items-center space-x-1 sm:space-x-2 pl-1 sm:pl-2 group shrink-0">
          <div className="bg-[#111] p-1.5 rounded-full group-hover:scale-105 transition-transform">
            <Code className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <span className="font-extrabold text-base sm:text-lg text-[#111] tracking-tight ml-1">CodeLens</span>
        </Link>

        <div className="flex items-center space-x-1 sm:space-x-2 shrink-0 overflow-x-auto no-scrollbar">
          <Link to="/" className={navItemClass('/')}>
            <HomeIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="text-xs sm:text-sm font-medium hidden xs:block sm:block">Home</span>
          </Link>
          <Link to="/analyzer" className={navItemClass('/analyzer')}>
            <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="text-xs sm:text-sm font-medium hidden xs:block sm:block">Analyzer</span>
          </Link>
          <Link to="/history" className={navItemClass('/history')}>
            <HistoryIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="text-xs sm:text-sm font-medium hidden xs:block sm:block">History</span>
          </Link>
        </div>
      </nav>
    </motion.div>
  );
};

export default Navbar;
