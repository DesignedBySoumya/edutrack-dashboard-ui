import { useState, useEffect } from 'react';
import { Exam } from '@/components/ExamDropdown';

const STORAGE_KEY = 'selected_exam';

export const useExamSelection = () => {
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load selected exam from localStorage on mount
  useEffect(() => {
    const loadSelectedExam = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const exam = JSON.parse(stored);
          setSelectedExam(exam);
        }
      } catch (error) {
        console.error('Error loading selected exam from localStorage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSelectedExam();
  }, []);

  const selectExam = (exam: Exam) => {
    setSelectedExam(exam);
    
    // Save to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(exam));
    } catch (error) {
      console.error('Error saving selected exam to localStorage:', error);
    }
  };

  const clearSelection = () => {
    setSelectedExam(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    selectedExam,
    selectExam,
    clearSelection,
    isLoading
  };
}; 