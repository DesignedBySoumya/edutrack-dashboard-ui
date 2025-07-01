
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Chapter {
  id: string;
  subject_id: string;
  name: string;
  progress: number;
  created_at: string;
  updated_at: string;
}

export const useChapters = (subjectId?: string) => {
  return useQuery({
    queryKey: ['chapters', subjectId],
    queryFn: async () => {
      let query = supabase.from('chapters').select('*');
      
      if (subjectId) {
        query = query.eq('subject_id', subjectId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as Chapter[];
    },
    enabled: !!subjectId,
  });
};

export const useCreateChapter = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (chapter: Omit<Chapter, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('chapters')
        .insert([chapter])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chapters'] });
      toast({
        title: "Success",
        description: "Chapter created successfully",
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
