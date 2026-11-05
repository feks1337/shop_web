from decimal import Decimal
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import ensure_csrf_cookie

from .models import Product, Order, OrderItem
from .serializers import ProductSerializer
from . import cart as cart_service


def _products_qs(category, sort_by, order):
    qs = Product.objects.all()
    if category:
        qs = qs.filter(category=category)
    field = 'price' if sort_by == 'price' else 'name'
    if order == 'desc':
        field = '-' + field
    return qs.order_by(field)


@api_view(['GET'])
@ensure_csrf_cookie
def products(request):
    qs = _products_qs(
        request.GET.get('category', '').strip(),
        request.GET.get('sortBy', 'name'),
        request.GET.get('order', 'asc'),
    )
    return Response(ProductSerializer(qs, many=True).data)


@api_view(['GET'])
def categories(request):
    return Response(
        list(Product.objects.values_list('category', flat=True)
             .distinct().order_by('category'))
    )


@api_view(['GET'])
@ensure_csrf_cookie
def cart_get(request):
    return Response(cart_service.cart_json(request.session))


@api_view(['POST'])
def cart_add(request):
    pid = request.data.get('productId')
    if not pid:
        return Response({'error': 'productId required'},
                        status=status.HTTP_400_BAD_REQUEST)
    qty = int(request.data.get('quantity', 1))
    cart_service.add(request.session, pid, qty)
    return Response(cart_service.cart_json(request.session))


@api_view(['PUT', 'DELETE'])
def cart_item(request, product_id):
    if request.method == 'PUT':
        try:
            qty = int(request.query_params.get('quantity', 0))
        except ValueError:
            return Response({'error': 'invalid quantity'},
                            status=status.HTTP_400_BAD_REQUEST)
        cart_service.set_quantity(request.session, product_id, qty)
    else:
        cart_service.remove(request.session, product_id)
    return Response(cart_service.cart_json(request.session))


@api_view(['POST'])
def cart_checkout(request):
    city = (request.COOKIES.get('city') or '').strip()
    if not city:
        return Response({'error': 'Город не выбран'},
                        status=status.HTTP_400_BAD_REQUEST)

    cart = cart_service.get_cart(request.session)
    if not cart['items']:
        return Response({'error': 'Корзина пуста'},
                        status=status.HTTP_400_BAD_REQUEST)

    order = Order.objects.create(city=city, total=cart['total'])
    OrderItem.objects.bulk_create([
        OrderItem(
            order=order,
            product_id=i['productId'],
            product_name=i['name'],
            price=i['price'],
            quantity=i['quantity'],
        ) for i in cart['items']
    ])
    cart_service.clear(request.session)
    return Response({
        'id': order.id,
        'total': float(order.total),
        'city': order.city,
        'createdAt': order.created_at.isoformat(),
    })