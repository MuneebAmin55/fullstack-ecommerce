from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.views.generic import TemplateView



from .views import (
    RequestPasswordResetView,
    ResetPasswordView,
    ProductViewSet,
    RegisterView,
    CartViewSet,
    OrderViewSet,
    AddressViewSet,
    CatagoryImageViewSet,
    MeView
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

    # AUTH
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view()),
    path('me/', MeView.as_view(), name='me'),
    
    path("request-reset/", RequestPasswordResetView.as_view()),
    path("reset-password/", ResetPasswordView.as_view()),



    # FRONTEND (KEEP LAST)
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),
]