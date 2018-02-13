from django.contrib import admin

from product.models import (Category,
                            Subcategory,
                            Product, Order)

admin.site.register(Category)
admin.site.register(Subcategory)
admin.site.register(Product)
admin.site.register(Order)
