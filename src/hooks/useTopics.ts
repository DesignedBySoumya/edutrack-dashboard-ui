
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Topic {
  id: string;
  chapter_id: string;
  name: string;
  is_completed: boolean;
  time_spent?: string;
  created_at: string;
  updated_at: string;
}

export const useTopics = (chapterId?: string) => {
  return useQuery({
    queryKey: ['topics', chapterId],
    queryFn: async () => {
      let query = supabase.from('topics').select('*');
      
      if (chapterId) {
        query = query.eq('chapter_id', chapterId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as Topic[];
    },
    enabled: !!chapterId,
  });
};

export const useCreateTopic = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (topic: Omit<Topic, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('topics')
        .insert([topic])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      toast({
        title: "Success",
        description: "Topic created successfully",
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

export const useUpdateTopic = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Topic> }) => {
      const { data, error } = await supabase
        .from('topics')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
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
