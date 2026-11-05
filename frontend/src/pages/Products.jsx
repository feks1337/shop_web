import { useEffect, useState } from 'react'
import { api } from '../api.js'

export default function Products({ onCartChange }) {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [order, setOrder] = useState('asc')

  useEffect(() => { api.getCategories().then(setCategories) }, [])
  useEffect(() => {
    api.getProducts({ category, sortBy, order }).then(setProducts)
  }, [category, sortBy, order])

  const add = (id) => api.addToCart(id).then(() => onCartChange())

  return (
    <div>
      <div className="filters">
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">Все категории</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="name">По названию</option>
          <option value="price">По цене</option>
        </select>
        <select value={order} onChange={e => setOrder(e.target.value)}>
          <option value="asc">Возрастание</option>
          <option value="desc">Убывание</option>
        </select>
      </div>
      <div className="products">
        {products.map(p => (
          <div key={p.id} className="product">
            <h3>{p.name}</h3>
            <p className="category">{p.category}</p>
            <p className="price">{p.price} ₽</p>
            <button onClick={() => add(p.id)}>В корзину</button>
          </div>
        ))}
      </div>
    </div>
  )
}