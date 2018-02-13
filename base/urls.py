from django.conf.urls import url
from django.urls import path, re_path, include
from django.contrib import admin

urlpatterns = [
    path('', include('product.urls')),
    path('admin/', admin.site.urls),
    path('api/products/', include('product.api.urls')),
]
