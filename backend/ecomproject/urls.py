from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter
from django.views.generic import TemplateView

from .views import (
    ProductViewSet,
    CartViewSet,
    OrderViewSet,
    AddressViewSet,
    CatagoryImageViewSet,
    RequestPasswordResetOTP,
    ConfirmPasswordResetOTP,
)

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='products')
router.register(r'Catagoryimage', CatagoryImageViewSet, basename='Catagoryimage')
router.register(r'cartitems', CartViewSet, basename='cartitems')
router.register(r'address', AddressViewSet, basename='address')
router.register(r'order', OrderViewSet, basename='order')

urlpatterns = [
    # API ROUTES
    path('', include(router.urls)),

    # AUTH (Djoser + JWT)
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    path(
        "auth/reset-password-otp/",
        RequestPasswordResetOTP.as_view(),
        name="request-reset-otp",
    ),

    path(
        "auth/reset-password-otp/confirm/",
        ConfirmPasswordResetOTP.as_view(),
        name="confirm-reset-otp",
    ),
    # FRONTEND (KEEP LAST)
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),
]