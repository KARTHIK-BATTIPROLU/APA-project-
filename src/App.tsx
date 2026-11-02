import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { fetchWebsiteData } from './data/loadData';
import { WebsiteData } from './data/schema';
import { Layout } from './components/Layout';
import { ErrorScreen } from './components/ErrorScreen';
import { Home } from './pages/Home';
import { BestDay } from './pages/BestDay';
import { BestTime } from './pages/BestTime';
import { GenreExplorer } from './pages/GenreExplorer';
import { Advisor } from './pages/Advisor';
import { Models } from './pages/Models';
import { Methodology } from './pages/Methodology';
import { Pitch } from './pages/Pitch';
import { Clock } from 'lucide-react';

export const App: React.FC = () => {
  const [data, setData] = useState<WebsiteData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    setError(null);
    fetchWebsiteData('/data/website_data.json')
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : String(err));
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f14] flex flex-col items-center justify-center text-slate-300 font-mono text-sm gap-4">
        <div className="w-12 h-12 rounded-xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center animate-pulse">
          <Clock className="w-6 h-6 text-brand-400 animate-spin" />
        </div>
        <div className="text-center space-y-1">
          <div className="font-bold text-white tracking-wide">DropClock Release-Window Advisor</div>
          <div className="text-xs text-slate-400">Loading and validating dataset schemas...</div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return <ErrorScreen message={error || 'Failed to initialize dataset'} onRetry={loadData} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Fullscreen Pitch Deck Route */}
        <Route path="/pitch" element={<Pitch data={data} />} />

        {/* Analytics App Routes inside Layout */}
        <Route element={<Layout data={data} />}>
          <Route path="/" element={<Home data={data} />} />
          <Route path="/day" element={<BestDay data={data} />} />
          <Route path="/time" element={<BestTime data={data} />} />
          <Route path="/genre" element={<GenreExplorer data={data} />} />
          <Route path="/advisor" element={<Advisor data={data} />} />
          <Route path="/models" element={<Models data={data} />} />
          <Route path="/methodology" element={<Methodology data={data} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
