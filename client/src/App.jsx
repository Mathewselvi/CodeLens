import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Analyzer from './pages/Analyzer';
import Report from './pages/Report';
import History from './pages/History';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-grow w-full pt-28 pb-12">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analyzer" element={<Analyzer />} />
          <Route path="/report/:id" element={<Report />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </main>
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-slate-500">
        <p>&copy; {new Date().getFullYear()} AI Code Insight. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
