import { useState, useEffect } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { X, RotateCcw, Check, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useFlashcardStore } from "@/store/flashcardStore";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getDueFlashcards } from '@/lib/spacedRepetition';
import { supabase } from '@/lib/supabaseClient';
import saveReviewSession from "@/lib/reviewSessions";
const PracticeStage = () => {
  const {
    cards,
    currentCardIndex,
    studySession,
    markCardCorrect,
    markCardIncorrect,
    nextCard,
    setStage,
    updateStreak,
    setNextReviewTime,
    fetchUserStats,
    // Add set function from Zustand
    // (Zustand's set is not exposed directly, so useFlashcardStore.setState)
  } = useFlashcardStore();
  const [showAnswer, setShowAnswer] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<string | null>(null);
  const currentCard = cards[currentCardIndex];
  // Add state for review stats
  const [reviewStats, setReviewStats] = useState<{correct: number, incorrect: number} | null>(null);
  useEffect(() => {
    async function fetchReviewStats() {
      if (!currentCard) return;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error } = await supabase
        .from('card_reviews')
        .select('correct_count, incorrect_count')
        .eq('user_id', user.id)
        .eq('card_id', currentCard.id)
        .maybeSingle();
      if (!error && data) {
        setReviewStats({
          correct: data.correct_count,
          incorrect: data.incorrect_count
        });
      } else {
        setReviewStats({ correct: 0, incorrect: 0 });
      }
    }
    fetchReviewStats();
  }, [currentCard]);
  const progress = studySession.total / cards.length * 100;
  useEffect(() => {
    // Fetch user stats from Supabase when component mounts
    fetchUserStats();
  }, [fetchUserStats]);

  useEffect(() => {
    // Only fetch if cards are empty
    if (cards.length === 0) {
      (async () => {
        const dueCards = await getDueFlashcards();
        // Map DB fields to Flashcard interface if needed
        useFlashcardStore.setState({
          cards: (dueCards || []).map((card) => ({
            id: card.id,
            userId: card.user_id,
            question: card.question,
            answer: card.answer,
            subject: card.subject,
            difficulty: card.difficulty,
            correctCount: card.correct_count,
            incorrectCount: card.incorrect_count,
            isStarred: card.is_starred || false,
            createdAt: card.created_at,
            lastReviewed: card.last_reviewed,
            nextReview: card.next_review,
          })),
        });
      })();
    } else if (!sessionStartTime) {
      setSessionStartTime(new Date().toISOString());
    }
  }, [cards, sessionStartTime]);
  useEffect(() => {
    if (studySession.total >= cards.length && !sessionComplete && cards.length > 0) {
      const ended_at = new Date().toISOString();
      setSessionComplete(true);
      updateStreak();
      setNextReviewTime(Date.now() + 2 * 60 * 1000);

      const accuracy = studySession.total > 0 ? (studySession.correct / studySession.total) * 100 : 0;
      let level = 1;
      if (accuracy >= 90) level = 4;
      else if (accuracy >= 75) level = 3;
      else if (accuracy >= 50) level = 2;

      saveReviewSession({
        started_at: sessionStartTime || new Date().toISOString(),
        ended_at,
        correct_count: studySession.correct,
        incorrect_count: studySession.incorrect,
        total_xp_earned: 0, // Will be calculated by the function
        streak_count: 0, // Will be calculated by the function
        level: 1, // Will be calculated by the function
      }).then(result => {
        console.log("Session saved successfully:", {
          xp: result.calculatedXp,
          streak: result.calculatedStreak,
          level: result.calculatedLevel
        });
        // Refresh user stats from Supabase after saving session
        fetchUserStats();
      }).catch(error => {
        console.error("Failed to save review session:", error);
      });
    }
  }, [studySession, cards.length, sessionComplete, updateStreak, setNextReviewTime, sessionStartTime]);
  const handleSwipe = (direction: 'left' | 'right') => {
    if (!currentCard) return;
    setSwipeDirection(direction);
    setTimeout(() => {
      if (direction === 'left') {
        markCardIncorrect(currentCard.id);
      } else {
        markCardCorrect(currentCard.id);
      }
      if (studySession.total + 1 < cards.length) {
        nextCard();
        setShowAnswer(false);
      }
      setSwipeDirection(null);
    }, 300);
  };
  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 100;
    if (Math.abs(info.offset.x) > threshold) {
      handleSwipe(info.offset.x > 0 ? 'right' : 'left');
    }
  };
  const handleShowAnswer = () => {
    setShowAnswer(!showAnswer);
  };
  const handleKeyPress = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowLeft':
        handleSwipe('left');
        break;
      case 'ArrowRight':
        handleSwipe('right');
        break;
      case ' ':
        event.preventDefault();
        handleShowAnswer();
        break;
    }
  };
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);
  if (sessionComplete) {
    return <div className="max-w-2xl mx-auto px-6 py-12 text-center">
        <motion.div initial={{
        opacity: 0,
        scale: 0.8
      }} animate={{
        opacity: 1,
        scale: 1
      }} className="bg-[#1C2541] rounded-2xl p-8 border border-[#2563EB]/20">
          <motion.div animate={{
          rotate: [0, 10, -10, 0]
        }} transition={{
          duration: 0.5,
          delay: 0.2
        }}>
            <Star size={64} className="mx-auto text-yellow-500 mb-6" />
          </motion.div>
          
          <h2 className="text-3xl font-bold mb-4">Session Complete! 🎉</h2>
          
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-[#0A0E27] p-4 rounded-xl">
              <div className="text-2xl font-bold text-green-400">{studySession.correct}</div>
              <div className="text-sm text-[#93A5CF]">Correct</div>
            </div>
            <div className="bg-[#0A0E27] p-4 rounded-xl">
              <div className="text-2xl font-bold text-red-400">{studySession.incorrect}</div>
              <div className="text-sm text-[#93A5CF]">Incorrect</div>
            </div>
            <div className="bg-[#0A0E27] p-4 rounded-xl">
              <div className="text-2xl font-bold text-[#2563EB]">
                {Math.round(studySession.correct / studySession.total * 100)}%
              </div>
              <div className="text-sm text-[#93A5CF]">Accuracy</div>
            </div>
          </div>

          <p className="text-[#93A5CF] mb-8">
            Great job! Come back tomorrow to review your cards again.
          </p>

          <div className="flex gap-4 justify-center">
            <Button onClick={() => setStage(2)} variant="outline" className="border-[#2563EB]/30 text-gray-950">
              Review Cards
            </Button>
            <Button onClick={() => setStage(4)} className="bg-[#2563EB] hover:bg-[#1E3A8A]">
              Set Review Timer
            </Button>
          </div>
        </motion.div>
      </div>;
  }
  if (!currentCard) {
    return <div className="text-center py-12">
        <p className="text-[#93A5CF]">No cards available for practice</p>
        <Button onClick={() => setStage(1)} className="mt-4">
          Create Cards
        </Button>
      </div>;
  }
  return <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button onClick={() => setStage(2)} variant="ghost" size="sm" className="text-[#93A5CF]">
            <ChevronLeft size={20} />
            Back to Organize
          </Button>
        </div>
        
        <div className="text-center">
          <div className="text-sm text-[#93A5CF] mb-1">
            Card {currentCardIndex + 1} of {cards.length}
          </div>
          <Progress value={progress} className="w-32 h-2" />
        </div>
        
        <div className="flex gap-4 text-sm">
          <div className="text-green-400">✓ {studySession.correct}</div>
          <div className="text-red-400">✗ {studySession.incorrect}</div>
        </div>
      </div>

      {/* Main Card */}
      <div className="flex justify-center mb-8">
        <AnimatePresence>
          <motion.div key={currentCard.id} drag="x" dragConstraints={{
          left: 0,
          right: 0
        }} onDragEnd={handleDragEnd} animate={{
          x: swipeDirection === 'left' ? -1000 : swipeDirection === 'right' ? 1000 : 0,
          opacity: swipeDirection ? 0 : 1,
          rotate: swipeDirection === 'left' ? -30 : swipeDirection === 'right' ? 30 : 0
        }} transition={{
          duration: 0.3
        }} className="bg-[#1C2541] rounded-2xl p-8 w-full max-w-2xl min-h-[400px] border border-[#2563EB]/20 cursor-grab active:cursor-grabbing relative overflow-hidden" whileHover={{
          scale: 1.02
        }} whileTap={{
          scale: 0.98
        }}>
            {/* Swipe Indicators */}
            <div className="absolute inset-0 flex">
              <div className="flex-1 flex items-center justify-center text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <X size={48} />
              </div>
              <div className="flex-1 flex items-center justify-center text-green-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <Check size={48} />
              </div>
            </div>

            {/* Card Content */}
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="flex gap-2">
                  {currentCard.difficulty && <Badge variant="outline" className={`${currentCard.difficulty === 'easy' ? 'border-green-500 text-green-400' : currentCard.difficulty === 'hard' ? 'border-red-500 text-red-400' : 'border-yellow-500 text-yellow-400'}`}>
                      {currentCard.difficulty}
                    </Badge>}
                  {currentCard.subject && <Badge variant="secondary" className="bg-[#0A0E27] text-[#93A5CF]">
                      {currentCard.subject}
                    </Badge>}
                </div>
                {currentCard.isStarred && <Star size={20} className="text-yellow-500" fill="currentColor" />}
              </div>

              <div className="text-center space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-[#93A5CF] mb-4">Question</h3>
                  <p className="text-2xl font-semibold leading-relaxed">
                    {currentCard.question}
                  </p>
                </div>

                <AnimatePresence>
                  {showAnswer && <motion.div initial={{
                  opacity: 0,
                  y: 20
                }} animate={{
                  opacity: 1,
                  y: 0
                }} exit={{
                  opacity: 0,
                  y: -20
                }}>
                      <div className="border-t border-[#2563EB]/20 pt-6">
                        <h3 className="text-lg font-medium text-[#93A5CF] mb-4">Answer</h3>
                        <p className="text-xl text-[#B8C5D6] leading-relaxed">
                          {currentCard.answer}
                        </p>
                      </div>
                    </motion.div>}
                </AnimatePresence>
              </div>
            </div>
            {/* Add review stats display below card content */}
            <div className="mt-6 flex justify-center gap-6 text-sm text-[#93A5CF]">
              <span>✅ {reviewStats ? reviewStats.correct : '-'} correct</span>
              <span>❌ {reviewStats ? reviewStats.incorrect : '-'} incorrect</span>
              <span>Total: {reviewStats ? reviewStats.correct + reviewStats.incorrect : '-'}</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-8">
        <motion.button whileHover={{
        scale: 1.1
      }} whileTap={{
        scale: 0.9
      }} onClick={() => handleSwipe('left')} className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 rounded-full p-4 transition-colors">
          <X size={32} />
        </motion.button>

        <motion.button whileHover={{
        scale: 1.1
      }} whileTap={{
        scale: 0.9
      }} onClick={handleShowAnswer} className="bg-[#2563EB]/20 hover:bg-[#2563EB]/30 border border-[#2563EB]/30 text-[#2563EB] rounded-full p-4 transition-colors">
          <RotateCcw size={32} />
        </motion.button>

        <motion.button whileHover={{
        scale: 1.1
      }} whileTap={{
        scale: 0.9
      }} onClick={() => handleSwipe('right')} className="bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-400 rounded-full p-4 transition-colors">
          <Check size={32} />
        </motion.button>
      </div>

      {/* Instructions */}
      <div className="text-center mt-8 text-sm text-[#93A5CF]">
        <p>Swipe left (❌) if you didn't know it • Space to show answer • Swipe right (✅) if you got it right</p>
        <p className="mt-2">Keyboard: ← → for swipe, Space for answer</p>
      </div>
    </div>;
};
export default PracticeStage;
