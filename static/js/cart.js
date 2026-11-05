function getCookie(name) {
    const m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : '';
}
function csrfHeaders(extra = {}) {
    return { 'X-CSRFToken': getCookie('csrftoken'), ...extra };
}

function renderCart(cart) {
    const container = document.getElementById('cart-container');
    const countEl = document.getElementById('cart-count');
    if (countEl) countEl.textContent = cart.count;

    if (!cart.items.length) {
        container.innerHTML = '<p>Корзина пуста</p>';
        document.getElementById('total').textContent = '0.00';
        document.getElementById('checkout-btn').disabled = true;
        return;
    }
    let html = `<table><thead><tr>
        <th>Товар</th><th>Цена</th><th>Кол-во</th><th>Сумма</th><th></th>
    </tr></thead><tbody>`;
    for (const i of cart.items) {
        html += `<tr>
            <td>${i.name}</td>
            <td>${i.price} ₽</td>
            <td>
                <button onclick="changeQty(${i.productId}, ${i.quantity - 1})">−</button>
                ${i.quantity}
                <button onclick="changeQty(${i.productId}, ${i.quantity + 1})">+</button>
            </td>
            <td>${i.subtotal.toFixed(2)} ₽</td>
            <td><button onclick="removeItem(${i.productId})">Удалить</button></td>
        </tr>`;
    }
    html += '</tbody></table>';
    container.innerHTML = html;
    document.getElementById('total').textContent = cart.total.toFixed(2);
    document.getElementById('checkout-btn').disabled = false;
}

function loadCart() { fetch('/api/cart/').then(r => r.json()).then(renderCart); }

function changeQty(productId, quantity) {
    if (quantity < 1) return removeItem(productId);
    fetch(`/api/cart/item/${productId}/?quantity=${quantity}`, {
        method: 'PUT', headers: csrfHeaders()
    }).then(r => r.json()).then(renderCart);
}
function removeItem(productId) {
    fetch(`/api/cart/item/${productId}/`, {
        method: 'DELETE', headers: csrfHeaders()
    }).then(r => r.json()).then(renderCart);
}
function checkout() {
    fetch('/api/cart/checkout/', {method: 'POST', headers: csrfHeaders()})
        .then(async r => { if (!r.ok) throw new Error(await r.text()); return r.json(); })
        .then(o => {
            document.getElementById('message').textContent =
                `Заказ оформлен! №${o.id}, сумма ${o.total} ₽`;
            loadCart();
        })
        .catch(e => {
            document.getElementById('message').textContent = 'Ошибка: ' + e.message;
        });
}
document.addEventListener('DOMContentLoaded', loadCart);