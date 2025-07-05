import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, ChevronDown } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface Exam {
  id: number;
  name: string;
}

interface ExamDropdownProps {
  selectedExam: Exam | null;
  onSelect: (exam: Exam) => void;
  variant?: 'default' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const ExamDropdown = ({ 
  selectedExam, 
  onSelect, 
  variant = 'default', 
  size = 'md' 
}: ExamDropdownProps) => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load exams from Supabase
  useEffect(() => {
    const loadExams = async () => {
      try {
        const { data, error } = await supabase
          .from('exams')
          .select('id, name')
          .order('name', { ascending: true });

        if (error) {
          console.error('Error loading exams:', error);
          return;
        }

        setExams(data || []);
        
        if (data && data.length > 0) {
          const savedExamId = localStorage.getItem('selectedExamId');
          if (savedExamId) {
            const savedExam = data.find(exam => exam.id.toString() === savedExamId);
            if (savedExam && (!selectedExam || selectedExam.id !== savedExam.id)) {
              onSelect(savedExam);
              return;
            }
          }

          // Only select first exam if nothing is selected and nothing found in storage
          if (!selectedExam) {
            onSelect(data[0]);
          }
        }
      } catch (error) {
        console.error('Error in loadExams:', error);
      } finally {
        setLoading(false);
      }
    };

    loadExams();
  }, []); // Only run once on mount

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (exam: Exam) => {
    localStorage.setItem('selectedExamId', exam.id.toString());
    onSelect(exam);
    setIsOpen(false);
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs min-w-[80px] h-8',
    md: 'px-3 py-1.5 text-sm min-w-[120px] h-10',
    lg: 'px-4 py-2 text-base min-w-[140px] h-12'
  };

  const buttonClasses = variant === 'default' 
    ? 'bg-blue-500 hover:bg-blue-600 text-white' 
    : 'bg-transparent border border-gray-600 text-gray-300 hover:bg-gray-800';

  if (loading || exams.length === 0) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center space-x-2 ${buttonClasses} ${sizeClasses[size]} rounded-lg transition-all duration-200 font-medium`}
      >
        <BookOpen className="w-4 h-4 text-white flex-shrink-0" />
        <span className="text-white font-medium text-sm">
          {selectedExam?.name || 'Select Exam'}
        </span>
        <ChevronDown className={`w-4 h-4 text-white flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="max-h-[480px] overflow-y-auto scrollbar-thin">
            {exams.map((exam) => (
              <button
                key={exam.id}
                onClick={() => handleSelect(exam)}
                className={`w-full px-4 py-3 text-left hover:bg-slate-700 transition-colors duration-200 ${
                  selectedExam?.id === exam.id 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-4 h-4 flex-shrink-0" />
                  <span>{exam.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 