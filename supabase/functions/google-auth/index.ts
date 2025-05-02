
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SUPABASE_URL = 'https://gczkuolrxmwfwhcgllva.supabase.co'
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
const GOOGLE_CLIENT_ID = Deno.env.get('GOOGLE_CLIENT_ID') || ''
const GOOGLE_CLIENT_SECRET = Deno.env.get('GOOGLE_CLIENT_SECRET') || ''
const APP_URL = Deno.env.get('APP_URL') || 'http://localhost:5173'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const path = url.pathname.split('/').pop()
    
    // Create Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    
    // Handle redirect from Google
    if (path === 'callback') {
      const code = url.searchParams.get('code')
      const state = url.searchParams.get('state')
      
      if (!code || !state) {
        return Response.redirect(`${APP_URL}/admin/settings?error=missing_code_or_state`)
      }
      
      // Exchange code for tokens
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code,
          client_id: GOOGLE_CLIENT_ID,
          client_secret: GOOGLE_CLIENT_SECRET,
          redirect_uri: `${SUPABASE_URL}/functions/v1/google-auth/callback`,
          grant_type: 'authorization_code',
        }),
      })
      
      const tokenData = await tokenResponse.json()
      
      if (!tokenResponse.ok) {
        console.error('Error getting tokens:', tokenData)
        return Response.redirect(`${APP_URL}/admin/settings?error=token_exchange`)
      }
      
      const { access_token, refresh_token, expires_in } = tokenData
      
      // Get user info from state (contains the user's UUID)
      const userId = state
      
      // Calculate expiry time
      const expiresAt = new Date(Date.now() + expires_in * 1000).toISOString()
      
      // Save tokens in database
      const { error } = await supabase
        .from('user_google_accounts')
        .upsert({
          user_id: userId,
          access_token,
          refresh_token,
          expires_at: expiresAt,
          updated_at: new Date().toISOString(),
        })
      
      if (error) {
        console.error('Error saving tokens:', error)
        return Response.redirect(`${APP_URL}/admin/settings?error=database_error`)
      }
      
      // Redirect back to app
      return Response.redirect(`${APP_URL}/admin/settings?connected=true`)
    }
    
    // Handle initial auth request
    if (path === 'authorize') {
      const { userId } = await req.json()
      
      if (!userId) {
        return new Response(
          JSON.stringify({ error: 'Missing user ID' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }
      
      // Build Google OAuth URL
      const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
      authUrl.searchParams.append('client_id', GOOGLE_CLIENT_ID)
      authUrl.searchParams.append('redirect_uri', `${SUPABASE_URL}/functions/v1/google-auth/callback`)
      authUrl.searchParams.append('response_type', 'code')
      authUrl.searchParams.append('scope', 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events')
      authUrl.searchParams.append('access_type', 'offline')
      authUrl.searchParams.append('prompt', 'consent')
      authUrl.searchParams.append('state', userId)
      
      // Return the auth URL to the client
      return new Response(
        JSON.stringify({ url: authUrl.toString() }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }
    
    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
    )
    
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
