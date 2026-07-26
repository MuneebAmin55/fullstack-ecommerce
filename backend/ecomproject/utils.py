from django.core.mail import send_mail
from django.conf import settings


def send_otp(email, otp):

    send_mail(
        subject="Password Reset OTP",
        message=f"""
Your OTP is:

{otp}

It will expire in 10 minutes.

If you didn't request this, ignore this email.
""",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[email],
    )