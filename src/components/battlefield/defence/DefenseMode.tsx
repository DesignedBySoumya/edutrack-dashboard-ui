import { useState } from "react";
import WelcomePanel from "./WelcomePanel";
import MissionSetup from "./MissionSetup";
import SmartResourcesPanel from "./SmartResourcesPanel";
import FocusRitual from "./FocusRitual";
import EnhancedStudySession from "./EnhancedStudySession";
import SessionLog from "./SessionLog";
import ExitCheck from "./ExitCheck";

export type DefenseStep = 'welcome' | 'mission' | 'resources' | 'ritual' | 'study' | 'log' | 'exit';

const DefenseMode = () => {
  const [currentStep, setCurrentStep] = useState<DefenseStep>('welcome');
  const [sessionData, setSessionData] = useState({
    subject: '',
    unit: '',
    topic: '',
    targetHours: 2,
    pyqRelevance: 3,
    energyLevel: 50,
    resources: [] as string[],
    smartResources: [] as any[],
    studyTime: 0,
    learnings: '',
    confusions: '',
    reviewItems: [] as string[],
    topicStatus: '',
    focusMetrics: {
      tabSwitches: 0,
      focusBreaks: 0,
      totalResources: 0,
      completedResources: 0
    }
  });

  const updateSessionData = (data: Partial<typeof sessionData>) => {
    setSessionData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    const steps: DefenseStep[] = ['welcome', 'mission', 'resources', 'ritual', 'study', 'log', 'exit'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const goToStep = (step: DefenseStep) => {
    setCurrentStep(step);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-700/20 to-slate-900/20"></div>
      </div>

      <div className="relative z-10">
        {currentStep === 'welcome' && (
          <WelcomePanel onNext={nextStep} />
        )}
        {currentStep === 'mission' && (
          <MissionSetup 
            sessionData={sessionData}
            updateSessionData={updateSessionData}
            onNext={nextStep}
          />
        )}
        {currentStep === 'resources' && (
          <SmartResourcesPanel
            sessionData={sessionData}
            updateSessionData={updateSessionData}
            onNext={nextStep}
          />
        )}
        {currentStep === 'ritual' && (
          <FocusRitual onNext={nextStep} />
        )}
        {currentStep === 'study' && (
          <EnhancedStudySession
            sessionData={sessionData}
            updateSessionData={updateSessionData}
            onNext={nextStep}
          />
        )}
        {currentStep === 'log' && (
          <SessionLog
            sessionData={sessionData}
            updateSessionData={updateSessionData}
            onNext={nextStep}
          />
        )}
        {currentStep === 'exit' && (
          <ExitCheck
            sessionData={sessionData}
            onReturnToDefense={() => goToStep('study')}
          />
        )}
      </div>
    </div>
  );
};

export default DefenseMode;
