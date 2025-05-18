import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'npm:@supabase/supabase-js@2.39.0'
import { Twilio } from 'npm:twilio@4.20.0'
import sgMail from 'npm:@sendgrid/mail@8.1.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Configure SendGrid
sgMail.setApiKey(Deno.env.get('SENDGRID_API_KEY'));

// Configure Twilio
const twilioClient = new Twilio(
  Deno.env.get('TWILIO_ACCOUNT_SID'),
  Deno.env.get('TWILIO_AUTH_TOKEN')
);

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

    let success = false;
    let error = null;

    try {
      switch (notification.type) {
        case 'email':
          await sgMail.send({
            to: notification.recipient,
            from: Deno.env.get('SENDGRID_FROM_EMAIL'),
            subject: notification.subject,
            text: notification.message,
            html: notification.message.replace(/\n/g, '<br>'),
          });
          success = true;
          break;

        case 'sms':
          await twilioClient.messages.create({
            body: notification.message,
            to: notification.recipient,
            from: Deno.env.get('TWILIO_PHONE_NUMBER'),
          });
          success = true;
          break;

        case 'in-app':
          // In-app notifications are handled differently
          success = true;
          break;
      }
    } catch (e) {
      error = e;
      console.error('Notification error:', e);
      success = false;
    }

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
      JSON.stringify({ 
        success, 
        message: success ? 'Notification sent' : 'Failed to send notification',
        error: error?.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: success ? 200 : 400,
      }
    )
  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
});