
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
    const { userId, bookingId, action } = await req.json()
    
    if (!userId || !bookingId || !action) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }
    
    // Create Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    
    // Get user's Google account and selected calendar
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
    
    // Get selected calendar
    const { data: selectedCalendar, error: calendarError } = await supabase
      .from('user_google_calendars')
      .select('*')
      .eq('user_id', userId)
      .eq('is_selected', true)
      .single()
    
    if (calendarError || !selectedCalendar) {
      return new Response(
        JSON.stringify({ error: 'No selected calendar found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }
    
    // Get booking details
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single()
    
    if (bookingError || !booking) {
      return new Response(
        JSON.stringify({ error: 'Booking not found' }),
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
    
    // Format booking for Google Calendar
    const bookingTime = booking.time.split(':');
    const bookingHour = parseInt(bookingTime[0], 10);
    const bookingMinute = parseInt(bookingTime[1], 10);
    
    // Create start and end time, assuming 1 hour duration
    const startTime = new Date(`${booking.date}T${booking.time}:00`);
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + 1); // Add 1 hour for trip duration
    
    // Format times in ISO 8601 format
    const startTimeISO = startTime.toISOString();
    const endTimeISO = endTime.toISOString();
    
    // Create event details
    const eventDetails = {
      summary: `Fahrt für ${booking.customerName}`,
      description: `Transport von ${booking.pickupAddress} nach ${booking.destinationAddress}\nArt: ${booking.transportType}\nPflegestufe: ${booking.careLevel}\nTel: ${booking.phoneNumber}`,
      start: {
        dateTime: startTimeISO,
        timeZone: 'Europe/Berlin',
      },
      end: {
        dateTime: endTimeISO,
        timeZone: 'Europe/Berlin',
      },
      location: booking.pickupAddress,
    };
    
    let response;
    
    if (action === 'create') {
      // Create new event
      response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${selectedCalendar.calendar_id}/events`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventDetails),
      });
    } else if (action === 'update' && booking.google_event_id) {
      // Update existing event
      response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${selectedCalendar.calendar_id}/events/${booking.google_event_id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventDetails),
      });
    } else if (action === 'delete' && booking.google_event_id) {
      // Delete event
      response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${selectedCalendar.calendar_id}/events/${booking.google_event_id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      // If delete is successful, update the booking to remove google_event_id
      if (response.status === 204) {
        await supabase
          .from('bookings')
          .update({ google_event_id: null })
          .eq('id', bookingId);
          
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid action or missing event ID' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    const data = action === 'delete' ? {} : await response.json();
    
    if (!response.ok) {
      console.error(`Error ${action}ing event:`, data);
      return new Response(
        JSON.stringify({ error: `Failed to ${action} event` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    // For create and update, save the event ID to the booking
    if (action !== 'delete') {
      const { error: updateError } = await supabase
        .from('bookings')
        .update({ google_event_id: data.id })
        .eq('id', bookingId);
      
      if (updateError) {
        console.error('Error updating booking with event ID:', updateError);
      }
    }
    
    return new Response(
      JSON.stringify({ success: true, eventId: action !== 'delete' ? data.id : null }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
    
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
