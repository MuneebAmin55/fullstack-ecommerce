from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv
import os
import dj_database_url

BASE_DIR = Path(__file__).resolve().parent.parent

load_dotenv()


def env_list(name, default=""):
    values = [
        item.strip().rstrip("/")
        for item in os.getenv(name, default).split(",")
        if item.strip()
    ]
    return list(dict.fromkeys(values))

# --------------------------------------------------
# Security
# --------------------------------------------------

SECRET_KEY = os.getenv("DJANGO_SECRET_KEY")

DEBUG = os.getenv("DEBUG", "False").lower() == "true"

if not SECRET_KEY:
    if DEBUG:
        SECRET_KEY = "django-insecure-local-development-only"
    else:
        raise RuntimeError("DJANGO_SECRET_KEY must be set when DEBUG is False")

ALLOWED_HOSTS = env_list(
    "ALLOWED_HOSTS",
    ".vercel.app,localhost,127.0.0.1",
)

RENDER_EXTERNAL_HOSTNAME = os.getenv("RENDER_EXTERNAL_HOSTNAME")

if RENDER_EXTERNAL_HOSTNAME:
    ALLOWED_HOSTS.append(RENDER_EXTERNAL_HOSTNAME)


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
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]


ROOT_URLCONF = "backend.urls"


# --------------------------------------------------
# Database
# --------------------------------------------------

DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL:
    DATABASES = {
        "default": dj_database_url.parse(
            DATABASE_URL,
            conn_max_age=600,
            ssl_require=True,
        )
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': os.environ.get('DB_ENGINE', 'django.db.backends.postgresql'),
            'NAME': os.environ.get('DB_NAME', 'neondb'),
            'USER': os.environ.get('DB_USER', 'neondb_owner'),
            'PASSWORD': os.environ.get('DB_PASSWORD', ''),
            'HOST': os.environ.get('DB_HOST', ''),
            'PORT': os.environ.get('DB_PORT', '5432'),
            'OPTIONS': {
                'sslmode': 'require',
            },
        }
    }


# --------------------------------------------------
# CORS - FIXED
# --------------------------------------------------

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173").rstrip("/")
DEFAULT_FRONTEND_ORIGINS = ",".join([
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://fullstack-ecommerce-seven-lovat.vercel.app",
    "https://fullstack-ecommerce-9e4piuqrr-muneeb-b631.vercel.app",
    FRONTEND_URL,
])

CORS_ALLOWED_ORIGINS = env_list(
    "CORS_ALLOWED_ORIGINS",
    DEFAULT_FRONTEND_ORIGINS,
)

CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^https:\/\/.*\.vercel\.app$",
    r"^https:\/\/.*\.onrender\.com$",
    r"^http:\/\/localhost:\d+$",
    r"^http:\/\/127\.0\.0\.1:\d+$",
]

CORS_ALLOW_CREDENTIALS = True

# Optional: Allow all origins during development only
# if DEBUG:
#     CORS_ALLOW_ALL_ORIGINS = True


# --------------------------------------------------
# CSRF - FIXED
# --------------------------------------------------

CSRF_TRUSTED_ORIGINS = env_list(
    "CSRF_TRUSTED_ORIGINS",
    DEFAULT_FRONTEND_ORIGINS,
)

for _trusted in [
    "https://*.vercel.app",
    "https://*.onrender.com",
    "https://fullstack-ecommerce-seven-lovat.vercel.app",
    "https://fullstack-ecommerce-9e4piuqrr-muneeb-b631.vercel.app",
]:
    if _trusted not in CSRF_TRUSTED_ORIGINS:
        CSRF_TRUSTED_ORIGINS.append(_trusted)

if RENDER_EXTERNAL_HOSTNAME:
    CSRF_TRUSTED_ORIGINS.append(f"https://{RENDER_EXTERNAL_HOSTNAME}")

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
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_DIRS = [
    BASE_DIR / "static",
]

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SESSION_COOKIE_SECURE = not DEBUG
CSRF_COOKIE_SECURE = not DEBUG
SECURE_SSL_REDIRECT = os.getenv(
    "SECURE_SSL_REDIRECT",
    "True" if RENDER_EXTERNAL_HOSTNAME else "False",
).lower() == "true"
SECURE_HSTS_SECONDS = int(os.getenv("SECURE_HSTS_SECONDS", "0"))


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
STRIPE_CURRENCY = os.getenv("STRIPE_CURRENCY", "pkr").lower()
STRIPE_AMOUNT_MULTIPLIER = int(os.getenv("STRIPE_AMOUNT_MULTIPLIER", "100"))
SHIPPING_PRICE = os.getenv("SHIPPING_PRICE", "150.00")

# --------------------------------------------------
# Default Primary Key Field
# --------------------------------------------------

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
