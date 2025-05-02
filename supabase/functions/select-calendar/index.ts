
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
    const { userId, calendarId } = await req.json()
    
    if (!userId || !calendarId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }
    
    // Create Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    
    // First, unselect all calendars for this user
    const { error: unselectError } = await supabase
      .from('user_google_calendars')
      .update({ is_selected: false })
      .eq('user_id', userId)
    
    if (unselectError) {
      console.error('Error unsetting previously selected calendar:', unselectError)
      return new Response(
        JSON.stringify({ error: 'Database error' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }
    
    // Select the specified calendar
    const { error: selectError } = await supabase
      .from('user_google_calendars')
      .update({ is_selected: true })
      .eq('user_id', userId)
      .eq('id', calendarId)
    
    if (selectError) {
      console.error('Error selecting calendar:', selectError)
      return new Response(
        JSON.stringify({ error: 'Database error' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }
    
    // Return success
    return new Response(
      JSON.stringify({ success: true }),
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
