from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie

from .models import Product
from . import cart as cart_service


def _sorted_products(category, sort_by, order):
    qs = Product.objects.all()
    if category:
        qs = qs.filter(category=category)
    field = 'price' if sort_by == 'price' else 'name'
    if order == 'desc':
        field = '-' + field
    return qs.order_by(field)


@ensure_csrf_cookie
def index(request):
    category = request.GET.get('category', '').strip()
    sort_by = request.GET.get('sortBy', 'name')
    order = request.GET.get('order', 'asc')

    return render(request, 'index.html', {
        'products': _sorted_products(category, sort_by, order),
        'categories': Product.objects.values_list('category', flat=True)
                                 .distinct().order_by('category'),
        'selectedCategory': category,
        'sortBy': sort_by,
        'order': order,
        'cartCount': cart_service.count(request.session),
    })


@ensure_csrf_cookie
def cart_page(request):
    return render(request, 'cart.html', {
        'cartCount': cart_service.count(request.session),
    })