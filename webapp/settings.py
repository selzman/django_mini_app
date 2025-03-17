"""
Django settings for webapp project.

Generated by 'django-admin startproject' using Django 5.0.7.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.0/ref/settings/
"""
import os
from datetime import timedelta
from pathlib import Path
from .key import key

import os
import logging

from django.core.checks import Warning

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-insecure-1rxkgy5-1u-sv90n26*qt3zh$8$p+2u5_jifd(f*)b1dl7latm'

DEBUG = True

ALLOWED_HOSTS = ['*']

# Application definition
# CORS_ORIGIN_WHITELIST = ["http://localhost:8000", ]
# CSRF_COOKIE_DOMAIN =
# CSRF_COOKIE_DOMAIN = None
# CSRF_TRUSTED_ORIGINS = [
#    'http://localhost:8000',
#
# ]
# CSRF_COOKIE_SECURE = False
# CSRF_COOKIE_HTTPONLY = True


# RATELIMIT_IP_META_KEY = 'HTTP_X_FORWARDED_FOR'
# RATELIMIT_IP_META_KEY = lambda r: r.META.get('HTTP_X_FORWARDED_FOR', '').split(',')[0].strip()




#SECURE_SSL_REDIRECT = True  # تمام درخواست‌ها را به HTTPS ریدایرکت می‌کند
# SECURE_HSTS_SECONDS = 31536000  # استفاده از HSTS برای اطمینان از HTTPS برای مدت مشخص
SECURE_HSTS_INCLUDE_SUBDOMAINS = True  # اعمال HSTS روی زیردامنه‌ها
SECURE_HSTS_PRELOAD = True  # اضافه کردن دامنه شما به لیست preload مرورگرها
SECURE_BROWSER_XSS_FILTER = True  # فعال‌سازی فیلتر XSS در مرورگرها
X_FRAME_OPTIONS = 'DENY'  # جلوگیری از نمایش سایت شما در iframes (حفاظت در برابر Clickjacking)
SECURE_CONTENT_TYPE_NOSNIFF = True  # جلوگیری از حملات MIME-sniffing
CSRF_COOKIE_SECURE = True  # تنظیم کوکی‌های CSRF برای ارسال فقط از طریق HTTPS
SECURE_REDIRECT_EXEMPT = []  # هیچ مسیری از ریدایرکت امن معاف نیست
SESSION_COOKIE_SECURE = True
SESSION_SAVE_EVERY_REQUEST = True # Keep the session alive as long as the user is active
SESSION_COOKIE_HTTPONLY = True  # Django sets this to True by default, but it's good to be explicit
SESSION_EXPIRE_AT_BROWSER_CLOSE = False
SESSION_COOKIE_AGE = 1800  # 30 minutes (in seconds)
# CSRF_COOKIE_HTTPONLY = True # دسترسی به کوکی‌های CSRF فقط از طریق سرور (نه جاوااسکریپت)

CSRF_COOKIE_DOMAIN = "localhost:8000"
SESSION_COOKIE_DOMAIN = "localhost:8000"











SILENCED_SYSTEM_CHECKS = ['django_ratelimit.W001']

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.redis.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/1',
    }
}

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django_ratelimit',
    "Home_Module.apps.HomeModuleConfig",
    'django.contrib.humanize',

]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django_ratelimit.middleware.RatelimitMiddleware',
    # 'Home_Module.Middleware.RedirectNonMobileMiddleware',
]

ROOT_URLCONF = 'webapp.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates']
        ,
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'webapp.wsgi.application'

# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases


# settings.py


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / "db.sqlite3",
    }
}

# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Asia/Tehran'
# TIME_ZONE = 'Europe/Berlin'
USE_I18N = True
USE_L10N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATIC_URL = '/static/'
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static'),
]

STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

MEDIA_ROOT = BASE_DIR / 'uploads'
MEDIA_URL = '/medias/'

STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# settings.py
CELERY_BROKER_URL = 'redis://localhost:6379/0'
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'

# Define the base directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'file': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': os.path.join(BASE_DIR, 'errors.log'),
            'formatter': 'verbose',
        },
        'console': {
            'level': 'ERROR',
            'class': 'logging.StreamHandler',
            'formatter': 'simple',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file', 'console'],
            'level': 'ERROR',
            'propagate': True,
        },
    },
}
