# app/routes/contact_us.py

from flask import Blueprint, request, jsonify
from flask_mail import Message
from app.extensions import mail

contact_bp = Blueprint('contact', __name__, url_prefix='/api')

@contact_bp.route('/contact', methods=['POST'])
def send_contact_message():
    try:
        data = request.get_json()
        
        # Validation
        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        message = data.get('message', '').strip()
        
        if not name or not email or not message:
            return jsonify({
                'success': False,
                'message': 'All fields are required'
            }), 400
        
        # Validate email format (basic)
        if '@' not in email or '.' not in email:
            return jsonify({
                'success': False,
                'message': 'Invalid email address'
            }), 400
        
        # Email to HireHub team
        msg = Message(
            subject=f'HireHub Contact Form: Message from {name}',
            sender=('HireHub', 'h1r3hub@gmail.com'),
            recipients=['h1r3hub@gmail.com'],
            reply_to=email
        )
        
        msg.html = f'''
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9;">
            <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h2 style="color: #562fac; margin-bottom: 20px;">📧 New Contact Form Submission</h2>
                
                <div style="margin: 20px 0; padding: 15px; background: #f0f4ff; border-radius: 8px;">
                    <p style="margin: 10px 0;"><strong>👤 Name:</strong> {name}</p>
                    <p style="margin: 10px 0;"><strong>📧 Email:</strong> <a href="mailto:{email}" style="color: #562fac;">{email}</a></p>
                </div>
                
                <div style="margin: 20px 0;">
                    <p style="margin-bottom: 10px;"><strong>💬 Message:</strong></p>
                    <div style="padding: 15px; background: #f9fbff; border-left: 4px solid #562fac; border-radius: 4px; white-space: pre-wrap;">
{message}
                    </div>
                </div>
                
                <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                
                <p style="color: #666; font-size: 12px; margin: 10px 0;">
                    This message was sent from the HireHub contact form.<br>
                    Reply directly to this email to respond to {name}.
                </p>
            </div>
        </div>
        '''
        
        mail.send(msg)
        
        # Auto-reply to user
        auto_reply = Message(
            subject='Thank you for contacting HireHub! 🎉',
            sender=('HireHub', 'h1r3hub@gmail.com'),
            recipients=[email]
        )
        
        message_preview = message[:150] + '...' if len(message) > 150 else message
        
        auto_reply.html = f'''
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9;">
            <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h2 style="color: #562fac; margin-bottom: 20px;">Thank you for reaching out! 👋</h2>
                
                <p style="font-size: 16px; line-height: 1.6;">Hi <strong>{name}</strong>,</p>
                
                <p style="font-size: 16px; line-height: 1.6;">
                    We've received your message and our team will get back to you within <strong>24 hours</strong>.
                </p>
                
                <div style="margin: 25px 0; padding: 20px; background: #f0f4ff; border-radius: 8px; border-left: 4px solid #86bbf0;">
                    <p style="margin: 5px 0; font-size: 14px; color: #666;"><strong>Your message:</strong></p>
                    <p style="margin: 10px 0; color: #333; font-style: italic;">"{message_preview}"</p>
                </div>
                
                <p style="font-size: 16px; line-height: 1.6;">
                    In the meantime, feel free to explore our platform and discover exciting opportunities!
                </p>
                
                <div style="margin: 30px 0; text-align: center;">
                    <a href="http://localhost:5173" 
                       style="display: inline-block; padding: 14px 28px; background: linear-gradient(to right, #86bbf0, #562fac); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                        🚀 Visit HireHub
                    </a>
                </div>
                
                <hr style="border: none; border-top: 1px solid #ddd; margin: 25px 0;">
                
                <div style="text-align: center;">
                    <p style="color: #666; font-size: 14px; margin: 5px 0;">
                        <strong>Best regards,</strong><br>
                        The HireHub Team
                    </p>
                    <p style="color: #999; font-size: 12px; margin: 10px 0;">
                        📍 Farmingdale State College, NY<br>
                        📧 h1r3hub@gmail.com<br>
                        📞 (555) 321-9876
                    </p>
                </div>
            </div>
        </div>
        '''
        
        mail.send(auto_reply)
        
        return jsonify({
            'success': True,
            'message': 'Message sent successfully!'
        }), 200
        
    except Exception as e:
        print(f"❌ Error sending email: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to send message. Please try again later.'
        }), 500