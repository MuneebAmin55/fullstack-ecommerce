from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv
import os

BASE_DIR = Path(__file__).resolve().parent.parent

load_dotenv()

# --------------------------------------------------
# Security
# --------------------------------------------------

SECRET_KEY = os.getenv("DJANGO_SECRET_KEY")

DEBUG = os.getenv("DEBUG", "False") == "True"

ALLOWED_HOSTS = [
    ".vercel.app",
    "localhost",
    "127.0.0.1",
]


# --------------------------------------------------
# Applications
# --------------------------------------------------

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    "djoser",
    "rest_framework",
    "corsheaders",
    "django_filters",

    "ecomproject",
]


# --------------------------------------------------
# Middleware
# --------------------------------------------------

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
]


ROOT_URLCONF = "backend.urls"


# --------------------------------------------------
# Database
# --------------------------------------------------

DATABASES = {
    'default': {
        'ENGINE': os.environ.get('DB_ENGINE', 'django.db.backends.postgresql'),
        'NAME': os.environ.get('DB_NAME', 'neondb'),
        'USER': os.environ.get('DB_USER', 'neondb_owner'),
        'PASSWORD': os.environ.get('DB_PASSWORD', ''),
        'HOST': os.environ.get('DB_HOST', ''),
        'PORT': os.environ.get('DB_PORT', '5432'),
        'OPTIONS': {
            'sslmode': 'require',  # Required for Neon
        },
    }
}


# --------------------------------------------------
# CORS - FIXED
# --------------------------------------------------

# Get frontend URL from environment with fallback
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

# Build CORS allowed origins list
CORS_ALLOWED_ORIGINS = [
    "https://fullstack-ecommerce-topaz.vercel.app",
    FRONTEND_URL,
]

# Remove any empty strings from the list
CORS_ALLOWED_ORIGINS = [origin for origin in CORS_ALLOWED_ORIGINS if origin]

CORS_ALLOW_CREDENTIALS = True

# Optional: Allow all origins during development only
# if DEBUG:
#     CORS_ALLOW_ALL_ORIGINS = True


# --------------------------------------------------
# CSRF - FIXED
# --------------------------------------------------

# Build CSRF trusted origins list
CSRF_TRUSTED_ORIGINS = [
    "https://fullstack-ecommerce-topaz.vercel.app",
    FRONTEND_URL,
]

# Remove any empty strings from the list
CSRF_TRUSTED_ORIGINS = [origin for origin in CSRF_TRUSTED_ORIGINS if origin]

CSRF_COOKIE_HTTPONLY = False  # Allow JavaScript to read CSRF token
CSRF_COOKIE_SAMESITE = 'Lax'  # Good for security


# --------------------------------------------------
# Django Templates
# --------------------------------------------------

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]


# --------------------------------------------------
# Static / Media
# --------------------------------------------------

STATIC_URL = "/static/"

MEDIA_URL = "/images/"
MEDIA_ROOT = BASE_DIR / "static/images"


# --------------------------------------------------
# Djoser
# --------------------------------------------------

DJOSER = {
    "LOGIN_FIELD": "username",

    "USER_CREATE_PASSWORD_RETYPE": True,

    "SEND_ACTIVATION_EMAIL": False,

    "PASSWORD_RESET_CONFIRM_URL": "reset-password/{uid}/{token}",

    "SERIALIZERS": {
        "user_create": "ecomproject.serializer.UserRegisterSerializer",
        "user": "djoser.serializers.UserSerializer",
        "current_user": "djoser.serializers.UserSerializer",
    },

    "DOMAIN": os.getenv(
        "FRONTEND_DOMAIN",
        "localhost:5173"
    ),

    "SITE_NAME": "E-Commerce",

    "PROTOCOL": os.getenv(
        "PROTOCOL",
        "http"
    ),
}


# --------------------------------------------------
# Email
# --------------------------------------------------

EMAIL_HOST = os.getenv("EMAIL_HOST", "")

EMAIL_PORT = int(
    os.getenv("EMAIL_PORT", "587")
)

EMAIL_HOST_USER = os.getenv(
    "EMAIL_HOST_USER",
    ""
)

EMAIL_HOST_PASSWORD = os.getenv(
    "EMAIL_HOST_PASSWORD",
    ""
)

EMAIL_USE_TLS = os.getenv(
    "EMAIL_USE_TLS",
    "True"
) == "True"

EMAIL_BACKEND = (
    "django.core.mail.backends.smtp.EmailBackend"
    if EMAIL_HOST
    else "django.core.mail.backends.console.EmailBackend"
)

DEFAULT_FROM_EMAIL = os.getenv(
    "DEFAULT_FROM_EMAIL",
    EMAIL_HOST_USER or "no-reply@example.com"
)


# --------------------------------------------------
# Django REST Framework
# --------------------------------------------------

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),

    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.AllowAny",
    ),

    "DEFAULT_RENDERER_CLASSES": (
        "rest_framework.renderers.JSONRenderer",
    ),
}


# --------------------------------------------------
# JWT
# --------------------------------------------------

SIMPLE_JWT = {
    "AUTH_HEADER_TYPES": ("Bearer",),

    "ACCESS_TOKEN_LIFETIME": timedelta(
        minutes=30
    ),

    "REFRESH_TOKEN_LIFETIME": timedelta(
        days=7
    ),
}


# --------------------------------------------------
# Stripe
# --------------------------------------------------

STRIPE_SECRET_KEY = os.getenv(
    "STRIPE_SECRET_KEY"
)

# --------------------------------------------------
# Default Primary Key Field
# --------------------------------------------------

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'