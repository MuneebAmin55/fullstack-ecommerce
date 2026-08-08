from django.core.mail import send_mail
from django.conf import settings


def send_otp(email, otp):
    from_email = settings.DEFAULT_FROM_EMAIL or "no-reply@localhost"
    recipient = email or ""

    if not recipient:
        raise ValueError("OTP email recipient is required")

    send_mail(
        subject="Password Reset OTP",
        message=f"""
Your OTP is:

{otp}

It will expire in 10 minutes.

If you didn't request this, ignore this email.
""",
        from_email=from_email,
        recipient_list=[recipient],
    )