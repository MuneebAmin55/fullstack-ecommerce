from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Products,CartItems,Order,OrderItems,UserAddres,CatagoryImage

from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer
from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password


class RequestOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()


class ConfirmOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)
    new_password = serializers.CharField(write_only=True)

    def validate_new_password(self, value):
        validate_password(value)
        return value
class UserRegisterSerializer(BaseUserCreateSerializer):
    class Meta(BaseUserCreateSerializer.Meta):
        model = User
        fields = ['id', 'username', 'email', 'password', 're_password']

class ProductsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Products
        fields = ['_id', 'productname', 'price', 'productinfo', 'image','productcategory','stockcount']

class CatagoryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CatagoryImage
        fields = ['id', 'categoryimage']


class CartItemsSerializer(serializers.ModelSerializer):
    product = ProductsSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Products.objects.all(), write_only=True, source='product'
    )
    quantity = serializers.IntegerField(min_value=1, required=False)

    class Meta:
        model = CartItems
        fields = ['id', 'product', 'product_id','quantity']

    def validate(self, attrs):
        product = attrs.get("product") or getattr(self.instance, "product", None)
        quantity = attrs.get("quantity", getattr(self.instance, "quantity", 1))

        if product and product.stockcount is not None and quantity > product.stockcount:
            raise serializers.ValidationError({
                "quantity": "Requested quantity is greater than available stock."
            })

        return attrs

class UserAddresSeriliazer(serializers.ModelSerializer):
      
    class Meta:
        model = UserAddres
        fields = ['id','full_name','phone_number','province','city','address_line']


class OrderItemsSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Products.objects.all())
    quantity = serializers.IntegerField(min_value=1)

    class Meta:
        model = OrderItems
        fields = ["product", "quantity"]

    def validate(self, attrs):
        product = attrs["product"]
        quantity = attrs["quantity"]

        if product.price is None:
            raise serializers.ValidationError({
                "product": "Product price is not available."
            })

        if product.stockcount is not None and quantity > product.stockcount:
            raise serializers.ValidationError({
                "quantity": f"Only {product.stockcount} items are available for {product.productname}."
            })

        return attrs


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemsSerializer(many=True, write_only=True)
    order_items = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Order
        fields = ["id", "address", "status", "total_price", "items","created_at", "order_items"]
        read_only_fields = ["status", "total_price", "created_at"]

    def validate_address(self, address):
        request = self.context.get("request")

        if request and address and address.user_id != request.user.id:
            raise serializers.ValidationError("Invalid address.")

        return address

    def validate_items(self, items):
        if not items:
            raise serializers.ValidationError("At least one order item is required.")

        return items

    def get_order_items(self, obj):
        return [
            {
                "product": item.product.productname if item.product else None,
                "quantity": item.quantity,
                "price": item.price_at_time
            }
            for item in obj.items.all()
        ]

    def create(self, validated_data):
        items_data = validated_data.pop("items")

        order = Order.objects.create(**validated_data)

        for item in items_data:
            product = item["product"]
            OrderItems.objects.create(
                order=order,
                product=product,
                quantity=item["quantity"],
                price_at_time=product.price
            )

        order.calculate_total()
        return order
