const BASE = '/api'

function getCookie(name) {
  const m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'))
  return m ? decodeURIComponent(m[1]) : ''
}
function setCookie(name, value, days = 365) {
  document.cookie =
    `${name}=${encodeURIComponent(value)}; path=/; max-age=${days * 86400}; SameSite=Lax`
}
const csrf = (extra = {}) => ({ 'X-CSRFToken': getCookie('csrftoken'), ...extra })
const json = () => csrf({ 'Content-Type': 'application/json' })

export const api = {
  getCity: () => getCookie('city'),
  setCity: (c) => setCookie('city', c),

  getProducts: (params = {}) => {
    const q = new URLSearchParams(params).toString()
    return fetch(`${BASE}/products/?${q}`).then(r => r.json())
  },
  getCategories: () => fetch(`${BASE}/products/categories/`).then(r => r.json()),

  getCart: () => fetch(`${BASE}/cart/`).then(r => r.json()),
  addToCart: (productId, quantity = 1) =>
    fetch(`${BASE}/cart/add/`, {
      method: 'POST', headers: json(),
      body: JSON.stringify({ productId, quantity })
    }).then(r => r.json()),
  updateQuantity: (productId, quantity) =>
    fetch(`${BASE}/cart/item/${productId}/?quantity=${quantity}`, {
      method: 'PUT', headers: csrf()
    }).then(r => r.json()),
  removeItem: (productId) =>
    fetch(`${BASE}/cart/item/${productId}/`, {
      method: 'DELETE', headers: csrf()
    }).then(r => r.json()),
  checkout: () =>
    fetch(`${BASE}/cart/checkout/`, { method: 'POST', headers: csrf() })
      .then(async r => { if (!r.ok) throw new Error(await r.text()); return r.json() })
}