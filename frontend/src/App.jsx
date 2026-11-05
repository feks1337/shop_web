import { useState, useEffect, useCallback } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Products from './pages/Products.jsx'
import Cart from './pages/Cart.jsx'
import CityModal from './components/CityModal.jsx'
import { api } from './api.js'

export default function App() {
  const [city, setCity] = useState(api.getCity())
  const [showCityModal, setShowCityModal] = useState(!api.getCity())
  const [cartCount, setCartCount] = useState(0)

  const refreshCartCount = useCallback(() => {
    api.getCart().then(c => setCartCount(c.count))
  }, [])
  useEffect(() => { refreshCartCount() }, [refreshCartCount])

  const handleSelectCity = (c) => { api.setCity(c); setCity(c); setShowCityModal(false) }

  return (
    <>
      <header className="header">
        <Link to="/" className="logo">🛒 Shop SPA</Link>
        <nav>
          <Link to="/">Товары</Link>
          <Link to="/cart">Корзина ({cartCount})</Link>
          <button onClick={() => setShowCityModal(true)}>
            Город: {city || 'не выбран'}
          </button>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Products onCartChange={refreshCartCount} />} />
          <Route path="/cart" element={<Cart onCartChange={refreshCartCount} />} />
        </Routes>
      </main>

      <CityModal open={showCityModal} city={city}
                 onSelect={handleSelectCity}
                 onClose={() => setShowCityModal(false)} />
    </>
  )
}