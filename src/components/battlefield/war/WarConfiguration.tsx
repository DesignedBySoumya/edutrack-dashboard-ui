
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Target, BookOpen } from 'lucide-react';
import { useSubjects } from '@/hooks/useSubjects';
import { useBattleStore } from '../../../stores/battleStore';

interface WarConfigurationProps {
  onNext: () => void;
}

const WarConfiguration = ({ onNext }: WarConfigurationProps) => {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [timeLimit, setTimeLimit] = useState(60);
  const [questionCount, setQuestionCount] = useState(50);
  
  const { data: subjects, isLoading } = useSubjects();
  const { setCurrentSession } = useBattleStore();

  const handleSubjectToggle = (subjectId: string) => {
    setSelectedSubjects(prev => 
      prev.includes(subjectId) 
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const handleStartBattle = () => {
    // Create a new battle session configuration
    const battleConfig = {
      selectedSubjects,
      timeLimit,
      questionCount,
      startTime: new Date().toISOString(),
    };
    
    setCurrentSession(battleConfig);
    onNext();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-950 via-slate-900 to-black p-6 flex items-center justify-center">
        <div className="text-orange-400 text-xl">Loading subjects...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-950 via-slate-900 to-black">
      {/* War-themed background texture */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 to-slate-900/20"></div>
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-orange-400 mb-2">⚔️ War Configuration</h1>
            <p className="text-gray-300">Prepare for battle! Configure your war parameters.</p>
          </div>

          <Card className="bg-slate-800/50 border-orange-500/20 mb-6">
            <CardHeader>
              <CardTitle className="text-orange-400 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Select Subjects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subjects?.map((subject) => (
                  <button
                    key={subject.id}
                    onClick={() => handleSubjectToggle(subject.id)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedSubjects.includes(subject.id)
                        ? 'border-orange-500 bg-orange-500/20 text-orange-400'
                        : 'border-slate-600 hover:border-slate-500 text-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{subject.name}</span>
                      <span className={`w-4 h-4 rounded-full border-2 ${
                        selectedSubjects.includes(subject.id) 
                          ? 'bg-orange-500 border-orange-500' 
                          : 'border-gray-400'
                      }`}></span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-orange-500/20 mb-8">
            <CardHeader>
              <CardTitle className="text-orange-400 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Battle Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Time Limit (minutes)
                </label>
                <input
                  type="number"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-orange-500 focus:outline-none"
                  min="15"
                  max="180"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Questions Count
                </label>
                <input
                  type="number"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-orange-500 focus:outline-none"
                  min="10"
                  max="100"
                />
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button
              onClick={handleStartBattle}
              disabled={selectedSubjects.length === 0}
              className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-8 py-3 text-lg font-semibold"
            >
              Begin War ⚔️
            </Button>
            {selectedSubjects.length === 0 && (
              <p className="text-gray-400 text-sm mt-2">Please select at least one subject to continue</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarConfiguration;
