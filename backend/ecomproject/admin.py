from django.contrib import admin
from .models import Products,CartItems,Order,OrderItems,UserAddres,CatagoryImage

# Register your models here.
# Basic way
@admin.register(Products)
class ProductsAdmin(admin.ModelAdmin):
    list_display = ('_id', 'productname', 'productbrand', 'productcategory', 'price', 'stockcount', 'rating', 'user')
    list_display_links = ('_id', 'productname')
    search_fields = ('productname', 'productbrand', 'productcategory')
    list_filter = ('productbrand', 'productcategory', 'user')

@admin.register(CatagoryImage)
class CatagoryImageAdmin(admin.ModelAdmin):
    list_display=('id','categoryimage')


@admin.register(CartItems)
class CartItemssAdmin(admin.ModelAdmin):
    list_display=('id','user','product','quantity')


@admin.register(UserAddres)
class UserAddresAdmin(admin.ModelAdmin):
    list_display=('id','full_name','phone_number','province','city','address_line')   


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display=('id','user', 'total_price','address','created_at','status')

@admin.register(OrderItems)
class OrderItemsAdmin(admin.ModelAdmin):
    list_display=('id', 'product','order','price_at_time','quantity')    