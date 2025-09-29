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
    console.log('Order catering function called')
    
    const { name, email, phone, date, headcount, notes } = await req.json()
    console.log('Request data received:', { name, email, phone, date, headcount, hasNotes: !!notes })

    // Validate required fields
    if (!name || !email || !date || !headcount) {
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

    // Create email content
    const emailSubject = `Nová poptávka cateringu od ${name}`
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
    .notes-box { background: white; padding: 15px; border-left: 4px solid #C6A45D; margin-top: 10px; }
    .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>🍽️ Nová poptávka cateringu - Berry Food</h2>
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
        <div class="label">📅 Datum akce:</div>
        <div class="value">${new Date(date).toLocaleDateString('cs-CZ')}</div>
      </div>
      
      <div class="field">
        <div class="label">👥 Počet osob:</div>
        <div class="value">${headcount}</div>
      </div>
      
      ${notes ? `
      <div class="field">
        <div class="label">📝 Poznámky:</div>
        <div class="notes-box">${notes.replace(/\n/g, '<br>')}</div>
      </div>
      ` : ''}
    </div>
    
    <div class="footer">
      Poptávka odeslána z webu Berry Food<br>
      ${new Date().toLocaleString('cs-CZ')}
    </div>
  </div>
</body>
</html>
    `

    const emailText = `
Nová poptávka cateringu z webu Berry Food:

📧 KONTAKTNÍ ÚDAJE:
• Jméno: ${name}
• E-mail: ${email}
• Telefon: ${phone || 'Neuvedeno'}

🍽️ DETAILY AKCE:
• Datum akce: ${new Date(date).toLocaleDateString('cs-CZ')}
• Počet osob: ${headcount}

${notes ? `📝 POZNÁMKY:\n${notes}` : ''}

---
Poptávka odeslána z webu Berry Food
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
        reply_to: email, // Allow replying directly to the person who sent the request
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
        message: 'Catering order sent successfully',
        emailId: emailResult.id
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error processing catering order:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: 'Failed to process catering order'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})