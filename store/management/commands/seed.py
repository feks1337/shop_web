from django.core.management.base import BaseCommand
from store.models import Product


class Command(BaseCommand):
    help = 'Seed products'

    def handle(self, *args, **options):
        if Product.objects.exists():
            self.stdout.write('Products already exist.')
            return
        Product.objects.bulk_create([
            Product(name='iPhone 15', category='Смартфоны', price=79990),
            Product(name='Samsung Galaxy S24', category='Смартфоны', price=69990),
            Product(name='Xiaomi Redmi Note 13', category='Смартфоны', price=19990),
            Product(name='MacBook Air M3', category='Ноутбуки', price=129990),
            Product(name='Lenovo IdeaPad', category='Ноутбуки', price=49990),
            Product(name='ASUS ROG', category='Ноутбуки', price=159990),
            Product(name='Sony WH-1000', category='Аудио', price=29990),
            Product(name='AirPods Pro', category='Аудио', price=24990),
            Product(name='iPad Air', category='Планшеты', price=59990),
        ])
        self.stdout.write(self.style.SUCCESS('Seeded 9 products'))