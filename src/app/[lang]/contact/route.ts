// src/app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validation - Check required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { message: 'Please fill in all required fields' },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Name length validation
    if (name.length < 2 || name.length > 100) {
      return NextResponse.json(
        { message: 'Name must be between 2 and 100 characters' },
        { status: 400 }
      );
    }

    // Message length validation
    if (message.length < 10 || message.length > 5000) {
      return NextResponse.json(
        { message: 'Message must be between 10 and 5000 characters' },
        { status: 400 }
      );
    }

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return NextResponse.json(
        { message: 'Email service is not configured. Please contact support.' },
        { status: 500 }
      );
    }

    // Initialize Resend
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    // Send email using your verified domain
    const { data, error } = await resend.emails.send({
      from: `MoroCompase Contact <info@morocompase.com>`,
      to: ['info@morocompase.com'],
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Form Submission</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 0;
              background-color: #f5f5f5;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #D4AF37 0%, #B8960F 100%);
              padding: 30px 20px;
              text-align: center;
              border-radius: 12px 12px 0 0;
            }
            .header h1 {
              margin: 0;
              color: #1a1a1a;
              font-size: 28px;
              font-weight: 700;
            }
            .header p {
              margin: 10px 0 0;
              color: #1a1a1a;
              opacity: 0.9;
            }
            .content {
              background: white;
              padding: 30px;
              border-radius: 0 0 12px 12px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .field {
              margin-bottom: 25px;
              padding-bottom: 20px;
              border-bottom: 1px solid #eee;
            }
            .field-label {
              font-weight: 700;
              color: #D4AF37;
              text-transform: uppercase;
              font-size: 12px;
              letter-spacing: 1px;
              margin-bottom: 8px;
            }
            .field-value {
              font-size: 16px;
              color: #333;
              line-height: 1.5;
            }
            .message-box {
              background: #f9f9f9;
              padding: 20px;
              border-radius: 8px;
              margin-top: 10px;
              border-left: 4px solid #D4AF37;
            }
            .footer {
              text-align: center;
              padding: 20px;
              font-size: 12px;
              color: #999;
              background: #f5f5f5;
              border-radius: 0 0 12px 12px;
            }
            .badge {
              display: inline-block;
              background: #D4AF37;
              color: #1a1a1a;
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 600;
            }
            @media only screen and (max-width: 600px) {
              .container {
                padding: 10px;
              }
              .content {
                padding: 20px;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>MoroCompase</h1>
              <p>New Contact Form Submission</p>
            </div>
            <div class="content">
              <div class="field">
                <div class="field-label">📋 Sender Information</div>
                <div class="field-value">
                  <strong>Name:</strong> ${escapeHtml(name)}<br>
                  <strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>
                </div>
              </div>
              
              <div class="field">
                <div class="field-label">🏷️ Subject</div>
                <div class="field-value">
                  <span class="badge">${escapeHtml(subject)}</span>
                </div>
              </div>
              
              <div class="field">
                <div class="field-label">💬 Message</div>
                <div class="message-box">
                  ${escapeHtml(message).replace(/\n/g, '<br>')}
                </div>
              </div>
            </div>
            <div class="footer">
              <p>This message was sent from the MoroCompase contact form.</p>
              <p>Reply directly to this email to respond to <strong>${escapeHtml(name)}</strong> at <strong>${escapeHtml(email)}</strong></p>
              <p style="margin-top: 15px;">&copy; ${new Date().getFullYear()} MoroCompase. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        MoroCompase Contact Form Submission
        ===================================
        
        Name: ${name}
        Email: ${email}
        Subject: ${subject}
        
        Message:
        ${message}
        
        ---
        Reply directly to this email to respond to ${name} at ${email}
        
        This message was sent from the MoroCompase contact form.
        © ${new Date().getFullYear()} MoroCompase. All rights reserved.
      `,
    });
    
    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { message: 'Failed to send email. Please try again later.' },
        { status: 500 }
      );
    }
    
    console.log('Email sent successfully:', { id: data?.id, to: 'info@morocompase.com', from: email });
    
    return NextResponse.json(
      { message: 'Message sent successfully!', id: data?.id },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { message: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}

// Helper function to escape HTML characters (security)
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}