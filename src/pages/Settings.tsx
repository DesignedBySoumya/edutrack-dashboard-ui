
import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { 
  Palette, 
  ArrowUpDown, 
  Widget, 
  Shield, 
  Cloud, 
  Download, 
  Upload, 
  RotateCcw, 
  Users, 
  TrendingUp, 
  Target, 
  Moon,
  ChevronRight 
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const Settings = () => {
  const [theme, setTheme] = useState('system');
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [widgets, setWidgets] = useState({
    calendar: true,
    stats: true,
    countdown: false
  });

  const handleThemeChange = (selectedTheme: string) => {
    setTheme(selectedTheme);
    localStorage.setItem('theme', selectedTheme);
    setShowThemeModal(false);
  };

  const handleBackup = () => {
    alert('Backed up successfully');
  };

  const handleExport = () => {
    const data = {
      timetable: JSON.parse(localStorage.getItem('timetable') || '[]'),
      settings: { theme, widgets },
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'upsc-study-data.json';
    a.click();
  };

  const settingsItems = [
    { icon: Palette, title: 'Theme', subtitle: theme, action: () => setShowThemeModal(true) },
    { icon: ArrowUpDown, title: 'Rearrange', subtitle: 'Customize layout', action: () => {} },
    { icon: Widget, title: 'Widgets', subtitle: 'Configure widgets', action: () => {} },
    { icon: Shield, title: 'Authentication', subtitle: 'Sign in options', action: () => {} },
    { icon: Cloud, title: 'Cloud Backup', subtitle: 'Auto-sync data', action: handleBackup },
    { icon: Download, title: 'Export Data', subtitle: 'Download JSON', action: handleExport },
    { icon: Upload, title: 'Import Data', subtitle: 'Upload backup', action: () => {} },
    { icon: RotateCcw, title: 'Reset App', subtitle: 'Clear all data', action: () => {} },
    { icon: Users, title: 'Switch Subject', subtitle: 'UPSC / GATE / SSC', action: () => {} },
    { icon: TrendingUp, title: 'Progress Report', subtitle: 'Weekly stats', action: () => {} },
    { icon: Target, title: 'Set Target Score', subtitle: 'Goal: 500/500', action: () => {} },
    { icon: Moon, title: 'Focus Mode', subtitle: 'Mute notifications', action: () => {} },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f12] text-white pb-20">
      <Header />
      
      <div className="px-6 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400 text-sm">Customize your study experience</p>
        </div>

        <div className="space-y-3">
          {settingsItems.map((item, index) => (
            <div
              key={index}
              onClick={item.action}
              className="bg-[#1E1E1E] rounded-xl shadow-sm px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-[#2a2a2a] transition-colors"
            >
              <div className="flex items-center space-x-3">
                <item.icon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-white">{item.title}</p>
                  <p className="text-xs text-gray-400">{item.subtitle}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          ))}
        </div>

        {/* Widgets Section */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-white mb-3">Widget Settings</h2>
          <div className="space-y-3">
            <div className="bg-[#1E1E1E] rounded-xl px-4 py-3 flex justify-between items-center">
              <span className="text-white">Show Calendar Widget</span>
              <Switch
                checked={widgets.calendar}
                onCheckedChange={(checked) => setWidgets({...widgets, calendar: checked})}
              />
            </div>
            <div className="bg-[#1E1E1E] rounded-xl px-4 py-3 flex justify-between items-center">
              <span className="text-white">Show Study Stats</span>
              <Switch
                checked={widgets.stats}
                onCheckedChange={(checked) => setWidgets({...widgets, stats: checked})}
              />
            </div>
            <div className="bg-[#1E1E1E] rounded-xl px-4 py-3 flex justify-between items-center">
              <span className="text-white">Show Daily Countdown</span>
              <Switch
                checked={widgets.countdown}
                onCheckedChange={(checked) => setWidgets({...widgets, countdown: checked})}
              />
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-[#1E1E1E] p-4 rounded-xl shadow-sm mt-6 flex items-center justify-between">
          <div className="text-white text-sm font-semibold">
            Want to build a habit? <br /> Try our Habit Tracker!
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
            Install Now
          </button>
        </div>
      </div>

      {/* Theme Modal */}
      {showThemeModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1f] rounded-xl border border-slate-800 w-full max-w-sm">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Choose Theme</h3>
              <div className="space-y-3">
                {['system', 'light', 'dark'].map((themeOption) => (
                  <button
                    key={themeOption}
                    onClick={() => handleThemeChange(themeOption)}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      theme === themeOption ? 'bg-blue-500 border-blue-500' : 'border-gray-400'
                    }`}>
                      {theme === themeOption && <div className="w-2 h-2 bg-white rounded-full m-0.5" />}
                    </div>
                    <span className="text-white capitalize">{themeOption}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default Settings;
