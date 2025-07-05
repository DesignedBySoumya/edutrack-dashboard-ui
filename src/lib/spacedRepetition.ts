import { supabase } from './supabaseClient';

// 1. Ensure card_reviews row exists for this user/card
export async function ensureCardReviewRow(cardId: string) {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw userError || new Error('No user logged in');
    const userId = user.id;

    console.log("Ensuring card review row for:", userId, cardId);

    // Use filter + maybeSingle to prevent 406
    const { data: existing, error: selectError } = await supabase
      .from('card_reviews')
      .select('id')
      .filter('user_id', 'eq', userId)
      .filter('card_id', 'eq', cardId)
      .maybeSingle();

    if (selectError) throw selectError;

    if (!existing) {
      const { error: insertError } = await supabase
        .from('card_reviews')
        .insert({ user_id: userId, card_id: cardId, next_review_at: new Date() });
      if (insertError) throw insertError;
    }
  } catch (err) {
    console.error('ensureCardReviewRow error:', err);
  }
}

// 2. Mark card correct
export async function markCardCorrect(cardId: string) {
  try {
    await ensureCardReviewRow(cardId);
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw userError || new Error('No user logged in');
    const userId = user.id;

    // Get current correct_count
    const { data: review, error: selectError } = await supabase
      .from('card_reviews')
      .select('correct_count')
      .eq('user_id', userId)
      .eq('card_id', cardId)
      .single();
    if (selectError) throw selectError;
    const correctCount = (review?.correct_count || 0) + 1;

    // Calculate next_review_at
    let days = 2;
    if (correctCount === 2) days = 4;
    else if (correctCount === 3) days = 7;
    else if (correctCount >= 4) days = 14;
    const nextReviewAt = new Date();
    nextReviewAt.setDate(nextReviewAt.getDate() + days);

    // Update row
    const { error: updateError } = await supabase
      .from('card_reviews')
      .update({
        correct_count: correctCount,
        last_reviewed_at: new Date(),
        next_review_at: nextReviewAt,
        updated_at: new Date(),
      })
      .eq('user_id', userId)
      .eq('card_id', cardId);
    if (updateError) throw updateError;
  } catch (err) {
    console.error('markCardCorrect error:', err);
  }
}

// 3. Mark card incorrect
export async function markCardIncorrect(cardId: string) {
  try {
    await ensureCardReviewRow(cardId);
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw userError || new Error('No user logged in');
    const userId = user.id;

    // Get current incorrect_count
    const { data: review, error: selectError } = await supabase
      .from('card_reviews')
      .select('incorrect_count')
      .eq('user_id', userId)
      .eq('card_id', cardId)
      .single();
    if (selectError) throw selectError;
    const incorrectCount = (review?.incorrect_count || 0) + 1;

    // next_review_at = now + 1 day
    const nextReviewAt = new Date();
    nextReviewAt.setDate(nextReviewAt.getDate() + 1);

    // Update row
    const { error: updateError } = await supabase
      .from('card_reviews')
      .update({
        incorrect_count: incorrectCount,
        last_reviewed_at: new Date(),
        next_review_at: nextReviewAt,
        updated_at: new Date(),
      })
      .eq('user_id', userId)
      .eq('card_id', cardId);
    if (updateError) throw updateError;
  } catch (err) {
    console.error('markCardIncorrect error:', err);
  }
}

// 4. Get due flashcards
export async function getDueFlashcards() {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw userError || new Error('No user logged in');
    const userId = user.id;
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('flashcards')
      .select('*, card_reviews!inner(*)')
      .eq('card_reviews.user_id', userId)
      .lte('card_reviews.next_review_at', now);
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('getDueFlashcards error:', err);
    return [];
  }
} 