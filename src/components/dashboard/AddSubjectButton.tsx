
import React from 'react';
import { Plus } from 'lucide-react';

export const AddSubjectButton = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4">
      <button className="w-full max-w-md mx-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl transition-colors">
        <Plus className="w-5 h-5" />
        Add New Subject
      </button>
    </div>
  );
};
