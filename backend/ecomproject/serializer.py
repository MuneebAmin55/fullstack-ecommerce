from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Products,CartItems,Order,OrderItems,UserAddres,CatagoryImage

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password']
        )
        return user


    
class ProductsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Products
        fields = ['_id', 'productname', 'price', 'productinfo', 'image','productcategory','stockcount']

class CatagoryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CatagoryImage
        fields = ['categoryimage']


class CartItemsSerializer(serializers.ModelSerializer):
    product = ProductsSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Products.objects.all(), write_only=True, source='product'
    )

    class Meta:
        model = CartItems
        fields = ['id', 'product', 'product_id','quantity']

class UserAddresSeriliazer(serializers.ModelSerializer):
      
    class Meta:
        model = UserAddres
        fields = ['id','full_name','phone_number','province','city','address_line']


class OrderItemsSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Products.objects.all())

    class Meta:
        model = OrderItems
        fields = ["product", "quantity"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemsSerializer(many=True, write_only=True)
    order_items = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Order
        fields = ["id", "address", "status", "total_price", "items","created_at", "order_items"]
        read_only_fields = ["status", "total_price"]

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
