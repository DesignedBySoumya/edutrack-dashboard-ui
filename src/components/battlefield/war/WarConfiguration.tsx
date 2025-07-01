
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Target, BookOpen } from 'lucide-react';

interface WarConfigurationProps {
  onNext: () => void;
}

const WarConfiguration = ({ onNext }: WarConfigurationProps) => {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [timeLimit, setTimeLimit] = useState(60);
  const [questionCount, setQuestionCount] = useState(50);

  const subjects = [
    { id: 'polity', name: 'Indian Polity', icon: '🏛️' },
    { id: 'geography', name: 'Geography', icon: '🌍' },
    { id: 'economy', name: 'Economy', icon: '💰' },
    { id: 'history', name: 'History', icon: '📚' },
  ];

  const handleSubjectToggle = (subjectId: string) => {
    setSelectedSubjects(prev => 
      prev.includes(subjectId) 
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-950 via-slate-900 to-black p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-orange-400 mb-2">⚔️ War Configuration</h1>
          <p className="text-gray-300">Prepare for battle! Configure your war parameters.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-orange-500/20">
            <CardHeader>
              <CardTitle className="text-orange-400 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Select Subjects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {subjects.map((subject) => (
                  <button
                    key={subject.id}
                    onClick={() => handleSubjectToggle(subject.id)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedSubjects.includes(subject.id)
                        ? 'border-orange-500 bg-orange-500/20 text-orange-400'
                        : 'border-slate-600 hover:border-slate-500 text-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{subject.icon}</div>
                    <div className="text-sm font-medium">{subject.name}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-orange-500/20">
            <CardHeader>
              <CardTitle className="text-orange-400 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Battle Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
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
                <label className="block text-sm font-medium text-gray-300 mb-2">
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
        </div>

        <div className="text-center">
          <Button
            onClick={onNext}
            disabled={selectedSubjects.length === 0}
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg font-semibold disabled:opacity-50"
          >
            Begin War ⚔️
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WarConfiguration;
