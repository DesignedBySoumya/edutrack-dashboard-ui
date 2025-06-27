import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Timetable from "./pages/Timetable";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const Flashcards = lazy(() => import("./pages/flashcards/Flashcards"));
const BattlefieldHome = lazy(() => import("./pages/battlefield/Index"));
const DefenceMode = lazy(
  () => import("@/components/battlefield/defence/DefenseMode")
);
const Attack = lazy(() => import("./pages/battlefield/Attack"));
const BeginBattle = lazy(
  () => import("@/components/battlefield/war/BeginBattle")
);
const WarConfiguration = lazy(
  () => import("@/components/battlefield/war/WarConfiguration")
);
const WarReportIndex = lazy(() => import("./pages/battlefield/WarReportIndex"));
const PTSReportCard = lazy(() => import("./pages/battlefield/PTSReportCard"));
const ReviewWeakChapters = lazy(
  () => import("./pages/battlefield/ReviewWeakChapters")
);
const CompareMocks = lazy(() => import("./pages/battlefield/CompareMocks"));
const BattleAnalysis = lazy(() => import("./pages/battlefield/BattleAnalysis"));

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/timetable" element={<Timetable />} />
            <Route path="/settings" element={<Settings />} />
            <Route
              path="/flashcards"
              element={
                <Suspense fallback={<div>Loading Flashcards...</div>}>
                  <Flashcards />
                </Suspense>
              }
            />
            <Route
              path="/battlefield"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <BattlefieldHome />
                </Suspense>
              }
            />
            <Route
              path="/battlefield/defence"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <DefenceMode />
                </Suspense>
              }
            />
            <Route
              path="/battlefield/attack/*"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <Attack />
                </Suspense>
              }
            />
            <Route
              path="/battlefield/war"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <BeginBattle  />
                </Suspense>
              }
            />
            <Route
              path="/battlefield/war/config"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <WarConfiguration
                    
                  />
                </Suspense>
              }
            />
            <Route
              path="/battlefield/war/report"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <WarReportIndex />
                </Suspense>
              }
            />
            <Route
              path="/battlefield/war/report/pts"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <PTSReportCard />
                </Suspense>
              }
            />
            <Route
              path="/battlefield/war/report/weak-chapters"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <ReviewWeakChapters />
                </Suspense>
              }
            />
            <Route
              path="/battlefield/war/report/compare"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <CompareMocks />
                </Suspense>
              }
            />
            <Route
              path="/battlefield/war/report/analysis"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <BattleAnalysis />
                </Suspense>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
