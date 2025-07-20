import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardService, DashboardStats } from '@/lib/dashboardService';

export const useDashboard = (examId?: number | null) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    const fetchDashboardData = async (isInitial = false) => {
      try {
        if (isInitial) {
          setLoading(true);
        } else {
          setRefreshing(true);
        }
        setError(null);
        const dashboardService = new DashboardService(user.id, examId || null);
        const dashboardStats = await dashboardService.getDashboardStats();
        if (isMounted) setStats(dashboardStats);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        if (isMounted) setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
      } finally {
        if (isInitial) {
          setLoading(false);
        } else {
          setRefreshing(false);
        }
      }
    };

    fetchDashboardData(true); // Initial load

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => fetchDashboardData(false), 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [user, examId]); // Add examId to dependency array

  const refreshData = async () => {
    if (!user) return;
    setRefreshing(true);
    try {
      setError(null);
      const dashboardService = new DashboardService(user.id, examId || null);
      const dashboardStats = await dashboardService.getDashboardStats();
      setStats(dashboardStats);
    } catch (err) {
      console.error('Error refreshing dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh dashboard data');
    } finally {
      setRefreshing(false);
    }
  };

  return {
    stats,
    loading,
    error,
    refreshing,
    refreshData
  };
}; 