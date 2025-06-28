# Supabase Authentication Setup

This project uses Supabase for authentication. Follow these steps to set up Supabase:

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Create a new project
4. Wait for the project to be set up

## 2. Get Your Project Credentials

1. Go to your project dashboard
2. Navigate to Settings > API
3. Copy your Project URL and anon/public key

## 3. Set Up Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace `your_supabase_project_url` and `your_supabase_anon_key` with your actual Supabase credentials.

## 4. Configure Authentication in Supabase

1. Go to Authentication > Settings in your Supabase dashboard
2. Configure your site URL (e.g., `http://localhost:5173` for development)
3. Add any additional redirect URLs as needed

## 5. Enable Email Authentication

1. Go to Authentication > Providers in your Supabase dashboard
2. Make sure Email provider is enabled
3. Configure email templates if needed

## 6. Test the Setup

1. Start your development server: `npm run dev`
2. Try signing up with a new account
3. Check your Supabase dashboard to see the new user
4. Try logging in with the created account

## Features Implemented

- ✅ User registration with email/password
- ✅ User login with email/password
- ✅ Protected routes
- ✅ Authentication state management
- ✅ Automatic redirects
- ✅ Loading states

## Next Steps

You can extend this setup by:
- Adding social authentication (Google, GitHub, etc.)
- Implementing password reset functionality
- Adding email verification
- Creating user profiles
- Setting up row-level security (RLS) policies 