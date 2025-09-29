import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Contact function called')
    
    const { name, email, phone, topic, message } = await req.json()
    console.log('Request data received:', { name, email, phone, topic, hasMessage: !!message })

    // Validate required fields
    if (!name || !email || !topic || !message) {
      console.log('Validation failed - missing required fields')
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get Resend API key from environment
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    console.log('Resend API key exists:', !!resendApiKey)
    
    if (!resendApiKey) {
      console.error('RESEND_API_KEY not found in environment variables')
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Map topic values to Czech labels
    const topicLabels: { [key: string]: string } = {
      'general': 'Obecný dotaz',
      'catering': 'Cateringové služby',
      'bistro': 'Dotaz k bistrům',
      'delivery': 'Rozvoz jídel',
      'collaboration': 'Spolupráce',
      'feedback': 'Zpětná vazba',
      'event': 'Pořádání akce'
    }

    const topicLabel = topicLabels[topic] || topic

    // Create email content
    const emailSubject = `Nový dotaz z webu: ${topicLabel}`
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #C6A45D; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
    .field { margin-bottom: 15px; }
    .label { font-weight: bold; color: #3A2A1E; }
    .value { margin-top: 5px; }
    .message-box { background: white; padding: 15px; border-left: 4px solid #C6A45D; margin-top: 10px; }
    .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>📧 Nový dotaz z webu Berry Food</h2>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">👤 Jméno:</div>
        <div class="value">${name}</div>
      </div>
      
      <div class="field">
        <div class="label">📧 E-mail:</div>
        <div class="value"><a href="mailto:${email}">${email}</a></div>
      </div>
      
      <div class="field">
        <div class="label">📱 Telefon:</div>
        <div class="value">${phone || 'Neuvedeno'}</div>
      </div>
      
      <div class="field">
        <div class="label">📋 Téma dotazu:</div>
        <div class="value">${topicLabel}</div>
      </div>
      
      <div class="field">
        <div class="label">💬 Zpráva:</div>
        <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
      </div>
    </div>
    
    <div class="footer">
      Odesláno z webu Berry Food<br>
      ${new Date().toLocaleString('cs-CZ')}
    </div>
  </div>
</body>
</html>
    `

    const emailText = `
Nový dotaz z kontaktního formuláře Berry Food:

📧 KONTAKTNÍ ÚDAJE:
• Jméno: ${name}
• E-mail: ${email}
• Telefon: ${phone || 'Neuvedeno'}

📋 TÉMA DOTAZU:
${topicLabel}

💬 ZPRÁVA:
${message}

---
Odesláno z webu Berry Food
Čas odeslání: ${new Date().toLocaleString('cs-CZ')}
    `.trim()

    // Send email using Resend
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Berry Food Web <onboarding@resend.dev>',
        to: ['marek.vimr333@gmail.com'],
        subject: emailSubject,
        html: emailHtml,
        text: emailText,
        reply_to: email, // Allow replying directly to the person who sent the message
      }),
    })

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text()
      console.error('Resend API error:', errorData)
      throw new Error(`Failed to send email: ${emailResponse.status} ${errorData}`)
    }

    const emailResult = await emailResponse.json()
    console.log('Email sent successfully:', emailResult)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email sent successfully',
        emailId: emailResult.id
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error processing contact form:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: 'Failed to process contact form'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})