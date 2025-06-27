
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Clock, Target, CheckCircle } from "lucide-react";

const BeastBattle = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const battleConfig = location.state?.battleConfig;

  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [confidence, setConfidence] = useState("");
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(battleConfig?.timeLimit || 30);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [battleSession, setBattleSession] = useState({
    questions: [],
    startTime: Date.now(),
    config: battleConfig
  });

  // Sample question data (in real app, this would come from API/database)
  const sampleQuestions = [
    {
      id: 1,
      question: "What is the derivative of sin(x)?",
      options: ["cos(x)", "-cos(x)", "sin(x)", "-sin(x)"],
      correct: 0,
      explanation: "The derivative of sin(x) is cos(x). This is a fundamental rule in calculus.",
      difficulty: "Easy"
    },
    {
      id: 2,
      question: "Which of the following is the correct formula for kinetic energy?",
      options: ["½mv²", "mv²", "½m²v", "m²v²"],
      correct: 0,
      explanation: "Kinetic energy is given by KE = ½mv², where m is mass and v is velocity.",
      difficulty: "Medium"
    }
  ];

  const currentQuestionData = sampleQuestions[Math.min(currentQuestion - 1, sampleQuestions.length - 1)];

  useEffect(() => {
    if (battleConfig?.timeLimit && isTimerActive && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setIsTimerActive(false);
      setShowExplanation(true);
    }
  }, [timeLeft, isTimerActive, battleConfig?.timeLimit]);

  const submitAnswer = () => {
    if (!selectedAnswer || !confidence) return;

    setIsTimerActive(false);
    setShowExplanation(true);

    const questionResult = {
      questionNumber: currentQuestion,
      questionId: currentQuestionData.id,
      selectedAnswer: parseInt(selectedAnswer),
      correctAnswer: currentQuestionData.correct,
      confidence,
      timeSpent: (battleConfig?.timeLimit || 30) - timeLeft,
      isCorrect: parseInt(selectedAnswer) === currentQuestionData.correct,
      timestamp: Date.now()
    };

    setBattleSession(prev => ({
      ...prev,
      questions: [...prev.questions, questionResult]
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < (battleConfig?.questionCount || 20)) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer("");
      setConfidence("");
      setShowExplanation(false);
      setTimeLeft(battleConfig?.timeLimit || 30);
      setIsTimerActive(true);
    } else {
      // Battle complete
      const finalSession = {
        ...battleSession,
        endTime: Date.now(),
        totalQuestions: currentQuestion
      };
      navigate("/attack/reflect", { state: { sessionData: finalSession } });
    }
  };

  const getTimerColor = () => {
    if (timeLeft > 20) return "text-green-500";
    if (timeLeft > 10) return "text-yellow-500";
    return "text-red-500";
  };

  const confidenceOptions = [
    { value: "high", label: "🔥 Beast Mode", color: "bg-red-600" },
    { value: "medium", label: "⚡ Confident", color: "bg-yellow-600" },
    { value: "low", label: "🤔 Guessing", color: "bg-blue-600" }
  ];

  if (!battleConfig) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-8 text-center">
            <p className="text-gray-400 mb-4">No battle configuration found</p>
            <Button onClick={() => navigate("/attack/plan")}>Plan a Battle</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/attack/plan")}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">⚔️ Beast Battle</h1>
            <p className="text-gray-400">Question {currentQuestion} of {battleConfig.questionCount}</p>
          </div>

          {battleConfig.timeLimit > 0 && (
            <div className="text-center">
              <div className={`text-2xl font-bold ${getTimerColor()}`}>
                {timeLeft}s
              </div>
              <div className="text-sm text-gray-400">Remaining</div>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-3 mb-8">
          <div 
            className="bg-gradient-to-r from-red-500 to-orange-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${(currentQuestion / battleConfig.questionCount) * 100}%` }}
          />
        </div>

        {/* Battle Configuration Display */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          <Badge className="bg-red-600">{battleConfig.subject}</Badge>
          {battleConfig.topic && <Badge variant="outline" className="border-gray-600 text-gray-300">{battleConfig.topic}</Badge>}
          <Badge variant="outline" className="border-gray-600 text-gray-300">{battleConfig.source}</Badge>
          <Badge className={`${
            battleConfig.difficulty === 'Easy' ? 'bg-green-600' :
            battleConfig.difficulty === 'Medium' ? 'bg-yellow-600' :
            battleConfig.difficulty === 'Hard' ? 'bg-red-600' :
            'bg-purple-600'
          }`}>
            {battleConfig.difficulty}
          </Badge>
        </div>

        {/* Question Card */}
        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <Target className="w-5 h-5" />
              Question {currentQuestion}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Question Text */}
              <div className="text-lg text-white p-4 bg-gray-700 rounded-lg">
                {currentQuestionData.question}
              </div>

              {/* Answer Options */}
              {!showExplanation && (
                <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
                  <div className="space-y-3">
                    {currentQuestionData.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                        <RadioGroupItem value={index.toString()} id={`option-${index}`} className="border-gray-400" />
                        <Label htmlFor={`option-${index}`} className="text-white cursor-pointer flex-1">
                          {String.fromCharCode(65 + index)}. {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              )}

              {/* Show Results */}
              {showExplanation && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    {currentQuestionData.options.map((option, index) => (
                      <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg ${
                        index === currentQuestionData.correct ? 'bg-green-900/50 border border-green-500' :
                        index === parseInt(selectedAnswer) && index !== currentQuestionData.correct ? 'bg-red-900/50 border border-red-500' :
                        'bg-gray-700'
                      }`}>
                        <div className="w-6 h-6 rounded-full border-2 border-gray-400 flex items-center justify-center">
                          {index === currentQuestionData.correct && <CheckCircle className="w-4 h-4 text-green-500" />}
                          {index === parseInt(selectedAnswer) && index !== currentQuestionData.correct && (
                            <div className="w-3 h-3 bg-red-500 rounded-full" />
                          )}
                        </div>
                        <Label className="text-white flex-1">
                          {String.fromCharCode(65 + index)}. {option}
                        </Label>
                      </div>
                    ))}
                  </div>

                  {/* Explanation */}
                  <div className="p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
                    <h4 className="font-bold text-blue-400 mb-2">💡 Explanation</h4>
                    <p className="text-gray-300">{currentQuestionData.explanation}</p>
                  </div>
                </div>
              )}

              {/* Confidence Selection */}
              {selectedAnswer && !showExplanation && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-300">How confident are you?</label>
                  <div className="grid grid-cols-3 gap-3">
                    {confidenceOptions.map(option => (
                      <Button
                        key={option.value}
                        variant={confidence === option.value ? "default" : "outline"}
                        onClick={() => setConfidence(option.value)}
                        className={`${
                          confidence === option.value 
                            ? option.color 
                            : "border-gray-600 text-gray-300 hover:bg-gray-700"
                        } py-3`}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                {!showExplanation ? (
                  <Button 
                    onClick={submitAnswer}
                    disabled={!selectedAnswer || !confidence}
                    className={`flex-1 py-4 text-lg font-bold ${
                      selectedAnswer && confidence 
                        ? "bg-red-600 hover:bg-red-700" 
                        : "bg-gray-600 cursor-not-allowed"
                    }`}
                  >
                    Submit Answer ⚔️
                  </Button>
                ) : (
                  <Button 
                    onClick={nextQuestion}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 text-lg font-bold"
                  >
                    {currentQuestion < battleConfig.questionCount ? "Next Question →" : "Complete Battle 🏆"}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Stats */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-white">
                  {battleSession.questions.filter(q => q.isCorrect).length}
                </div>
                <div className="text-sm text-gray-400">Correct</div>
              </div>
              <div>
                <div className="text-lg font-bold text-white">
                  {battleSession.questions.filter(q => q.confidence === 'high').length}
                </div>
                <div className="text-sm text-gray-400">Beast Mode</div>
              </div>
              <div>
                <div className="text-lg font-bold text-white">
                  {battleSession.questions.length > 0 ? 
                    Math.round(battleSession.questions.reduce((acc, q) => acc + q.timeSpent, 0) / battleSession.questions.length) : 0
                  }s
                </div>
                <div className="text-sm text-gray-400">Avg Time</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BeastBattle;
