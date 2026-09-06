
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
from django.http import Http404
import os


def serve_media(request, path):
    """
    Serve media files in production.
    First checks MEDIA_ROOT, then falls back to static/images/
    since existing product images were originally uploaded there.
    """
    # Check media/ directory first
    media_file = os.path.join(settings.MEDIA_ROOT, path)
    if os.path.exists(media_file):
        return serve(request, path, document_root=settings.MEDIA_ROOT)

    # Fallback to static/images/ for legacy images
    static_images_root = os.path.join(settings.BASE_DIR, "static", "images")
    static_file = os.path.join(static_images_root, path)
    if os.path.exists(static_file):
        return serve(request, path, document_root=static_images_root)

    raise Http404("Image not found")


urlpatterns = [
    path('admin/', admin.site.urls),
   
    path('api/', include('ecomproject.urls'))
    
]

# Always serve media — in DEBUG Django's static() helper works,
# in production we use our custom serve_media view.
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
else:
    urlpatterns.append(re_path(r'^media/(?P<path>.*)$', serve_media))