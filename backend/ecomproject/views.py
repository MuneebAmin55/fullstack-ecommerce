# views.py
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework import viewsets
from .models import Products,CartItems,Order,OrderItems,UserAddres,CatagoryImage
from .serializer import ProductsSerializer,UserRegisterSerializer,CartItemsSerializer,OrderSerializer,OrderItemsSerializer,UserAddresSeriliazer,CatagoryImageSerializer,RequestOTPSerializer,ConfirmOTPSerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser,IsAuthenticatedOrReadOnly,AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.contrib.auth.models import User

from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from datetime import timedelta

from django.db import transaction
from django.utils import timezone
from django.contrib.auth import get_user_model

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import PasswordResetOTP

from .utils import send_otp

User = get_user_model()


class RequestPasswordResetOTP(APIView):

    def post(self, request):

        serializer = RequestOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({
                "detail": "If this email exists, an OTP has been sent."
            })

        latest = PasswordResetOTP.objects.filter(user=user).first()

        if latest:

            diff = timezone.now() - latest.created_at

            if diff < timedelta(seconds=60):
                return Response(
                    {
                        "detail": "Please wait before requesting another OTP."
                    },
                    status=status.HTTP_429_TOO_MANY_REQUESTS
                )

        otp_obj, otp = PasswordResetOTP.create_otp(user)

        send_otp(user.email, otp)

        return Response({
            "detail": "If this email exists, an OTP has been sent."
        })


class ConfirmPasswordResetOTP(APIView):

    @transaction.atomic
    def post(self, request):

        serializer = ConfirmOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        otp = serializer.validated_data["otp"]
        new_password = serializer.validated_data["new_password"]

        try:
            user = User.objects.get(email=email)

            otp_obj = PasswordResetOTP.objects.filter(
                user=user,
                is_used=False
            ).latest("created_at")

        except (User.DoesNotExist, PasswordResetOTP.DoesNotExist):

            return Response(
                {
                    "detail": "Invalid OTP."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if otp_obj.expired():

            otp_obj.delete()

            return Response(
                {
                    "detail": "OTP expired."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if otp_obj.attempts >= 5:

            otp_obj.delete()

            return Response(
                {
                    "detail": "Too many attempts."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if not otp_obj.verify(otp):

            otp_obj.attempts += 1
            otp_obj.save()

            return Response(
                {
                    "detail": "Invalid OTP."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(new_password)
        user.save()

        PasswordResetOTP.objects.filter(user=user).delete()

        return Response(
            {
                "detail": "Password changed successfully."
            },
            status=status.HTTP_200_OK
        )
class ProductViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Products.objects.all()
    serializer_class = ProductsSerializer

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter
    ]

    filterset_fields = ['productcategory']

    # text search
    search_fields = ['productname']

    # ordering
    ordering_fields = ['created_at','price']


class CatagoryImageViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = CatagoryImage.objects.all()
    serializer_class = CatagoryImageSerializer

class CartViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = CartItemsSerializer
    
    def get_queryset(self):
        return CartItems.objects.filter(user=self.request.user)

    def create(self,request,*args, **kwargs):
        product_id = ( request.data.get("product_id") )
        
        cart_item, created = CartItems.objects.get_or_create(
            user=request.user,
            product_id=product_id
        )       
        if created:
          cart_item.quantity = 1
        else:
         cart_item.quantity += 1

        cart_item.save()
       
        serializer = self.get_serializer(cart_item)
        return Response(serializer.data, status=status.HTTP_200_OK)



class AddressViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = UserAddresSeriliazer 
    def get_queryset(self):
        return UserAddres.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class OrderViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer    
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


import stripe
from django.conf import settings

stripe.api_key = getattr(settings, 'STRIPE_SECRET_KEY', 'sk_test_51PlaceholderSecretKeyForTesting')

class CreateStripePaymentIntentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            amount = request.data.get('amount')
            order_id = request.data.get('order_id')

            if not amount or float(amount) <= 0:
                return Response({'error': 'A valid amount is required'}, status=status.HTTP_400_BAD_REQUEST)

            amount_in_cents = int(float(amount) * 100)

            intent = stripe.PaymentIntent.create(
                amount=amount_in_cents,
                currency='usd',
                metadata={
                    'user_id': request.user.id,
                    'order_id': order_id or ''
                }
            )

            return Response({
                'clientSecret': intent.client_secret,
                'paymentIntentId': intent.id
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ConfirmStripePaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        order_id = request.data.get('order_id')
        payment_intent_id = request.data.get('payment_intent_id')

        try:
            if order_id:
                order = Order.objects.get(id=order_id, user=request.user)
                order.status = Order.STATUS_PAID
                order.save()
                return Response({'message': 'Payment confirmed and order updated to paid.', 'status': order.status}, status=status.HTTP_200_OK)
            return Response({'message': 'Payment confirmed successfully.'}, status=status.HTTP_200_OK)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)