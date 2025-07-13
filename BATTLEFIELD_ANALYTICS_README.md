# Battlefield Analytics Implementation

This document describes the implementation of the Battlefield Analytics system that tracks user performance in MCQ battles using Supabase.

## Overview

The analytics system provides comprehensive insights into user battle performance, including:
- Overall performance metrics (sessions, questions, accuracy, speed)
- Speed analysis (Fast Mode, Normal Speed, Too Slow)
- Streak tracking (current and longest streaks)
- Time distribution analysis
- Confidence level analysis
- Weekly performance trends
- AI-powered insights and recommendations

## Database Schema

### battle_logs Table
The analytics system uses the `battle_logs` table to store battle data:

```sql
CREATE TABLE battle_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  question_id UUID REFERENCES questions(id),
  selected_answer TEXT,
  correct_answer TEXT,
  is_correct BOOLEAN,
  time_spent INTEGER,
  confidence_level TEXT CHECK (confidence_level IN ('Low', 'Medium', 'High')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## SQL Queries

The `battlefield_analytics_queries.sql` file contains 10 comprehensive queries:

1. **Overall Performance Analytics** - Total sessions, questions, average time, accuracy
2. **Beast Mode and Speed Analytics** - Fast (≤30s), slow (>80s), normal speed percentages
3. **Recent Activity (Last 7 Days)** - Recent performance metrics
4. **Daily Activity for Streak Calculation** - Unique battle dates for streak tracking
5. **Session-wise Analytics** - Detailed analytics per battle session
6. **Improvement Trend Analysis** - Compares recent vs older sessions
7. **Confidence Level Analysis** - How confidence correlates with accuracy
8. **Time Distribution Analysis** - Distribution of question completion times
9. **Weekly Performance Trends** - Performance trends over 4 weeks
10. **Question Difficulty Analysis** - Performance by question difficulty (if available)

## Service Layer

### BattleAnalyticsService

Located in `src/lib/battleAnalyticsService.ts`, this service provides:

#### Interfaces
- `BattleAnalytics` - Main analytics data structure
- `WeeklyTrend` - Weekly performance data
- `TimeDistribution` - Time distribution data
- `ConfidenceAnalysis` - Confidence level analysis
- `SessionAnalytics` - Per-session analytics

#### Methods
- `getOverallAnalytics()` - Overall performance metrics
- `getRecentActivity()` - Last 7 days activity
- `getStreakData()` - Current and longest streaks
- `getImprovementTrend()` - Performance improvement percentage
- `getTimeDistribution()` - Time distribution analysis
- `getConfidenceAnalysis()` - Confidence level analysis
- `getWeeklyTrends()` - Weekly performance trends
- `getAllAnalytics()` - Fetches all analytics data

## Frontend Implementation

### Analytics Page

Located at `src/pages/battlefield/Analytics.tsx`, the analytics page provides:

#### Features
- **Loading States** - Shows loading spinner while fetching data
- **Error Handling** - Displays error messages with retry functionality
- **Empty States** - Shows message when no battle data exists
- **Tabbed Interface** - Overview, Patterns, and Streaks views
- **Responsive Design** - Works on mobile and desktop

#### Views

1. **Overview Tab**
   - Total Performance (sessions, questions, avg time, accuracy)
   - Speed Stats (Fast Mode, Normal Speed, Too Slow, Improvement)
   - Streak Tracking (current streak, longest streak, weekly stats)

2. **Patterns Tab**
   - Time Distribution (visual progress bars)
   - Confidence Analysis (Low, Medium, High confidence stats)

3. **Streaks Tab**
   - Weekly Performance Trends (last 4 weeks)

4. **AI-Powered Insights**
   - Performance Patterns (automated recommendations)
   - Next Level Goals (progress tracking for targets)

## Usage

### Accessing Analytics
Navigate to `/battlefield/attack/analytics` to view the analytics dashboard.

### Integration with Battle System
The analytics system automatically collects data when users complete battles in the Attack Mode. Each question answer is logged to the `battle_logs` table with:
- User ID
- Session ID
- Question details
- Selected and correct answers
- Time spent
- Confidence level
- Timestamp

### Data Flow
1. User completes battle questions in `BeastBattle.tsx`
2. Each answer is saved to `battle_logs` table
3. Analytics page fetches data using `BattleAnalyticsService`
4. Data is processed and displayed in the UI

## Performance Considerations

### Database Optimization
- Queries use proper indexing on `user_id` and `created_at`
- Aggregations are performed at the database level
- Pagination is implemented for large datasets

### Frontend Optimization
- Data is fetched once and cached in component state
- Loading states prevent UI blocking
- Error boundaries handle failures gracefully

## Future Enhancements

### Potential Additions
1. **Export Functionality** - Download analytics as CSV/PDF
2. **Advanced Filtering** - Filter by date range, subject, difficulty
3. **Comparative Analytics** - Compare performance with other users
4. **Predictive Insights** - AI-powered performance predictions
5. **Achievement System** - Badges and rewards based on analytics
6. **Study Recommendations** - Personalized study suggestions

### Technical Improvements
1. **Real-time Updates** - WebSocket integration for live analytics
2. **Caching Layer** - Redis caching for frequently accessed data
3. **Data Visualization** - Charts and graphs using libraries like Chart.js
4. **Mobile App** - Native mobile analytics dashboard

## Troubleshooting

### Common Issues

1. **No Data Showing**
   - Check if user has completed any battles
   - Verify `battle_logs` table has data for the user
   - Check browser console for errors

2. **Slow Loading**
   - Verify database indexes are properly set
   - Check network connectivity
   - Monitor database query performance

3. **Incorrect Calculations**
   - Verify data integrity in `battle_logs` table
   - Check for null values in calculations
   - Validate time_spent values are positive

### Debug Mode
Enable debug logging by setting `console.log` statements in the service methods to track data flow and identify issues.

## Security Considerations

- All queries use parameterized statements to prevent SQL injection
- User data is isolated by `user_id` in all queries
- RLS (Row Level Security) policies ensure data privacy
- Authentication is required to access analytics

## API Reference

### BattleAnalyticsService Constructor
```typescript
new BattleAnalyticsService(userId: string)
```

### Main Methods
```typescript
// Get all analytics data
const analytics = await service.getAllAnalytics();

// Get specific analytics
const overall = await service.getOverallAnalytics();
const streaks = await service.getStreakData();
const trends = await service.getWeeklyTrends();
```

### Data Structures
```typescript
interface BattleAnalytics {
  totalSessions: number;
  totalQuestions: number;
  avgTimeSpent: number;
  accuracyPercentage: number;
  beastModePercentage: number;
  slowPercentage: number;
  normalSpeedPercentage: number;
  sessionsLast7Days: number;
  questionsLast7Days: number;
  avgTimeLast7Days: number;
  accuracyLast7Days: number;
  improvementPercentage: number;
  currentStreak: number;
  longestStreak: number;
  weeklyTrends: WeeklyTrend[];
  timeDistribution: TimeDistribution[];
  confidenceAnalysis: ConfidenceAnalysis[];
}
``` 