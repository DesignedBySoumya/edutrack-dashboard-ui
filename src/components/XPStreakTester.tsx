import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getUserStats, simulateSessionCalculation, resetUserData, resetAllUserData, deleteAllReviewSessions } from '@/lib/reviewSessions';

const XPStreakTester = () => {
  const [stats, setStats] = useState<any>(null);
  const [simulation, setSimulation] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchCurrentStats = async () => {
    setLoading(true);
    try {
      const userStats = await getUserStats();
      setStats(userStats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats when component mounts
  React.useEffect(() => {
    fetchCurrentStats();
  }, []);

  const simulateSession = async () => {
    setLoading(true);
    try {
      const sessionStartTime = new Date().toISOString();
      const result = await simulateSessionCalculation(sessionStartTime);
      setSimulation(result);
    } catch (error) {
      console.error('Error simulating session:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetCurrentUser = async () => {
    if (!confirm('Are you sure you want to reset your XP and streak data? This cannot be undone.')) {
      return;
    }
    
    setLoading(true);
    try {
      const result = await resetUserData();
      console.log('Reset result:', result);
      // Refresh stats after reset
      await fetchCurrentStats();
      alert('Your XP and streak data has been reset!');
    } catch (error) {
      console.error('Error resetting user data:', error);
      alert('Failed to reset data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetAllUsers = async () => {
    if (!confirm('Are you sure you want to reset ALL users\' XP and streak data? This cannot be undone.')) {
      return;
    }
    
    setLoading(true);
    try {
      const result = await resetAllUserData();
      console.log('Reset all users result:', result);
      // Refresh stats after reset
      await fetchCurrentStats();
      alert(`Successfully reset data for ${result.updatedRows} users!`);
    } catch (error) {
      console.error('Error resetting all user data:', error);
      alert('Failed to reset all user data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deleteAllSessions = async () => {
    if (!confirm('⚠️ DANGER: Are you sure you want to DELETE ALL review sessions? This will permanently remove all session data and cannot be undone.')) {
      return;
    }
    
    if (!confirm('⚠️ FINAL WARNING: This will delete ALL review sessions for ALL users. Are you absolutely sure?')) {
      return;
    }
    
    setLoading(true);
    try {
      const result = await deleteAllReviewSessions();
      console.log('Delete all sessions result:', result);
      alert(`Successfully deleted ${result.deletedRows} review sessions!`);
    } catch (error) {
      console.error('Error deleting all sessions:', error);
      alert('Failed to delete all sessions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card className="bg-[#1C2541] border-[#2563EB]/20">
        <CardHeader>
          <CardTitle className="text-white">XP & Streak Logic Tester</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 flex-wrap">
            <Button 
              onClick={fetchCurrentStats} 
              disabled={loading}
              className="bg-[#2563EB] hover:bg-[#1E3A8A]"
            >
              {loading ? 'Loading...' : 'Get Current Stats'}
            </Button>
            <Button 
              onClick={simulateSession} 
              disabled={loading}
              variant="outline"
              className="border-[#2563EB]/30 text-white"
            >
              {loading ? 'Calculating...' : 'Simulate Session'}
            </Button>
          </div>
          
          <div className="border-t border-[#2563EB]/20 pt-4">
            <h3 className="text-white font-semibold mb-3">Reset Options</h3>
            <div className="flex gap-4 flex-wrap">
              <Button 
                onClick={resetCurrentUser} 
                disabled={loading}
                variant="outline"
                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
              >
                {loading ? 'Resetting...' : 'Reset My Data'}
              </Button>
              <Button 
                onClick={resetAllUsers} 
                disabled={loading}
                variant="outline"
                className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
              >
                {loading ? 'Resetting...' : 'Reset All Users'}
              </Button>
              <Button 
                onClick={deleteAllSessions} 
                disabled={loading}
                variant="outline"
                className="border-red-600/30 text-red-500 hover:bg-red-600/10"
              >
                {loading ? 'Deleting...' : 'Delete All Sessions'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {stats && (
        <Card className="bg-[#1C2541] border-[#2563EB]/20">
          <CardHeader>
            <CardTitle className="text-white">Current Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-[#0A0E27] p-4 rounded-xl">
                <div className="text-2xl font-bold text-yellow-400">{stats.total_xp_earned}</div>
                <div className="text-sm text-[#93A5CF]">Total XP</div>
              </div>
              <div className="bg-[#0A0E27] p-4 rounded-xl">
                <div className="text-2xl font-bold text-red-400">{stats.streak_count}</div>
                <div className="text-sm text-[#93A5CF]">Current Streak</div>
              </div>
              <div className="bg-[#0A0E27] p-4 rounded-xl">
                <div className="text-2xl font-bold text-blue-400">{stats.level}</div>
                <div className="text-sm text-[#93A5CF]">Level</div>
              </div>
            </div>
            {stats.ended_at && (
              <div className="mt-4 text-center text-[#93A5CF] text-sm">
                Last session: {new Date(stats.ended_at).toLocaleDateString()}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {simulation && (
        <Card className="bg-[#1C2541] border-[#2563EB]/20">
          <CardHeader>
            <CardTitle className="text-white">Session Simulation Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#0A0E27] p-4 rounded-xl">
                  <div className="text-lg font-bold text-[#93A5CF] mb-2">Current → New</div>
                  <div className="space-y-2 text-sm">
                    <div>XP: {simulation.currentXp} → {simulation.newXp}</div>
                    <div>Streak: {simulation.currentStreak} → {simulation.newStreak}</div>
                    <div>Level: {simulation.currentLevel} → {simulation.newLevel}</div>
                  </div>
                </div>
                <div className="bg-[#0A0E27] p-4 rounded-xl">
                  <div className="text-lg font-bold text-[#93A5CF] mb-2">Changes</div>
                  <div className="space-y-2 text-sm">
                    <div className={simulation.newXp > simulation.currentXp ? 'text-green-400' : 'text-red-400'}>
                      XP: {simulation.newXp > simulation.currentXp ? '+' : ''}{simulation.newXp - simulation.currentXp}
                    </div>
                    <div className={simulation.newStreak > simulation.currentStreak ? 'text-green-400' : 'text-red-400'}>
                      Streak: {simulation.newStreak > simulation.currentStreak ? '+' : ''}{simulation.newStreak - simulation.currentStreak}
                    </div>
                    <div className={simulation.newLevel > simulation.currentLevel ? 'text-green-400' : 'text-red-400'}>
                      Level: {simulation.newLevel > simulation.currentLevel ? '+' : ''}{simulation.newLevel - simulation.currentLevel}
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center text-[#93A5CF] text-sm">
                Days since last session: {simulation.daysSinceLastSession}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default XPStreakTester; 