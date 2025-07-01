
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface BattleSession {
  id: string;
  user_id: string;
  session_type: 'war' | 'attack' | 'defense';
  start_time: string;
  end_time?: string;
  total_questions: number;
  correct_answers: number;
  incorrect_answers: number;
  total_marks: number;
  time_spent: number;
  subjects_data?: any;
  created_at: string;
  updated_at: string;
}

export const useBattleSessions = () => {
  return useQuery({
    queryKey: ['battle-sessions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('battle_sessions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as BattleSession[];
    },
  });
};

export const useCreateBattleSession = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (session: Omit<BattleSession, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('battle_sessions')
        .insert([{ ...session, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['battle-sessions'] });
      toast({
        title: "Success",
        description: "Battle session saved successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateBattleSession = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<BattleSession> }) => {
      const { data, error } = await supabase
        .from('battle_sessions')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['battle-sessions'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
