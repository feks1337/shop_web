from decimal import Decimal
from .models import Product

CART_KEY = 'cart'


def _cart(session):
    return session.setdefault(CART_KEY, {})


def add(session, product_id, quantity=1):
    cart = _cart(session)
    pid = str(product_id)
    cart[pid] = cart.get(pid, 0) + int(quantity)
    session.modified = True


def set_quantity(session, product_id, quantity):
    cart = _cart(session)
    pid = str(product_id)
    if quantity <= 0:
        cart.pop(pid, None)
    else:
        cart[pid] = int(quantity)
    session.modified = True


def remove(session, product_id):
    cart = _cart(session)
    cart.pop(str(product_id), None)
    session.modified = True


def clear(session):
    session.pop(CART_KEY, None)


def count(session):
    return sum(_cart(session).values())


def get_cart(session):
    """Внутреннее представление (Decimal)."""
    cart = _cart(session)
    items, total = [], Decimal('0')
    if cart:
        ids = [int(k) for k in cart.keys()]
        products = {p.id: p for p in Product.objects.filter(id__in=ids)}
        for pid_str, qty in cart.items():
            p = products.get(int(pid_str))
            if not p:
                continue
            subtotal = p.price * qty
            total += subtotal
            items.append({
                'productId': p.id, 'name': p.name,
                'price': p.price, 'quantity': qty, 'subtotal': subtotal,
            })
    return {'items': items, 'total': total, 'count': sum(cart.values())}


def cart_json(session):
    """Для JSON-ответа (float)."""
    dto = get_cart(session)
    return {
        'items': [
            {**i, 'price': float(i['price']), 'subtotal': float(i['subtotal'])}
            for i in dto['items']
        ],
        'total': float(dto['total']),
        'count': dto['count'],
    }