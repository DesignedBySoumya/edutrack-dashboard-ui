import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFlashcardStore } from '@/store/flashcardStore';
import { getUserStats } from '@/lib/reviewSessions';
import { Trophy, Flame, Target } from 'lucide-react';

const UserStatsDisplay = () => {
  const { points, streak, level, fetchUserStats } = useFlashcardStore();
  const [supabaseStats, setSupabaseStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchFromSupabase = async () => {
    setLoading(true);
    try {
      const stats = await getUserStats();
      setSupabaseStats(stats);
      console.log('📊 Fetched stats from Supabase:', stats);
    } catch (error) {
      console.error('Error fetching from Supabase:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshStoreStats = async () => {
    setLoading(true);
    try {
      await fetchUserStats();
      console.log('🔄 Refreshed store stats');
    } catch (error) {
      console.error('Error refreshing store stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFromSupabase();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="bg-[#1C2541] border-[#2563EB]/20">
        <CardHeader>
          <CardTitle className="text-white">User Stats Comparison</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 flex-wrap">
            <Button 
              onClick={fetchFromSupabase} 
              disabled={loading}
              className="bg-[#2563EB] hover:bg-[#1E3A8A]"
            >
              {loading ? 'Loading...' : 'Fetch from Supabase'}
            </Button>
            <Button 
              onClick={refreshStoreStats} 
              disabled={loading}
              variant="outline"
              className="border-[#2563EB]/30 text-white"
            >
              {loading ? 'Refreshing...' : 'Refresh Store Stats'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Store Stats */}
        <Card className="bg-[#1C2541] border-[#2563EB]/20">
          <CardHeader>
            <CardTitle className="text-white">Store Stats (Local State)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-[#0A0E27] p-4 rounded-xl">
                <div className="text-2xl font-bold text-yellow-400">{points}</div>
                <div className="text-sm text-[#93A5CF]">XP</div>
              </div>
              <div className="bg-[#0A0E27] p-4 rounded-xl">
                <div className="text-2xl font-bold text-red-400">{streak}</div>
                <div className="text-sm text-[#93A5CF]">Streak</div>
              </div>
              <div className="bg-[#0A0E27] p-4 rounded-xl">
                <div className="text-2xl font-bold text-blue-400">{level}</div>
                <div className="text-sm text-[#93A5CF]">Level</div>
              </div>
            </div>
            <div className="mt-4 text-center text-[#93A5CF] text-sm">
              These values come from the Zustand store
            </div>
          </CardContent>
        </Card>

        {/* Supabase Stats */}
        <Card className="bg-[#1C2541] border-[#2563EB]/20">
          <CardHeader>
            <CardTitle className="text-white">Supabase Stats (Database)</CardTitle>
          </CardHeader>
          <CardContent>
            {supabaseStats ? (
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-[#0A0E27] p-4 rounded-xl">
                  <div className="text-2xl font-bold text-yellow-400">{supabaseStats.total_xp_earned}</div>
                  <div className="text-sm text-[#93A5CF]">XP</div>
                </div>
                <div className="bg-[#0A0E27] p-4 rounded-xl">
                  <div className="text-2xl font-bold text-red-400">{supabaseStats.streak_count}</div>
                  <div className="text-sm text-[#93A5CF]">Streak</div>
                </div>
                <div className="bg-[#0A0E27] p-4 rounded-xl">
                  <div className="text-2xl font-bold text-blue-400">{supabaseStats.level}</div>
                  <div className="text-sm text-[#93A5CF]">Level</div>
                </div>
              </div>
            ) : (
              <div className="text-center text-[#93A5CF] py-8">
                {loading ? 'Loading...' : 'No data fetched yet'}
              </div>
            )}
            <div className="mt-4 text-center text-[#93A5CF] text-sm">
              These values come directly from the database
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Indicator */}
      <Card className="bg-[#1C2541] border-[#2563EB]/20">
        <CardHeader>
          <CardTitle className="text-white">Sync Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${points === supabaseStats?.total_xp_earned ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-[#93A5CF]">
                XP Sync: {points === supabaseStats?.total_xp_earned ? '✅ Synced' : '❌ Out of sync'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${streak === supabaseStats?.streak_count ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-[#93A5CF]">
                Streak Sync: {streak === supabaseStats?.streak_count ? '✅ Synced' : '❌ Out of sync'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${level === supabaseStats?.level ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-[#93A5CF]">
                Level Sync: {level === supabaseStats?.level ? '✅ Synced' : '❌ Out of sync'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserStatsDisplay; 