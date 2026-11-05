from django.urls import path
from . import views, api

urlpatterns = [
    path('', views.index, name='index'),
    path('cart/', views.cart_page, name='cart'),

    path('api/products/', api.products, name='api-products'),
    path('api/products/categories/', api.categories, name='api-categories'),
    path('api/cart/', api.cart_get, name='api-cart'),
    path('api/cart/add/', api.cart_add, name='api-cart-add'),
    path('api/cart/item/<int:product_id>/', api.cart_item, name='api-cart-item'),
    path('api/cart/checkout/', api.cart_checkout, name='api-cart-checkout'),
]