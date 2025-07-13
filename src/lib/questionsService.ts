import { supabase } from './supabaseClient';

export interface Question {
  id: string;
  exam_id: number;
  subject_id: number;
  chapter_id: number;
  topic_id: number;
  subtopic_id: number;
  question_text: string;
  options: { [key: string]: string }; // JSONB format: { "A": "Option A", "B": "Option B", ... }
  correct_option: string; // 'A', 'B', 'C', or 'D'
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  source_type: 'PYQ' | 'Book' | 'YouTube' | 'Coaching' | 'Custom';
  source_name: string;
  year: number;
  created_by: string;
  is_verified: boolean;
  created_at: string;
}

export interface BattleConfig {
  subject: string;
  topic: string;
  source: string;
  difficulty: string;
  timeLimit: number;
  questionCount: number;
}

export interface QuestionFilter {
  examId?: number;
  subjectId?: number;
  chapterId?: number;
  topicId?: number;
  subtopicId?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  sourceType?: 'PYQ' | 'Book' | 'YouTube' | 'Coaching' | 'Custom';
  limit?: number;
}

export class QuestionsService {
  /**
   * Fetch questions based on filter criteria
   */
  static async getQuestions(filter: QuestionFilter): Promise<Question[]> {
    try {
      let query = supabase
        .from('questions')
        .select('*');

      // Apply filters
      if (filter.examId) {
        query = query.eq('exam_id', filter.examId);
      }
      if (filter.subjectId) {
        query = query.eq('subject_id', filter.subjectId);
      }
      if (filter.chapterId) {
        query = query.eq('chapter_id', filter.chapterId);
      }
      if (filter.topicId) {
        query = query.eq('topic_id', filter.topicId);
      }
      if (filter.subtopicId) {
        query = query.eq('subtopic_id', filter.subtopicId);
      }
      if (filter.difficulty) {
        query = query.eq('difficulty', filter.difficulty);
      }
      if (filter.sourceType) {
        query = query.eq('source_type', filter.sourceType);
      }

      // Add limit if specified
      if (filter.limit) {
        query = query.limit(filter.limit);
      }

      // Randomize the order for variety
      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching questions:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getQuestions:', error);
      return [];
    }
  }

  /**
   * Get questions for a specific battle configuration
   */
  static async getQuestionsForBattle(
    battleConfig: BattleConfig,
    examId: number
  ): Promise<Question[]> {
    try {
      // First, get the subject ID from the subject name
      const { data: subjectData, error: subjectError } = await supabase
        .from('subjects')
        .select('id')
        .eq('name', battleConfig.subject)
        .eq('exam_id', examId)
        .single();

      if (subjectError || !subjectData) {
        console.error('Error fetching subject:', subjectError);
        return [];
      }

      const filter: QuestionFilter = {
        examId,
        subjectId: subjectData.id,
        limit: battleConfig.questionCount
      };

      // Add topic filter if specified
      if (battleConfig.topic && battleConfig.topic !== 'all') {
        const { data: topicData, error: topicError } = await supabase
          .from('chapters')
          .select('id')
          .eq('name', battleConfig.topic)
          .eq('subject_id', subjectData.id)
          .single();

        if (!topicError && topicData) {
          filter.chapterId = topicData.id;
        }
      }

      // Add difficulty filter if specified
      if (battleConfig.difficulty && battleConfig.difficulty !== 'Mixed') {
        filter.difficulty = battleConfig.difficulty as 'Easy' | 'Medium' | 'Hard';
      }

      // Add source type filter if specified
      if (battleConfig.source) {
        const sourceTypeMap: { [key: string]: 'PYQ' | 'Book' | 'YouTube' | 'Coaching' | 'Custom' } = {
          'Previous Year Papers': 'PYQ',
          'Reference Books': 'Book',
          'YouTube Videos': 'YouTube',
          'Coaching DPP': 'Coaching',
          'Custom Questions': 'Custom',
          'Online Platform': 'Custom'
        };

        const sourceType = sourceTypeMap[battleConfig.source];
        if (sourceType) {
          filter.sourceType = sourceType;
        }
      }

      return await this.getQuestions(filter);
    } catch (error) {
      console.error('Error in getQuestionsForBattle:', error);
      return [];
    }
  }

  /**
   * Get question statistics for a subject
   */
  static async getQuestionStats(subjectId: number, examId: number) {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('difficulty, source_type')
        .eq('subject_id', subjectId)
        .eq('exam_id', examId);

      if (error) {
        console.error('Error fetching question stats:', error);
        return null;
      }

      const stats = {
        total: data?.length || 0,
        byDifficulty: {
          Easy: data?.filter(q => q.difficulty === 'Easy').length || 0,
          Medium: data?.filter(q => q.difficulty === 'Medium').length || 0,
          Hard: data?.filter(q => q.difficulty === 'Hard').length || 0
        },
        bySource: {
          PYQ: data?.filter(q => q.source_type === 'PYQ').length || 0,
          Book: data?.filter(q => q.source_type === 'Book').length || 0,
          YouTube: data?.filter(q => q.source_type === 'YouTube').length || 0,
          Coaching: data?.filter(q => q.source_type === 'Coaching').length || 0,
          Custom: data?.filter(q => q.source_type === 'Custom').length || 0
        }
      };

      return stats;
    } catch (error) {
      console.error('Error in getQuestionStats:', error);
      return null;
    }
  }

  /**
   * Convert question format for battle component
   */
  static formatQuestionForBattle(question: Question) {
    const options = question.options;
    const correctIndex = Object.keys(options).indexOf(question.correct_option);
    
    return {
      id: question.id,
      question: question.question_text,
      options: Object.values(options),
      correct: correctIndex,
      explanation: question.explanation,
      difficulty: question.difficulty,
      source: question.source_type,
      year: question.year
    };
  }
} 