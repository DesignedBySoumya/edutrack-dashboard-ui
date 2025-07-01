
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface TimetableEntry {
  id: string;
  user_id: string;
  day: string;
  start_time: string;
  end_time: string;
  category: string;
  color: string;
  notifications: boolean;
  created_at: string;
  updated_at: string;
}

export const useTimetable = () => {
  return useQuery({
    queryKey: ['timetable'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('timetable_entries')
        .select('*')
        .order('day', { ascending: true });
      
      if (error) throw error;
      return data as TimetableEntry[];
    },
  });
};

export const useCreateTimetableEntry = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (entry: Omit<TimetableEntry, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('timetable_entries')
        .insert([{ ...entry, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timetable'] });
      toast({
        title: "Success",
        description: "Timetable entry created successfully",
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

export const useDeleteTimetableEntry = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('timetable_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timetable'] });
      toast({
        title: "Success",
        description: "Timetable entry deleted successfully",
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
