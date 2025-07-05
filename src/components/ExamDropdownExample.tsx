import React from 'react';
import { ExamDropdown, Exam } from './ExamDropdown';
import { useExamSelection } from '@/hooks/useExamSelection';

export const ExamDropdownExample = () => {
  const { selectedExam, selectExam, clearSelection } = useExamSelection();

  const handleExamSelect = (exam: Exam) => {
    selectExam(exam);
    console.log('Selected exam:', exam);
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Exam Dropdown Examples</h2>
      
      {/* Basic Usage */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Basic Dropdown</h3>
        <ExamDropdown
          selectedExam={selectedExam}
          onSelect={handleExamSelect}
        />
      </div>

      {/* Different Variants */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Different Variants</h3>
        <div className="flex gap-4">
          <ExamDropdown
            selectedExam={selectedExam}
            onSelect={handleExamSelect}
            variant="default"
            placeholder="Default Style"
          />
          <ExamDropdown
            selectedExam={selectedExam}
            onSelect={handleExamSelect}
            variant="outline"
            placeholder="Outline Style"
          />
          <ExamDropdown
            selectedExam={selectedExam}
            onSelect={handleExamSelect}
            variant="ghost"
            placeholder="Ghost Style"
          />
        </div>
      </div>

      {/* Different Sizes */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Different Sizes</h3>
        <div className="flex gap-4 items-center">
          <ExamDropdown
            selectedExam={selectedExam}
            onSelect={handleExamSelect}
            size="sm"
            placeholder="Small"
          />
          <ExamDropdown
            selectedExam={selectedExam}
            onSelect={handleExamSelect}
            size="md"
            placeholder="Medium"
          />
          <ExamDropdown
            selectedExam={selectedExam}
            onSelect={handleExamSelect}
            size="lg"
            placeholder="Large"
          />
        </div>
      </div>

      {/* Without Search */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Without Search (for smaller lists)</h3>
        <ExamDropdown
          selectedExam={selectedExam}
          onSelect={handleExamSelect}
          showSearch={false}
          placeholder="No search"
        />
      </div>

      {/* Current Selection Display */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Current Selection</h3>
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          {selectedExam ? (
            <div>
              <p><strong>Selected:</strong> {selectedExam.name}</p>
              {selectedExam.code && <p><strong>Code:</strong> {selectedExam.code}</p>}
              {selectedExam.description && <p><strong>Description:</strong> {selectedExam.description}</p>}
              <button
                onClick={clearSelection}
                className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
              >
                Clear Selection
              </button>
            </div>
          ) : (
            <p className="text-gray-500">No exam selected</p>
          )}
        </div>
      </div>
    </div>
  );
}; 