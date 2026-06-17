from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Products(models.Model):
    user= models.ForeignKey(User,on_delete=models.SET_NULL,null=True)
    productname=models.CharField(max_length=150)
    
    image=models.ImageField(null=True,blank=True)
    productbrand=models.CharField(max_length=100,null=True,blank=True)
    productcategory=models.CharField(max_length=100,null=True,blank=True)
    productinfo=models.TextField(null=True,blank=True)
    rating=models.DecimalField(max_digits=8,decimal_places=2,null=True,blank=True)
    price=models.DecimalField(max_digits=7,decimal_places=2,null=True,blank=True)
    stockcount=models.IntegerField(null=True,blank=True,default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    _id=models.AutoField(primary_key=True,editable=False)

    def __str__(self):
        return self.productname
    
class CatagoryImage(models.Model):
    categoryimage=models.ImageField(null=True,blank=True)


  
    
class CartItems(models.Model):
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Products, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.user} - {self.product}"

    class Meta:
      unique_together = ('user', 'product')

class UserAddres(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    full_name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15)
    province = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    address_line = models.TextField()
  

    def __str__(self):
        return f"{self.full_name} - {self.city}"


class Order(models.Model):
    STATUS_PENDING = 'pending'
    STATUS_PAID = 'paid'
    STATUS_SHIPPED = 'shipped'

    STATUS_CHOICES = [
        (STATUS_PENDING, 'Pending'),
        (STATUS_PAID, 'Paid'),
        (STATUS_SHIPPED, 'Shipped'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    address = models.ForeignKey(UserAddres, on_delete=models.SET_NULL, null=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    created_at = models.DateTimeField(auto_now_add=True)

    def calculate_total(self):
        total = sum(item.price_at_time * item.quantity for item in self.items.all())
        self.total_price = total
        self.save()

    def __str__(self):
        return f"{self.user.username} - {self.total_price}"


class OrderItems(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Products, on_delete=models.SET_NULL, null=True)
    quantity = models.PositiveIntegerField(default=1)
    price_at_time = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.order.id} - {self.product.productname if self.product else 'Deleted Product'}"