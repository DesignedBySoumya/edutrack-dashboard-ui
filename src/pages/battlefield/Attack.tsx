import { Routes, Route } from "react-router-dom";
import AttackWelcome from "../../components/battlefield/attack/AttackWelcome";
import AttackPlan from "../../components/battlefield/attack/AttackPlan";
import BeastBattle from "../../components/battlefield/attack/BeastBattle";
import BattleReflection from "../../components/battlefield/attack/BattleReflection";
import BeastArsenal from "../../components/battlefield/attack/BeastArsenal";
import MentalTimer from "../../components/battlefield/attack/MentalTimer";
import AnalyticsDashboard from "../../components/battlefield/attack/AnalyticsDashboard";
import StreakTracker from "../../components/battlefield/attack/StreakTracker";

const Attack = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Routes>
        <Route path="/" element={<AttackWelcome />} />
        <Route path="plan" element={<AttackPlan />} />
        <Route path="mental" element={<MentalTimer />} />
        <Route path="battle" element={<BeastBattle />} />
        <Route path="reflect" element={<BattleReflection />} />
        <Route path="arsenal" element={<BeastArsenal />} />
        <Route path="analytics" element={<AnalyticsDashboard />} />
        <Route path="streaks" element={<StreakTracker />} />
      </Routes>
    </div>
  );
};

export default Attack;
