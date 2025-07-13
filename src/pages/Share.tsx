import React, { useState } from 'react';
import { ArrowLeft, Share as ShareIcon } from 'lucide-react';

const COLOR_OPTIONS = [
  '#5E60CE', '#4CC9F0', '#4895EF', '#3A0CA3', '#7209B7',
  '#F72585', '#FF6B6B', '#F9C74F', '#F9844A', '#90BE6D',
  '#43AA8B', '#4D908E', '#577590', '#F3722C', '#F94144',
  '#F8961E', '#F9844A', '#FDCB6E', '#00B894', '#6C5CE7'
];

const THEME_OPTIONS = ['Light', 'Dark'];

const mockData = {
  title: 'UPSC CSE',
  progress: '9%',
  spentToday: '0h 00m',
  spentTotal: '2d 02h',
  partsDone: '10/62',
  branding: {
    appName: 'TrackIt',
    date: '13/07/2025',
  },
  customization: {
    theme: 'Dark',
    color: '#FF6B6B',
  },
};

const SharePage = () => {
  const [theme, setTheme] = useState<'Light' | 'Dark'>(mockData.customization.theme as 'Light' | 'Dark');
  const [color, setColor] = useState<string>(mockData.customization.color);
  const [showTimeSpent, setShowTimeSpent] = useState(true);
  const [showSpentGraph, setShowSpentGraph] = useState(false);

  // Local ColorSelector
  const ColorSelector = ({ options, value, onChange }: { options: string[]; value: string; onChange: (c: string) => void }) => (
    <div className="flex flex-wrap gap-2 py-2">
      {options.map((c, i) => (
        <button
          key={`${c}-${i}`}
          className={`w-7 h-7 rounded-full border-2 transition-all duration-150 focus:outline-none ${
            value === c ? 'border-blue-500 ring-2 ring-blue-400' : 'border-gray-500'
          }`}
          style={{ background: c }}
          aria-label={`Select color ${c}`}
          onClick={() => onChange(c)}
        />
      ))}
    </div>
  );

  // Local ShareCard
  const ShareCard = () => {
    // Compute faded color for stat cards in both modes
    const fadedColor = `${color}22`; // '22' is ~13% opacity in hex for both modes
    const statTextColor = theme === 'Light' ? 'text-black' : 'text-white';
    return (
      <div
        className={`rounded-2xl shadow-xl p-6 w-full max-w-xl mx-auto ${
          theme === 'Dark' ? 'bg-[#181B23] text-white' : 'bg-white text-gray-900'
        }`}
        style={{ background: theme === 'Dark' ? '#181B23' : '#fff' }}
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg font-bold tracking-wide">{mockData.title}</span>
            <span className="text-sm font-semibold" style={{ color }}>{mockData.progress}</span>
          </div>
          <div className="w-full h-3 bg-gray-700/40 rounded-full mb-2">
            <div
              className="h-3 rounded-full transition-all duration-300"
              style={{ width: mockData.progress, background: color }}
            />
          </div>
          <div className="flex flex-row items-center justify-between gap-2">
            {showTimeSpent && (
              <div className={`flex flex-col items-center flex-1 rounded-xl px-4 py-3`} style={{ background: fadedColor }}>
                <span className={`text-xs ${theme === 'Light' ? '' : 'text-gray-400'}`} style={theme === 'Light' ? { color } : {}}>
                  Spent Today
                </span>
                <span className={`font-bold text-base ${statTextColor}`}>{mockData.spentToday}</span>
              </div>
            )}
            <div className={`flex flex-col items-center flex-1 rounded-xl px-4 py-3`} style={{ background: fadedColor }}>
              <span className={`text-xs ${theme === 'Light' ? '' : 'text-gray-400'}`} style={theme === 'Light' ? { color } : {}}>
                Spent Total
              </span>
              <span className={`font-bold text-base ${statTextColor}`}>{mockData.spentTotal}</span>
            </div>
            <div className={`flex flex-col items-center flex-1 rounded-xl px-4 py-3`} style={{ background: fadedColor }}>
              <span className={`text-xs ${theme === 'Light' ? '' : 'text-gray-400'}`} style={theme === 'Light' ? { color } : {}}>
                Parts Done
              </span>
              <span className={`font-bold text-base ${statTextColor}`}>{mockData.partsDone}</span>
            </div>
          </div>
          {showSpentGraph && (
            <div className="mt-4 h-24 flex items-center justify-center bg-gray-800/40 rounded-xl">
              <span className="text-gray-400">[Spent Graph Placeholder]</span>
            </div>
          )}
          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-gray-400">{mockData.branding.appName}</span>
            <span className="text-xs text-gray-400">{mockData.branding.date}</span>
          </div>
        </div>
      </div>
    );
  };

  // Share handler
  const handleShare = async () => {
    const shareData = {
      title: 'Check out my progress on EduTrack!',
      text: 'Here is my latest study progress. Join me on EduTrack!',
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or error
      }
    } else {
      // Fallback: copy link
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch (err) {
        alert('Could not copy link.');
      }
    }
  };

  // Responsive background color for light/dark mode
  const bgColor = color;
  const cardTextColor = theme === 'Dark' ? 'text-white' : 'text-gray-900';

  return (
    <div className={`min-h-screen bg-slate-900 flex flex-col items-center overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900`}> 
      {/* Header Bar */}
      <header className="w-full h-16 flex items-center bg-[#11131a] shadow-lg px-4 fixed top-0 left-0 z-20">
        <button
          onClick={() => window.history.back()}
          className="p-2 rounded-full text-gray-400 hover:text-white transition-colors"
          title="Back"
          style={{ background: 'transparent', border: 'none' }}
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-white ml-2">Share Progress</h1>
        <div className="flex-1" />
        <button
          className="text-gray-400 hover:text-white transition-colors text-2xl px-2 focus:outline-none"
          title="Share"
          onClick={handleShare}
        >
          <ShareIcon className="w-6 h-6" />
        </button>
      </header>
      {/* Content below header, with no gap between header and background */}
      <main className="w-full max-w-2xl mx-auto pt-16 pb-24 px-2 flex flex-col items-center">
        {/* Color-changing background wrapping the shareable card, full viewport width, no gap from header */}
        <div className="w-screen max-w-none flex justify-center items-center" style={{ background: bgColor, padding: '2.5rem 0 2.5rem 0', opacity: 0.7, marginTop: 0 }}>
          <div className="flex flex-col items-center justify-center w-full" style={{ maxWidth: 600 }}>
            <ShareCard />
          </div>
        </div>
        {/* Theme/settings card below the background */}
        <div className="mt-6 bg-slate-800 rounded-xl p-4 space-y-4 w-full max-w-2xl">
          <div className="flex items-center justify-between">
            <span className="text-white font-medium">Theme</span>
            <div className="flex gap-2">
              {THEME_OPTIONS.map((t) => (
                <button
                  key={t}
                  className={`px-3 py-1 rounded-lg font-semibold transition-colors duration-150 ${
                    theme === t ? 'bg-slate-700 text-white' : 'bg-slate-600 text-gray-300'
                  }`}
                  onClick={() => setTheme(t as 'Light' | 'Dark')}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span className="block text-white font-medium mb-2">Colors</span>
            <ColorSelector options={COLOR_OPTIONS} value={color} onChange={setColor} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white font-medium">Show Time Spent</span>
            <input type="checkbox" checked={showTimeSpent} onChange={e => setShowTimeSpent(e.target.checked)} className="w-5 h-5 rounded focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white font-medium">Show Spent Graph</span>
            <input type="checkbox" checked={showSpentGraph} onChange={e => setShowSpentGraph(e.target.checked)} className="w-5 h-5 rounded focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default SharePage;
