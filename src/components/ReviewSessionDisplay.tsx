import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, Trophy, Target, Clock, Star } from 'lucide-react';

interface ReviewSession {
  id: string;
  user_id: string;
  started_at: string;
  ended_at: string;
  correct_count: number;
  incorrect_count: number;
  accuracy: number;
  total_xp_earned: number;
  streak_count: number;
  level: number;
  cards_reviewed: number;
  created_at: string;
}

interface InfoRowProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  className?: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value, icon, className = '' }) => (
  <div className={`flex items-center justify-between py-2 ${className}`}>
    <div className="flex items-center gap-2 text-sm text-gray-400">
      {icon}
      <span>{label}</span>
    </div>
    <span className="font-semibold text-white">{value}</span>
  </div>
);

const ReviewSessionDisplay: React.FC = () => {
  const [session, setSession] = useState<ReviewSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestSession = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          throw new Error('User not authenticated');
        }

        // Fetch the latest review session for the user
        const { data, error: sessionError } = await supabase
          .from('review_sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (sessionError) {
          if (sessionError.code === 'PGRST116') {
            // No sessions found
            setSession(null);
          } else {
            throw new Error(`Failed to fetch session: ${sessionError.message}`);
          }
        } else {
          setSession(data);
        }
      } catch (err) {
        console.error('Error fetching review session:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchLatestSession();
  }, []);

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 60) {
      return `${diffMins}m`;
    }
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-400">Loading session data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
            <p className="text-red-400 font-medium mb-2">Error Loading Session</p>
            <p className="text-gray-400 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="bg-gray-500/10 border border-gray-500/20 rounded-lg p-6">
            <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-400 font-medium mb-2">No Sessions Found</p>
            <p className="text-gray-500 text-sm">Complete your first review session to see your stats here.</p>
          </div>
        </div>
      </div>
    );
  }

  const totalCards = session.correct_count + session.incorrect_count;
  const accuracyPercentage = totalCards > 0 ? Math.round((session.correct_count / totalCards) * 100) : 0;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="bg-[#1C2541] border-[#2563EB]/20">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            <CardTitle className="text-2xl font-bold text-white">✅ Session Complete</CardTitle>
          </div>
          <p className="text-gray-400 text-sm">
            {formatDateTime(session.ended_at)}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Performance Overview */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-[#0A0E27] rounded-xl">
              <div className="text-2xl font-bold text-green-400">{session.correct_count}</div>
              <div className="text-sm text-gray-400">Correct</div>
            </div>
            <div className="text-center p-4 bg-[#0A0E27] rounded-xl">
              <div className="text-2xl font-bold text-red-400">{session.incorrect_count}</div>
              <div className="text-sm text-gray-400">Incorrect</div>
            </div>
            <div className="text-center p-4 bg-[#0A0E27] rounded-xl">
              <div className="text-2xl font-bold text-blue-400">{accuracyPercentage}%</div>
              <div className="text-sm text-gray-400">Accuracy</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Session Progress</span>
              <span className="text-white">{totalCards} cards reviewed</span>
            </div>
            <Progress 
              value={accuracyPercentage} 
              className="h-2 bg-gray-700"
            />
          </div>

          {/* Session Details */}
          <div className="space-y-3 pt-4 border-t border-gray-700">
            <InfoRow 
              label="XP Earned" 
              value={`+${session.total_xp_earned}`}
              icon={<Star className="h-4 w-4 text-yellow-500" />}
              className="text-yellow-400"
            />
            <InfoRow 
              label="Current Streak" 
              value={session.streak_count}
              icon={<Target className="h-4 w-4 text-red-500" />}
              className="text-red-400"
            />
            <InfoRow 
              label="Level" 
              value={session.level}
              icon={<Trophy className="h-4 w-4 text-blue-500" />}
              className="text-blue-400"
            />
            <InfoRow 
              label="Session Duration" 
              value={formatDuration(session.started_at, session.ended_at)}
              icon={<Clock className="h-4 w-4 text-gray-400" />}
            />
            <InfoRow 
              label="Started" 
              value={formatDateTime(session.started_at)}
              icon={<Clock className="h-4 w-4 text-gray-400" />}
            />
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 pt-4">
            <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
              {session.correct_count} Correct
            </Badge>
            <Badge variant="secondary" className="bg-red-500/20 text-red-400 border-red-500/30">
              {session.incorrect_count} Incorrect
            </Badge>
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              Level {session.level}
            </Badge>
            <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
              {session.streak_count} Day Streak
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewSessionDisplay; 