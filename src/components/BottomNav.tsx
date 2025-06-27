import React from 'react';
import { Grid3X3, Menu, FileText, BarChart3, Swords } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const BottomNav = () => {
  const navigate = useNavigate();
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <button className="flex flex-col items-center space-y-1 text-blue-500 transition-colors">
          <Grid3X3 className="w-6 h-6" />
        </button>
        <button
          className="flex flex-col items-center space-y-1 text-gray-400 hover:text-white transition-colors"
          onClick={() => navigate('/flashcards')}
        >
          <Menu className="w-6 h-6" />
        </button>
        <button
          className="flex flex-col items-center space-y-1 text-gray-400 hover:text-white transition-colors"
          onClick={() => navigate('/battlefield')}
        >
          <Swords className="w-6 h-6" />
        </button>
        <Link to="/dashboard">
          <button className="flex flex-col items-center space-y-1 text-gray-400 hover:text-white transition-colors">
            <BarChart3 className="w-6 h-6" />
          </button>
        </Link>
      </div>
    </div>
  );
};
