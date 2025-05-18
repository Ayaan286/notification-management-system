import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'npm:@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { notification_id } = await req.json()

    // Get notification details
    const { data: notification, error: fetchError } = await supabase
      .from('notifications')
      .select('*')
      .eq('id', notification_id)
      .single()

    if (fetchError || !notification) {
      throw new Error('Notification not found')
    }

    // Simulate sending notification
    const success = Math.random() > 0.1 // 90% success rate

    // Update notification status
    const { error: updateError } = await supabase
      .from('notifications')
      .update({
        status: success ? 'sent' : 'failed',
        retries: notification.retries + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', notification_id)

    if (updateError) {
      throw updateError
    }

    return new Response(
      JSON.stringify({ success, message: success ? 'Notification sent' : 'Failed to send notification' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
});