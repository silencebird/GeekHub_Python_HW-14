from django.conf.urls import url, re_path

from product.views import index, subcategory_product, product_details, cart


app_name = 'product'
urlpatterns = [
    re_path(r'^$', index, name='index'),
    re_path(r'^(?P<id>\d+)/$', subcategory_product,
        name='subcategory-product'),
    re_path(r'^(?P<id>\d+)/details/$', product_details,
        name='product-details'),
    re_path(r'^cart/$', cart, name='cart'),
]