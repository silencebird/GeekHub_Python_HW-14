from rest_framework import serializers

from product.models import Product, Order


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            'pk',
            'subcategory',
            'title',
            'description',
            'price',
            'on_the_main',
        ]

    def validate_product_title(self, value):
        qs = Product.objects.filter(title__iexact=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("This product already exist")
        return value


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = [
            'pk',
            'client_fullname',
            'client_address',
            'client_phone_number',
            'client_email',
            'orders',
        ]

    def validate_product_orders(self, value):
        qs = Product.objects.filter(orders__iexact=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("This product already exist")
        return value