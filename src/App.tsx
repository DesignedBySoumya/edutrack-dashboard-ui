import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Timetable from "./pages/Timetable";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AuthCallback from "./pages/AuthCallback";
import StudySessionTest from "./pages/StudySessionTest";
import PomodoroTest from "./pages/PomodoroTest";
import PomodoroPage from "./pages/PomodoroPage";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

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
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  useEffect(() => {
    if (isAuthenticated && user?.email && !sessionStorage.getItem("welcomeShown")) {
      toast({ title: "Welcome back", description: `Signed in as ${user.email}` });
      sessionStorage.setItem("welcomeShown", "true");
    }
  }, [isAuthenticated, user]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />

              <Route path="/timetable" element={
                <ProtectedRoute>
                  <Timetable />
                </ProtectedRoute>
              } />
              <Route path="/timetable" element={
                <ProtectedRoute>
                  <Timetable />
                </ProtectedRoute>
              } />
              <Route path="/timetable" element={
                <ProtectedRoute>
                  <Timetable />
                </ProtectedRoute>
              } />
              <Route path="/timetable" element={
                <ProtectedRoute>
                  <Timetable />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={<Settings />} />
              <Route path="/study-session-test" element={
                <ProtectedRoute>
                  <StudySessionTest />
                </ProtectedRoute>
              } />
              <Route path="/pomodoro-test" element={
                <ProtectedRoute>
                  <PomodoroTest />
                </ProtectedRoute>
              } />
              <Route path="/pomodoro" element={
                <ProtectedRoute>
                  <PomodoroPage />
                </ProtectedRoute>
              } />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route
                path="/flashcards"
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<div>Loading Flashcards...</div>}>
                      <Flashcards />
                    </Suspense>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/battlefield"
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<div>Loading...</div>}>
                      <BattlefieldHome />
                    </Suspense>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/battlefield/defence"
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<div>Loading...</div>}>
                      <DefenceMode />
                    </Suspense>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/battlefield/attack/*"
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<div>Loading...</div>}>
                      <Attack />
                    </Suspense>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/battlefield/war"
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<div>Loading...</div>}>
                      <BeginBattle  />
                    </Suspense>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/battlefield/war/config"
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<div>Loading...</div>}>
                      <WarConfiguration
                        
                      />
                    </Suspense>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/battlefield/war/report"
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<div>Loading...</div>}>
                      <WarReportIndex />
                    </Suspense>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/battlefield/war/report/pts"
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<div>Loading...</div>}>
                      <PTSReportCard />
                    </Suspense>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/battlefield/war/report/weak-chapters"
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<div>Loading...</div>}>
                      <ReviewWeakChapters />
                    </Suspense>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/battlefield/war/report/compare"
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<div>Loading...</div>}>
                      <CompareMocks />
                    </Suspense>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/battlefield/war/report/analysis"
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<div>Loading...</div>}>
                      <BattleAnalysis />
                    </Suspense>
                  </ProtectedRoute>
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
