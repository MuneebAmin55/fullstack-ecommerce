from django.contrib import admin
from django.utils.html import format_html
from .models import Products, CartItems, Order, OrderItems, UserAddres, CatagoryImage


@admin.register(Products)
class ProductsAdmin(admin.ModelAdmin):
    list_display = ('_id', 'productname', 'productbrand', 'productcategory', 'price', 'stockcount', 'rating', 'user', 'image_preview')
    list_display_links = ('_id', 'productname')
    search_fields = ('productname', 'productbrand', 'productcategory')
    list_filter = ('productbrand', 'productcategory', 'user')

    def image_preview(self, obj):
        if obj.image:
            try:
                return format_html('<img src="{}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;" />', obj.image.url)
            except Exception:
                return "-"
        return "-"
    image_preview.short_description = "Preview"


@admin.register(CatagoryImage)
class CatagoryImageAdmin(admin.ModelAdmin):
    list_display = ('id', 'categoryimage', 'image_preview')

    def image_preview(self, obj):
        if obj.categoryimage:
            try:
                return format_html('<img src="{}" style="width: 80px; height: 40px; object-fit: cover; border-radius: 4px;" />', obj.categoryimage.url)
            except Exception:
                return "-"
        return "-"
    image_preview.short_description = "Preview"


@admin.register(CartItems)
class CartItemssAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'product', 'quantity')


@admin.register(UserAddres)
class UserAddresAdmin(admin.ModelAdmin):
    list_display = ('id', 'full_name', 'phone_number', 'province', 'city', 'address_line')


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'total_price', 'address', 'created_at', 'status')


@admin.register(OrderItems)
class OrderItemsAdmin(admin.ModelAdmin):
    list_display = ('id', 'product', 'order', 'price_at_time', 'quantity')