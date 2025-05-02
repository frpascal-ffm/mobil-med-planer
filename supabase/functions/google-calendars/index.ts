
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SUPABASE_URL = 'https://gczkuolrxmwfwhcgllva.supabase.co'
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  try {
    // Parse request
    const { userId } = await req.json()
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Missing user ID' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }
    
    // Create Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    
    // Get user's Google account
    const { data: googleAccount, error: accountError } = await supabase
      .from('user_google_accounts')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (accountError || !googleAccount) {
      return new Response(
        JSON.stringify({ error: 'Google account not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }
    
    // Check if token is expired and refresh if needed
    const now = new Date()
    const expiresAt = new Date(googleAccount.expires_at)
    
    let accessToken = googleAccount.access_token
    
    if (now >= expiresAt) {
      // Refresh the token
      const refreshResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: Deno.env.get('GOOGLE_CLIENT_ID') || '',
          client_secret: Deno.env.get('GOOGLE_CLIENT_SECRET') || '',
          refresh_token: googleAccount.refresh_token,
          grant_type: 'refresh_token',
        }),
      })
      
      const refreshData = await refreshResponse.json()
      
      if (!refreshResponse.ok) {
        console.error('Error refreshing token:', refreshData)
        return new Response(
          JSON.stringify({ error: 'Failed to refresh token' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }
      
      // Update token in database
      const newExpiresAt = new Date(Date.now() + refreshData.expires_in * 1000).toISOString()
      
      const { error: updateError } = await supabase
        .from('user_google_accounts')
        .update({
          access_token: refreshData.access_token,
          expires_at: newExpiresAt,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
      
      if (updateError) {
        console.error('Error updating token:', updateError)
        return new Response(
          JSON.stringify({ error: 'Database error' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }
      
      accessToken = refreshData.access_token
    }
    
    // Fetch user's calendar list
    const calendarResponse = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    
    const calendarData = await calendarResponse.json()
    
    if (!calendarResponse.ok) {
      console.error('Error fetching calendars:', calendarData)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch calendars' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }
    
    // Save calendars to database
    if (calendarData.items && calendarData.items.length > 0) {
      const calendarsToUpsert = calendarData.items.map(cal => ({
        user_id: userId,
        calendar_id: cal.id,
        calendar_name: cal.summary,
        is_primary: cal.primary === true,
        is_selected: false,
      }))
      
      // Insert all calendars
      const { error: calendarInsertError } = await supabase
        .from('user_google_calendars')
        .upsert(calendarsToUpsert, { onConflict: 'user_id, calendar_id' })
      
      if (calendarInsertError) {
        console.error('Error saving calendars:', calendarInsertError)
        return new Response(
          JSON.stringify({ error: 'Database error' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }
      
      // Set primary calendar to selected by default if no calendar is selected
      const { data: selectedCalendars } = await supabase
        .from('user_google_calendars')
        .select('*')
        .eq('user_id', userId)
        .eq('is_selected', true)
      
      if (!selectedCalendars || selectedCalendars.length === 0) {
        // No selected calendar, set primary as selected
        await supabase
          .from('user_google_calendars')
          .update({ is_selected: true })
          .eq('user_id', userId)
          .eq('is_primary', true)
      }
    }
    
    // Return all calendars
    const { data: userCalendars, error: fetchError } = await supabase
      .from('user_google_calendars')
      .select('*')
      .eq('user_id', userId)
      .order('is_primary', { ascending: false })
      .order('calendar_name', { ascending: true })
    
    if (fetchError) {
      console.error('Error fetching user calendars:', fetchError)
      return new Response(
        JSON.stringify({ error: 'Database error' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }
    
    return new Response(
      JSON.stringify({ calendars: userCalendars }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
    
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
