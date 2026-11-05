import { useEffect, useState, useCallback } from 'react'
import { api } from '../api.js'

export default function Cart({ onCartChange }) {
  const [cart, setCart] = useState({ items: [], total: 0, count: 0 })
  const [message, setMessage] = useState('')

  const refresh = useCallback(() => {
    api.getCart().then(c => { setCart(c); onCartChange() })
  }, [onCartChange])

  useEffect(() => { refresh() }, [refresh])

  const changeQty = (productId, quantity) => {
    if (quantity < 1) return remove(productId)
    api.updateQuantity(productId, quantity).then(refresh)
  }
  const remove = (productId) => api.removeItem(productId).then(refresh)
  const checkout = () => api.checkout()
    .then(o => { setMessage(`Заказ оформлен! №${o.id}, сумма ${o.total} ₽`); refresh() })
    .catch(e => setMessage('Ошибка: ' + e.message))

  return (
    <div>
      <h1>Корзина</h1>
      {message && <div className="message">{message}</div>}
      {cart.items.length === 0 ? <p>Корзина пуста</p> : (
        <table>
          <thead><tr>
            <th>Товар</th><th>Цена</th><th>Кол-во</th><th>Сумма</th><th></th>
          </tr></thead>
          <tbody>
            {cart.items.map(i => (
              <tr key={i.productId}>
                <td>{i.name}</td>
                <td>{i.price} ₽</td>
                <td>
                  <button onClick={() => changeQty(i.productId, i.quantity - 1)}>−</button>
                  {i.quantity}
                  <button onClick={() => changeQty(i.productId, i.quantity + 1)}>+</button>
                </td>
                <td>{i.subtotal.toFixed(2)} ₽</td>
                <td><button onClick={() => remove(i.productId)}>Удалить</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="total">Итого: {cart.total.toFixed(2)} ₽</div>
      <button disabled={cart.items.length === 0} onClick={checkout}>
        Оформить покупку
      </button>
    </div>
  )
}