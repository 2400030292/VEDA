import os
import resend
from app.core.config import settings

resend.api_key = os.getenv("RESEND_API_KEY")

def send_registration_email(to_email: str, name: str, event_title: str, qr_code_base64: str, registration_code: str):
    """
    Sends a registration confirmation email with the QR code.
    Since Resend doesn't support direct base64 image embedding in some clients without proper CID, 
    we can use standard img src="data:image/png;base64,..." which works in many modern clients.
    """
    if not resend.api_key:
        print("RESEND_API_KEY not set, skipping email sending.")
        return False
        
    html_content = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e1e3e4; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #ba0013; color: white; padding: 24px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Registration Confirmed!</h1>
        </div>
        <div style="padding: 24px; background-color: #f8f9fa; color: #191c1d;">
            <p style="font-size: 16px;">Hi {name},</p>
            <p style="font-size: 16px;">You are successfully registered for <strong>{event_title}</strong>.</p>
            <div style="background-color: white; padding: 16px; border-radius: 8px; text-align: center; margin: 24px 0; border: 1px solid #e1e3e4;">
                <p style="margin: 0 0 16px 0; font-size: 14px; color: #5d3f3c; text-transform: uppercase; font-weight: bold;">Your Registration Code</p>
                <p style="font-size: 24px; font-family: monospace; font-weight: bold; margin: 0; color: #ba0013;">{registration_code}</p>
                <div style="margin-top: 24px;">
                    <img src="{qr_code_base64}" alt="QR Code" style="width: 200px; height: 200px;" />
                </div>
                <p style="font-size: 14px; color: #747474; margin-top: 16px;">Show this QR code at the event entrance.</p>
            </div>
        </div>
        <div style="background-color: #e1e3e4; padding: 16px; text-align: center; font-size: 12px; color: #5d3f3c;">
            <p style="margin: 0;">KL IRD - VEDA, IoTRIX, KLRC</p>
        </div>
    </div>
    """

    try:
        r = resend.Emails.send({
            "from": "KL IRD <onboarding@resend.dev>", # Replace with verified domain in production
            "to": to_email,
            "subject": f"Registration Confirmed: {event_title}",
            "html": html_content
        })
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False
