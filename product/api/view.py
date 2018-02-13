from django.db.models import Q
from django.http import Http404
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics, mixins
from product.models import Product, Order
from product.api.permissions import IsOwnerOrReadOnly
from product.api.serializers import ProductSerializer, OrderSerializer

"""
   **************** PRODUCTS **********************************
"""


class OnlineStoreAPIView(mixins.CreateModelMixin, generics.ListAPIView):
    lookup_field = 'pk'
    serializer_class = ProductSerializer
    permission_classes = [IsOwnerOrReadOnly]

    def get_queryset(self):
        queryset = Product.objects.all()
        query = self.request.GET.get("q")
        if query is not None:
            queryset = queryset.filter(Q(title__icontains=query))
        return queryset

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)


class OnlineStoreRudView(generics.RetrieveUpdateDestroyAPIView):
    lookup_field = 'pk'
    serializer_class = ProductSerializer

    def get_queryset(self):
        return Product.objects.all()


"""
   **************** ORDER LIST **********************************
"""


class OrderAPIView(mixins.CreateModelMixin, generics.ListAPIView):
    lookup_field = 'pk'
    serializer_class = OrderSerializer
    # permission_classes = [IsOwnerOrReadOnly]

    def get_queryset(self):
        queryset = Order.objects.all()
        query = self.request.GET.get("q")
        if query is not None:
            queryset = queryset.filter(Q(client_fullname__icontains=query))
        return queryset

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)


class OrderRudView(generics.RetrieveUpdateDestroyAPIView):
    lookup_field = 'pk'
    serializer_class = OrderSerializer

    def get_object(self, pk):
        try:
            return Order.objects.get(pk=pk)
        except Order.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        order = self.get_object(pk)
        serializer = OrderSerializer(order)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        order = self.get_object(pk)
        serializer = OrderSerializer(order, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        order = self.get_object(pk)
        order.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
