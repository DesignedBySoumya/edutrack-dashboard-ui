import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBattleStore } from "../../stores/battleStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WarConfigurationProps {
  onNext: () => void;
}

interface FormData {
  studentId: string;
  dobPassword: string;
  testType: 'full-length' | 'subject-wise' | '';
  duration: string;
}

const WarConfiguration = ({ onNext }: WarConfigurationProps) => {
  const navigate = useNavigate();
  const { setConfig, startBattle } = useBattleStore();
  
  const [formData, setFormData] = useState<FormData>({
    studentId: '',
    dobPassword: '',
    testType: '',
    duration: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const getDurationOptions = () => {
    if (formData.testType === 'full-length') {
      return [
        { value: '60', label: '60 Minutes' },
        { value: '90', label: '90 Minutes' },
        { value: '120', label: '2 Hours' },
        { value: '180', label: '3 Hours' }
      ];
    } else if (formData.testType === 'subject-wise') {
      return [
        { value: '25', label: '25 Minutes' },
        { value: '30', label: '30 Minutes' },
        { value: '35', label: '35 Minutes' }
      ];
    }
    return [];
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!/^\d{8}$/.test(formData.studentId)) {
      newErrors.studentId = 'Student ID must be exactly 8 digits';
    }
    
    if (!/^\d{8}$/.test(formData.dobPassword)) {
      newErrors.dobPassword = 'DOB must be in ddmmyyyy format (8 digits)';
    }
    
    if (!formData.testType) {
      newErrors.testType = 'Please select a test type';
    }
    
    if (!formData.duration) {
      newErrors.duration = 'Please select a duration';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const config = {
      studentId: formData.studentId,
      dobPassword: formData.dobPassword,
      testType: formData.testType as 'full-length' | 'subject-wise',
      duration: parseInt(formData.duration)
    };
    
    setConfig(config);
    startBattle();
    onNext();
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto w-full">
        <Card className="bg-slate-800/40 backdrop-blur-sm border border-slate-600 rounded-3xl shadow-2xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-5xl font-black text-white mb-4">
              🏹 WAR PREPARATION
            </CardTitle>
            <p className="text-xl text-slate-300">
              Configure your battle parameters before entering the arena
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Student ID */}
              <div>
                <label className="block text-slate-200 font-semibold mb-2">
                  🎯 Student ID (8 digits)
                </label>
                <input
                  type="text"
                  value={formData.studentId}
                  onChange={(e) => handleInputChange('studentId', e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-500 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-orange-400 focus:outline-none transition-colors"
                  placeholder="12345678"
                  maxLength={8}
                />
                {errors.studentId && (
                  <p className="text-red-400 text-sm mt-1">{errors.studentId}</p>
                )}
              </div>

              {/* DOB Password */}
              <div>
                <label className="block text-slate-200 font-semibold mb-2">
                  🔐 DOB Password (ddmmyyyy)
                </label>
                <input
                  type="password"
                  value={formData.dobPassword}
                  onChange={(e) => handleInputChange('dobPassword', e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-500 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-orange-400 focus:outline-none transition-colors"
                  placeholder="01011995"
                  maxLength={8}
                />
                {errors.dobPassword && (
                  <p className="text-red-400 text-sm mt-1">{errors.dobPassword}</p>
                )}
              </div>

              {/* Test Type */}
              <div>
                <label className="block text-slate-200 font-semibold mb-2">
                  ⚔️ Test Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleInputChange('testType', 'full-length')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.testType === 'full-length'
                        ? 'border-orange-400 bg-orange-400/20 text-orange-200'
                        : 'border-slate-500 bg-slate-700/30 text-slate-300 hover:border-slate-400'
                    }`}
                  >
                    <div className="text-2xl mb-2">📋</div>
                    <div className="font-semibold">Full Length</div>
                    <div className="text-sm opacity-80">Complete exam simulation</div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => handleInputChange('testType', 'subject-wise')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.testType === 'subject-wise'
                        ? 'border-orange-400 bg-orange-400/20 text-orange-200'
                        : 'border-slate-500 bg-slate-700/30 text-slate-300 hover:border-slate-400'
                    }`}
                  >
                    <div className="text-2xl mb-2">📚</div>
                    <div className="font-semibold">Subject Wise</div>
                    <div className="text-sm opacity-80">Focused topic practice</div>
                  </button>
                </div>
                {errors.testType && (
                  <p className="text-red-400 text-sm mt-1">{errors.testType}</p>
                )}
              </div>

              {/* Duration */}
              {formData.testType && (
                <div>
                  <label className="block text-slate-200 font-semibold mb-2">
                    ⏱️ Duration
                  </label>
                  <select
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    className="w-full bg-slate-700/50 border border-slate-500 rounded-xl px-4 py-3 text-white focus:border-orange-400 focus:outline-none transition-colors"
                  >
                    <option value="">Select duration...</option>
                    {getDurationOptions().map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.duration && (
                    <p className="text-red-400 text-sm mt-1">{errors.duration}</p>
                  )}
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="flex-1 bg-slate-700/50 border-slate-500 text-slate-200 hover:bg-slate-600/50"
                >
                  ← Back to Home
                </Button>
                
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-black text-lg py-6"
                >
                  🗡️ START THE WAR
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WarConfiguration;
