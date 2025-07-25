
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Target, Clock, BookOpen, Database, AlertCircle } from "lucide-react";
import { supabase } from '@/lib/supabaseClient';
import { QuestionsService, BattleConfig } from '@/lib/questionsService';

interface AttackPlanProps {
  examId?: number;
}

const AttackPlan = ({ examId }: AttackPlanProps) => {
  const navigate = useNavigate();
  const [battleConfig, setBattleConfig] = useState<BattleConfig>({
    subject: "",
    topic: "",
    source: "",
    difficulty: "",
    timeLimit: 30,
    questionCount: 20
  });
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState({});
  const [questionStats, setQuestionStats] = useState<any>(null);
  const [availableQuestions, setAvailableQuestions] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSubjectsAndChapters = async () => {
      const examIdToUse = examId || Number(localStorage.getItem('selectedExamId')) || 1;
      const { data: subjectsData, error: subError } = await supabase.from('subjects').select('*').eq('exam_id', examIdToUse);
      if (subError) {
        console.error('Error loading subjects:', subError);
        return;
      }
      setSubjects(subjectsData);
      const topicsObj = {};
      for (const subject of subjectsData) {
        const { data: chapters, error: chapError } = await supabase
          .from('chapters')
          .select('*')
          .eq('subject_id', subject.id);
        if (chapError) {
          console.error(`Error loading chapters for ${subject.name}:`, chapError);
          continue;
        }
        topicsObj[subject.name] = chapters.map(ch => ch.name);
      }
      setTopics(topicsObj);
    };
    fetchSubjectsAndChapters();
  }, [examId]);

  // Fetch question stats when subject changes
  useEffect(() => {
    const fetchQuestionStats = async () => {
      if (!battleConfig.subject) {
        setQuestionStats(null);
        setAvailableQuestions(0);
        return;
      }

      setLoading(true);
      try {
        const examIdToUse = examId || Number(localStorage.getItem('selectedExamId')) || 1;
        const subjectData = subjects.find((s: any) => s.name === battleConfig.subject);
        
        if (subjectData) {
          const stats = await QuestionsService.getQuestionStats(subjectData.id, examIdToUse);
          setQuestionStats(stats);
          
          // Calculate available questions based on current config
          const questions = await QuestionsService.getQuestionsForBattle(battleConfig, examIdToUse);
          setAvailableQuestions(questions.length);
        }
      } catch (error) {
        console.error('Error fetching question stats:', error);
        setQuestionStats(null);
        setAvailableQuestions(0);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionStats();
  }, [battleConfig.subject, battleConfig.topic, battleConfig.difficulty, battleConfig.source, subjects, examId]);

  const sources = [
    "Coaching DPP", "Previous Year Papers", "Reference Books", 
    "Online Platform", "YouTube Videos", "Custom Questions"
  ];

  const difficulties = ["Easy", "Medium", "Hard", "Mixed"];

  const isConfigComplete = battleConfig.subject && battleConfig.source && battleConfig.difficulty && availableQuestions > 0;

  const startBattle = () => {
    if (isConfigComplete) {
      navigate("/battlefield/attack/battle", { state: { battleConfig } });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/battlefield/attack")}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Attack
          </Button>
          <h1 className="text-3xl font-bold text-white">🎯 Plan Your Battle</h1>
          <div></div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Configuration Panel */}
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Battle Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Subject Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                  <Select onValueChange={(value) => setBattleConfig({...battleConfig, subject: value, topic: ""})}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Choose your battlefield" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      {subjects.length === 0 ? (
                        <SelectItem value="no-subjects" disabled>No subjects found</SelectItem>
                      ) : (
                        subjects.map((subject: any) => (
                          <SelectItem key={subject.name} value={subject.name} className="text-white hover:bg-gray-600">
                            {subject.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Topic Selection */}
                {battleConfig.subject && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Topic (Optional)</label>
                    <Select onValueChange={(value) => setBattleConfig({...battleConfig, topic: value})}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Specific topic or all topics" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="all" className="text-white hover:bg-gray-600">All Topics</SelectItem>
                        {(topics[battleConfig.subject] || []).length === 0 ? (
                          <SelectItem value="no-topics" disabled>No topics found</SelectItem>
                        ) : (
                          (topics[battleConfig.subject] || []).map((topic: string) => (
                            <SelectItem key={topic} value={topic} className="text-white hover:bg-gray-600">
                              {topic}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Source Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Question Source</label>
                  <Select onValueChange={(value) => setBattleConfig({...battleConfig, source: value})}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Where are your questions from?" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      {sources.map(source => (
                        <SelectItem key={source} value={source} className="text-white hover:bg-gray-600">
                          {source}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Difficulty Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty Level</label>
                  <div className="grid grid-cols-2 gap-2">
                    {difficulties.map(difficulty => (
                      <Button
                        key={difficulty}
                        variant={battleConfig.difficulty === difficulty ? "default" : "outline"}
                        onClick={() => setBattleConfig({...battleConfig, difficulty})}
                        className={`${
                          battleConfig.difficulty === difficulty 
                            ? "bg-red-600 hover:bg-red-700" 
                            : "border-gray-600 text-gray-300 hover:bg-gray-700"
                        }`}
                      >
                        {difficulty}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Battle Settings */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Questions</label>
                    <Select onValueChange={(value) => setBattleConfig({...battleConfig, questionCount: parseInt(value)})}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="20" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="10" className="text-white hover:bg-gray-600">10 Questions</SelectItem>
                        <SelectItem value="20" className="text-white hover:bg-gray-600">20 Questions</SelectItem>
                        <SelectItem value="30" className="text-white hover:bg-gray-600">30 Questions</SelectItem>
                        <SelectItem value="50" className="text-white hover:bg-gray-600">50 Questions</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Time/Q (sec)</label>
                    <Select onValueChange={(value) => setBattleConfig({...battleConfig, timeLimit: parseInt(value)})}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="30" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="20" className="text-white hover:bg-gray-600">20 sec</SelectItem>
                        <SelectItem value="30" className="text-white hover:bg-gray-600">30 sec</SelectItem>
                        <SelectItem value="45" className="text-white hover:bg-gray-600">45 sec</SelectItem>
                        <SelectItem value="60" className="text-white hover:bg-gray-600">60 sec</SelectItem>
                        <SelectItem value="0" className="text-white hover:bg-gray-600">No limit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Battle Preview */}
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Battle Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Configuration Summary */}
                  <div className="space-y-3">
                    {battleConfig.subject && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Subject:</span>
                        <Badge className="bg-red-600">{battleConfig.subject}</Badge>
                      </div>
                    )}
                    
                    {battleConfig.topic && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Topic:</span>
                        <Badge variant="outline" className="border-gray-600 text-gray-300">{battleConfig.topic}</Badge>
                      </div>
                    )}
                    
                    {battleConfig.source && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Source:</span>
                        <Badge variant="outline" className="border-gray-600 text-gray-300">{battleConfig.source}</Badge>
                      </div>
                    )}
                    
                    {battleConfig.difficulty && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Difficulty:</span>
                        <Badge className={`${
                          battleConfig.difficulty === 'Easy' ? 'bg-green-600' :
                          battleConfig.difficulty === 'Medium' ? 'bg-yellow-600' :
                          battleConfig.difficulty === 'Hard' ? 'bg-red-600' :
                          'bg-purple-600'
                        }`}>
                          {battleConfig.difficulty}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Battle Stats */}
                  <div className="border-t border-gray-700 pt-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-white">{battleConfig.questionCount}</div>
                        <div className="text-sm text-gray-400">Questions</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-white">
                          {battleConfig.timeLimit ? `${battleConfig.timeLimit}s` : "∞"}
                        </div>
                        <div className="text-sm text-gray-400">Per Question</div>
                      </div>
                    </div>
                  </div>

                  {/* Estimated Duration */}
                  <div className="text-center p-3 bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-center gap-2 text-gray-300">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">
                        Estimated Duration: {Math.round((battleConfig.questionCount * (battleConfig.timeLimit || 45)) / 60)} minutes
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Question Availability */}
            {battleConfig.subject && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Question Database
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
                      <p className="text-gray-400 mt-2">Loading questions...</p>
                    </div>
                  ) : questionStats ? (
                    <div className="space-y-4">
                      {/* Available Questions */}
                      <div className="text-center p-4 bg-gray-700 rounded-lg">
                        <div className="text-2xl font-bold text-white">{availableQuestions}</div>
                        <div className="text-sm text-gray-400">Available Questions</div>
                        {availableQuestions < battleConfig.questionCount && (
                          <div className="flex items-center justify-center gap-2 mt-2 text-yellow-400">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-xs">Not enough questions for {battleConfig.questionCount} battle</span>
                          </div>
                        )}
                      </div>

                      {/* Question Stats */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-gray-300 mb-2">By Difficulty</h4>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-green-400">Easy:</span>
                              <span className="text-white">{questionStats.byDifficulty.Easy}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-yellow-400">Medium:</span>
                              <span className="text-white">{questionStats.byDifficulty.Medium}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-red-400">Hard:</span>
                              <span className="text-white">{questionStats.byDifficulty.Hard}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-300 mb-2">By Source</h4>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-blue-400">PYQ:</span>
                              <span className="text-white">{questionStats.bySource.PYQ}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-purple-400">Book:</span>
                              <span className="text-white">{questionStats.bySource.Book}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-orange-400">Coaching:</span>
                              <span className="text-white">{questionStats.bySource.Coaching}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Total Questions */}
                      <div className="text-center p-3 bg-gray-700 rounded-lg">
                        <div className="text-lg font-bold text-white">{questionStats.total}</div>
                        <div className="text-sm text-gray-400">Total Questions in Database</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400">No questions available for this subject</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Start Battle Button */}
            <Button 
              onClick={startBattle}
              disabled={!isConfigComplete}
              className={`w-full py-6 text-xl font-bold ${
                isConfigComplete 
                  ? "bg-red-600 hover:bg-red-700 text-white" 
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isConfigComplete ? "⚔️ Start Battle" : "Complete Configuration"}
            </Button>

            {!isConfigComplete && (
              <p className="text-center text-sm text-gray-400">
                {availableQuestions === 0 && battleConfig.subject 
                  ? "No questions available for this configuration" 
                  : "Please select subject, source, and difficulty to continue"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttackPlan;
