
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.shortcuts import redirect
def password_reset_redirect(request, uid, token):
    return redirect(f"http://localhost:5173/reset-password/{uid}/{token}")

urlpatterns = [
    path('admin/', admin.site.urls),
     path(
        "reset-password/<uid>/<token>/",
        password_reset_redirect,
        name="password_reset_redirect",
    ),
    path('api/', include('ecomproject.urls'))
    
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)