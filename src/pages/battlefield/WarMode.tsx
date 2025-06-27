import { Routes, Route, Navigate } from "react-router-dom";
import BeginBattle from "../../components/battlefield/war/BeginBattle";
import WarConfiguration from "../../components/battlefield/war/WarConfiguration";
import PTSReportCard from "./PTSReportCard";
import ReviewWeakChapters from "./ReviewWeakChapters";
import CompareMocks from "./CompareMocks";
import BattleAnalysis from "./BattleAnalysis";
import NotFound from "./NotFound";

export default function WarMode() {
  return (
    <Routes>
      <Route index element={<BeginBattle onEnd={() => {}} />} />
      <Route path="config" element={<WarConfiguration onNext={() => {}} />} />
      <Route path="report" element={<PTSReportCard />} />
      <Route path="review" element={<ReviewWeakChapters />} />
      <Route path="compare" element={<CompareMocks />} />
      <Route path="analysis" element={<BattleAnalysis />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
} 