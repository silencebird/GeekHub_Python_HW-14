from django.db import models
from django.contrib.postgres.fields import ArrayField, HStoreField


class Category(models.Model):
    title = models.CharField(max_length=200)

    class Meta:
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.title


class Subcategory(models.Model):
    category = models.ManyToManyField(Category,
                                      related_name='subcategories')
    title = models.CharField(max_length=200)

    class Meta:
        verbose_name_plural = 'Subcategories'

    def __str__(self):
        return self.title


class Product(models.Model):
    subcategory = models.ManyToManyField(Subcategory)
    title = models.CharField(max_length=200)
    description = models.TextField()
    price = models.FloatField(default=0.0)
    on_the_main = models.BooleanField(default=False)

    def __str__(self):
        return self.title

# I thought to create customer table but no need
# class Customer(models.Model):
#     client_fullname = models.CharField(max_length=50)
#     client_address = models.CharField(max_length=50)
#     client_phone_number = models.CharField(max_length=10)
#     client_phone_email = models.EmailField()
#
#     def __str__(self):
#         return self.client_fullname


class Order(models.Model):
    client_fullname = models.CharField(max_length=50)
    client_address = models.CharField(max_length=50)
    client_phone_number = models.CharField(max_length=10)
    client_email = models.EmailField()
    orders = HStoreField()

    def __str__(self):
        return 'Customer number: {}; Name: {}'.format(self.pk, self.client_fullname)
