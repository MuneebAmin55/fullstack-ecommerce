# views.py
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework import viewsets
from .models import Products,CartItems,Order,OrderItems,UserAddres,CatagoryImage
from .serializer import ProductsSerializer,UserRegisterSerializer,CartItemsSerializer,OrderSerializer,OrderItemsSerializer,UserAddresSeriliazer,CatagoryImageSerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser,IsAuthenticatedOrReadOnly,AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.contrib.auth.models import User
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

token_generator = PasswordResetTokenGenerator()


# ================= REQUEST RESET =================
class RequestPasswordResetView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")

        if not email:
            return Response({"error": "Email is required"}, status=400)

        user = User.objects.filter(email=email).first()

        # always safe response (security best practice)
        if user:
            uid = urlsafe_base64_encode(force_bytes(user.id))
            token = token_generator.make_token(user)

            reset_link = f"http://localhost:3000/reset-password/{uid}/{token}/"

            # DEBUG ONLY (no email to avoid crash)
            print("RESET LINK:", reset_link)

        return Response(
            {"message": "If email exists, reset link generated"},
            status=200
        )


# ================= RESET PASSWORD =================
class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        uid = request.data.get("uid")
        token = request.data.get("token")
        password = request.data.get("password")

        if not uid or not token or not password:
            return Response({"error": "All fields required"}, status=400)

        try:
            user_id = urlsafe_base64_decode(uid).decode()
            user = User.objects.get(id=user_id)

            if token_generator.check_token(user, token):
                user.set_password(password)
                user.save()
                return Response({"message": "Password reset successful"})
            else:
                return Response({"error": "Invalid or expired token"}, status=400)

        except:
            return Response({"error": "Invalid request"}, status=400)

class RegisterView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        
        serializer = UserRegisterSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "User registered successfully"},
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
        })

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
    

 