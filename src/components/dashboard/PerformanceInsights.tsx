
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { DashboardStats } from "@/lib/dashboardService";

interface PerformanceInsightsProps {
  stats: DashboardStats;
}

export const PerformanceInsights = ({ stats }: PerformanceInsightsProps) => {
  const performanceData = [
    { title: "Last 10 Days Avg", value: stats.last10DaysAvg, subtitle: "Per day", color: "text-blue-400" },
    { title: "Today's Study", value: stats.todayStudy, subtitle: "Current session", color: "text-green-400" },
    { title: "Focus Score", value: `${stats.focusScore}%`, subtitle: "Great! Keep distractions low", color: "text-green-400" },
    { title: "Consistency", value: `${stats.consistency}%`, subtitle: "14/15 days", color: "text-green-400" },
    { title: "Mocks Done", value: stats.mocksDone.toString(), subtitle: "This month", color: "text-yellow-400" },
    { title: "Current Streak", value: `${stats.currentStreak} days`, subtitle: "Keep it up! 🔥", color: "text-orange-400" }
  ];
  
  const subjectData = stats.subjectData;
  const totalSubjectHours = subjectData.reduce((sum, s) => sum + s.hours, 0);
  
  // Intelligent progress prediction and recommendation system
  const generateProgressInsight = () => {
    const { consistency, focusScore, mocksDone, currentStreak, last10DaysAvg, todayStudy } = stats;
    
    // Parse study time to get hours
    const parseStudyTime = (timeStr: string) => {
      const match = timeStr.match(/(\d+)h\s*(\d+)m?/);
      if (match) {
        return parseInt(match[1]) + (parseInt(match[2] || '0') / 60);
      }
      return 0;
    };
    
    const avgHoursPerDay = parseStudyTime(last10DaysAvg);
    const todayHours = parseStudyTime(todayStudy);
    
    // Calculate progress potential based on multiple factors
    const consistencyScore = consistency / 100;
    const focusScoreNormalized = focusScore / 100;
    const mockProgress = Math.min(mocksDone / 10, 1); // Normalize to 0-1, assuming 10 mocks is good
    const streakBonus = Math.min(currentStreak / 30, 0.2); // Up to 20% bonus for long streaks
    
    // Overall progress potential (0-1)
    const progressPotential = (consistencyScore * 0.4 + focusScoreNormalized * 0.3 + mockProgress * 0.2 + streakBonus * 0.1);
    
    // Determine study intensity level
    const studyIntensity = avgHoursPerDay < 1 ? 'low' : avgHoursPerDay < 3 ? 'moderate' : 'high';
    
    // Generate personalized message based on data analysis
    if (consistency < 30) {
      return {
        title: "🚨 Critical: Consistency Crisis",
        message: `You've studied only ${consistency}% of days. At this rate, you'll need ${Math.ceil(500 / (consistency / 100))} months to complete your syllabus. Start with 30 minutes daily to build momentum.`,
        color: "from-red-600/20 to-orange-600/20",
        borderColor: "border-red-500/30",
        textColor: "text-red-300"
      };
    } else if (consistency < 50) {
      return {
        title: "⚠️ Warning: Inconsistent Study Pattern",
        message: `You're missing ${Math.round((50 - consistency) / 3.33)} days per week. Increase to 4-5 days/week to reach your target in ${Math.ceil(500 / (consistency / 100))} months.`,
        color: "from-orange-600/20 to-yellow-600/20",
        borderColor: "border-orange-500/30",
        textColor: "text-orange-300"
      };
    } else if (consistency < 70) {
      return {
        title: "📈 Good Progress, Room for Improvement",
        message: `${consistency}% consistency is decent. With ${avgHoursPerDay.toFixed(1)}h/day average, you're on track for ${Math.ceil(500 / (consistency / 100))} months. Aim for 6-7 days/week to accelerate.`,
        color: "from-yellow-600/20 to-green-600/20",
        borderColor: "border-yellow-500/30",
        textColor: "text-yellow-300"
      };
    } else if (consistency < 85) {
      return {
        title: "🎯 Excellent Consistency!",
        message: `Outstanding ${consistency}% consistency! With ${avgHoursPerDay.toFixed(1)}h/day, you'll complete in ${Math.ceil(500 / (consistency / 100))} months. Consider increasing daily hours to finish faster.`,
        color: "from-green-600/20 to-blue-600/20",
        borderColor: "border-green-500/30",
        textColor: "text-green-300"
      };
    } else {
      return {
        title: "🏆 Elite Performance!",
        message: `Perfect ${consistency}% consistency! You're a study machine with ${avgHoursPerDay.toFixed(1)}h/day. At this pace, you'll finish in ${Math.ceil(500 / (consistency / 100))} months. Keep this momentum!`,
        color: "from-blue-600/20 to-purple-600/20",
        borderColor: "border-blue-500/30",
        textColor: "text-blue-300"
      };
    }
  };
  
  // Generate specific recommendations based on data
  const generateSpecificRecommendations = () => {
    const { consistency, focusScore, mocksDone, currentStreak, subjectData } = stats;
    
    const recommendations = [];
    
    if (consistency < 50) {
      recommendations.push("📅 Set daily study reminders");
      recommendations.push("⏰ Start with 30-minute sessions");
      recommendations.push("🎯 Use Pomodoro technique");
    }
    
    if (focusScore < 70) {
      recommendations.push("🔇 Find a quiet study space");
      recommendations.push("📱 Turn off phone notifications");
      recommendations.push("🧘 Practice mindfulness before study");
    }
    
    if (mocksDone < 3) {
      recommendations.push("📝 Take weekly mock tests");
      recommendations.push("📊 Analyze your weak areas");
      recommendations.push("🎯 Focus on high-weightage topics");
    }
    
    if (currentStreak < 7) {
      recommendations.push("🔥 Maintain your study streak");
      recommendations.push("📈 Gradually increase study time");
      recommendations.push("🏆 Celebrate small wins");
    }
    
    if (subjectData.length > 0) {
      const weakestSubject = subjectData[subjectData.length - 1];
      recommendations.push(`📚 Focus on ${weakestSubject.name} (${weakestSubject.hours}h)`);
    }
    
    return recommendations.slice(0, 3); // Return top 3 recommendations
  };
  
  const progressInsight = generateProgressInsight();
  const recommendations = generateSpecificRecommendations();
  
  // Generate intelligent next best action
  const generateNextBestAction = () => {
    const { consistency, focusScore, mocksDone, currentStreak, last10DaysAvg, todayStudy, subjectData } = stats;
    
    // Parse study time
    const parseStudyTime = (timeStr: string) => {
      const match = timeStr.match(/(\d+)h\s*(\d+)m?/);
      if (match) {
        return parseInt(match[1]) + (parseInt(match[2] || '0') / 60);
      }
      return 0;
    };
    
    const avgHoursPerDay = parseStudyTime(last10DaysAvg);
    const todayHours = parseStudyTime(todayStudy);
    
    // Priority-based action selection
    if (consistency < 30) {
      return {
        title: "🚨 Critical: Build Study Habit",
        message: "Start with a 30-minute session today. Consistency is more important than duration right now.",
        icon: "📅",
        color: "from-red-600/20 to-orange-600/20",
        borderColor: "border-red-500/30",
        textColor: "text-red-300"
      };
    } else if (consistency < 50) {
      return {
        title: "⚠️ Priority: Increase Study Days",
        message: `You've studied ${consistency}% of days. Aim for 4-5 days this week to build momentum.`,
        icon: "📈",
        color: "from-orange-600/20 to-yellow-600/20",
        borderColor: "border-orange-500/30",
        textColor: "text-orange-300"
      };
    } else if (focusScore < 60) {
      return {
        title: "🎯 Focus: Improve Concentration",
        message: "Your focus score is low. Find a quiet space and eliminate distractions for your next session.",
        icon: "🧘",
        color: "from-yellow-600/20 to-green-600/20",
        borderColor: "border-yellow-500/30",
        textColor: "text-yellow-300"
      };
    } else if (mocksDone < 2) {
      return {
        title: "📝 Assessment: Take Mock Test",
        message: "You've taken only 1 mock test. Schedule a mock test this week to assess your progress.",
        icon: "📊",
        color: "from-blue-600/20 to-purple-600/20",
        borderColor: "border-blue-500/30",
        textColor: "text-blue-300"
      };
    } else if (currentStreak < 3) {
      return {
        title: "🔥 Momentum: Maintain Streak",
        message: `You're on a ${currentStreak}-day streak. Study today to keep the momentum going!`,
        icon: "🔥",
        color: "from-green-600/20 to-blue-600/20",
        borderColor: "border-green-500/30",
        textColor: "text-green-300"
      };
    } else if (subjectData.length > 0) {
      // Find the subject with least study time
      const weakestSubject = subjectData[subjectData.length - 1];
      const strongestSubject = subjectData[0];
      
      if (weakestSubject.hours < 2) {
        return {
          title: "📚 Balance: Strengthen Weak Subject",
          message: `${weakestSubject.name} needs attention (${weakestSubject.hours}h). Spend 2 hours on it today.`,
          icon: "📚",
          color: "from-purple-600/20 to-pink-600/20",
          borderColor: "border-purple-500/30",
          textColor: "text-purple-300"
        };
      } else if (avgHoursPerDay < 2) {
        return {
          title: "⏰ Intensity: Increase Study Time",
          message: `You're averaging ${avgHoursPerDay.toFixed(1)}h/day. Aim for 2-3 hours today to accelerate progress.`,
          icon: "⏰",
          color: "from-blue-600/20 to-cyan-600/20",
          borderColor: "border-blue-500/30",
          textColor: "text-blue-300"
        };
      } else {
        return {
          title: "🎯 Excellence: Master Strong Subject",
          message: `Focus on ${strongestSubject.name} (${strongestSubject.hours}h). Aim for mastery in your strongest area.`,
          icon: "🏆",
          color: "from-green-600/20 to-emerald-600/20",
          borderColor: "border-green-500/30",
          textColor: "text-green-300"
        };
      }
    } else {
      return {
        title: "🚀 Start: Begin Your Journey",
        message: "Welcome! Start with a 1-hour study session today to begin tracking your progress.",
        icon: "🚀",
        color: "from-blue-600/20 to-purple-600/20",
        borderColor: "border-blue-500/30",
        textColor: "text-blue-300"
      };
    }
  };
  
  const nextBestAction = generateNextBestAction();
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="tooltip">
          <p className="font-medium">{data.name}</p>
          <p className="text-blue-300">{data.value}h ({((data.value / totalSubjectHours) * 100).toFixed(1)}%)</p>
        </div>
      );
    } 
    return null;
  };

  // Generate intelligent attention needed message
  const generateAttentionMessage = () => {
    const { consistency, focusScore, mocksDone, currentStreak, subjectData } = stats;
    
    if (subjectData.length === 0) {
      return {
        message: "Add subjects to start tracking your progress and get personalized insights.",
        color: "text-gray-400"
      };
    }
    
    // Priority-based attention messages
    if (consistency < 30) {
      return {
        message: "Critical: You're studying less than 30% of days. This will significantly delay your exam preparation.",
        color: "text-red-400"
      };
    } else if (consistency < 50) {
      return {
        message: "Warning: Low consistency detected. You need to study more frequently to meet your goals.",
        color: "text-orange-400"
      };
    } else if (focusScore < 60) {
      return {
        message: "Focus issue: Your concentration is below optimal. Consider changing your study environment.",
        color: "text-yellow-400"
      };
    } else if (mocksDone < 2) {
      return {
        message: "Assessment gap: You need more mock tests to evaluate your preparation level.",
        color: "text-blue-400"
      };
    } else if (currentStreak < 3) {
      return {
        message: "Momentum: Build a longer study streak to maintain motivation and progress.",
        color: "text-green-400"
      };
    } else {
      return {
        message: "Excellent! You're on the right track. Keep maintaining this consistency.",
        color: "text-green-400"
      };
    }
  };
  
  const attentionMessage = generateAttentionMessage();

  return (
    <div className="bg-[#1a1a1d] rounded-xl p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Performance Insights</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {performanceData.map((item, i) => (
              <div key={i} className="bg-[#0e0e10] rounded-lg p-4 transition-transform duration-200 hover:-translate-y-1">
                <div className="text-sm text-gray-400 mb-2">{item.title}</div>
                <div className={`text-xl sm:text-2xl font-bold ${item.color} mb-1`}>{item.value}</div>
                <div className="text-xs text-gray-500">{item.subtitle}</div>
              </div>
            ))}
          </div>
          <div className={`bg-gradient-to-r ${nextBestAction.color} rounded-lg p-4 border ${nextBestAction.borderColor}`}>
            <div className={`text-sm ${nextBestAction.textColor} mb-1`}>{nextBestAction.title}</div>
            <div className="text-lg font-semibold text-white">
              {nextBestAction.message}
            </div>
          </div>
          <div className={`bg-gradient-to-r ${progressInsight.color} rounded-lg p-4 border ${progressInsight.borderColor}`}>
            <div className={`text-sm ${progressInsight.textColor} mb-1`}>{progressInsight.title}</div>
            <div className="text-lg font-semibold text-white mb-3">
              {progressInsight.message}
            </div>
            {recommendations.length > 0 && (
              <div className="space-y-1">
                <div className="text-xs text-gray-300 mb-2">💡 Quick Actions:</div>
                {recommendations.map((rec, index) => (
                  <div key={index} className="text-xs text-gray-300 flex items-center gap-2">
                    <span>•</span>
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="bg-[#0e0e10] rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Subject Breakdown</h3>
          <div className="h-48 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={subjectData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={2} dataKey="hours">
                  {subjectData.map((e, i) => (<Cell key={`cell-${i}`} fill={e.color} />))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {subjectData.map((s, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }}></div>
                  <span className="text-gray-300">{s.name}</span>
                </div>
                <div className="text-white font-medium">{s.hours}h ({((s.hours / totalSubjectHours) * 100).toFixed(0)}%)</div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className={`text-xs ${attentionMessage.color} mb-2`}>⚠️ Attention Needed</div>
            <div className="text-sm text-gray-300">
              {attentionMessage.message}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

