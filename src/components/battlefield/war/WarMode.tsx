
import { useState } from "react";
import WarConfiguration from "./WarConfiguration";
import BeginBattle from "./BeginBattle";
import ReportCard from "./ReportCard";
import WarReport from "./WarReport";
import { useBattleStore } from "../../stores/battleStore";

export type WarStep = 'config' | 'battle' | 'report-card' | 'dashboard';

const WarMode = () => {
  const [currentStep, setCurrentStep] = useState<WarStep>('config');
  const { phase, isActive } = useBattleStore();

  // Auto-sync with battle store phase
  const getStepFromPhase = () => {
    if (phase === 'active' && isActive) return 'battle';
    if (phase === 'completed') return 'report-card';
    return 'config';
  };

  const effectiveStep = currentStep === 'dashboard' ? 'dashboard' : getStepFromPhase();

  const goToStep = (step: WarStep) => {
    setCurrentStep(step);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-950 via-slate-900 to-black">
      {/* War-themed background texture */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 to-slate-900/20"></div>
      </div>

      <div className="relative z-10">
        {effectiveStep === 'config' && (
          <WarConfiguration onNext={() => goToStep('battle')} />
        )}
        {effectiveStep === 'battle' && (
          <BeginBattle onEnd={() => goToStep('report-card')} />
        )}
        {effectiveStep === 'report-card' && (
          <ReportCard 
            onNext={() => goToStep('dashboard')}
            onNewBattle={() => goToStep('config')}
          />
        )}
        {effectiveStep === 'dashboard' && (
          <WarReport onNewBattle={() => goToStep('config')} />
        )}
      </div>
    </div>
  );
};

export default WarMode;
