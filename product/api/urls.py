from django.urls import re_path, include

from product.api.view import OnlineStoreRudView, OnlineStoreAPIView, OrderAPIView, OrderRudView

urlpatterns = [
    re_path(r'^product-list', OnlineStoreAPIView.as_view(), name='product-create'),
    re_path(r'^product-list(?P<pk>\d+)/$', OnlineStoreRudView.as_view(), name='product-rud'),
    re_path(r'^order-list', OrderAPIView.as_view(), name='order-create'),
    re_path(r'^order-list(?P<pk>\d+)/$', OrderRudView.as_view(), name='order-rud'),
]
