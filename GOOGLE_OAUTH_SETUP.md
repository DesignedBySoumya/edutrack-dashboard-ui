# Google OAuth Setup for Supabase

To enable Google login in your app, you need to configure Google OAuth in both Google Cloud Console and Supabase.

## 1. Google Cloud Console Setup

### Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API (if not already enabled)

### Create OAuth 2.0 Credentials
1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth 2.0 Client IDs**
3. Choose **Web application**
4. Set the following:
   - **Name**: Your app name (e.g., "EduTrack Dashboard")
   - **Authorized JavaScript origins**:
     - `http://localhost:8083` (for development)
     - `https://your-domain.com` (for production)
   - **Authorized redirect URIs**:
     - `https://your-supabase-project.supabase.co/auth/v1/callback`
5. Click **Create**
6. Copy the **Client ID** and **Client Secret**

## 2. Supabase Configuration

### Enable Google Provider
1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Providers**
3. Find **Google** and click **Enable**
4. Enter your Google OAuth credentials:
   - **Client ID**: Your Google Client ID
   - **Client Secret**: Your Google Client Secret
5. Click **Save**

### Configure Redirect URLs
1. Go to **Authentication** → **Settings**
2. Add your redirect URLs:
   - `http://localhost:8083/` (for development)
   - `https://your-domain.com/` (for production)

## 3. Test Google Login

1. Start your development server: `npm run dev`
2. Go to the login page
3. Click "Login with Google"
4. You should be redirected to Google's OAuth consent screen
5. After authorization, you'll be redirected back to your app

## 4. Troubleshooting

### Common Issues:
- **"Invalid redirect URI"**: Make sure the redirect URI in Google Cloud Console matches your Supabase callback URL
- **"Client ID not found"**: Verify your Client ID and Secret are correct in Supabase
- **"Origin not allowed"**: Add your domain to authorized origins in Google Cloud Console

### Development vs Production:
- Use different OAuth credentials for development and production
- Update redirect URLs when deploying to production
- Consider using environment variables for different environments

## 5. Security Best Practices

- Keep your Client Secret secure
- Use HTTPS in production
- Regularly rotate your OAuth credentials
- Monitor OAuth usage in Google Cloud Console 