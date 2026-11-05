import { useState } from 'react'

const CITIES = ['Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань']

export default function CityModal({ open, city, onSelect, onClose }) {
  const [selected, setSelected] = useState(city || CITIES[0])
  if (!open) return null
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Выберите город</h2>
        <select value={selected} onChange={e => setSelected(e.target.value)}>
          {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button onClick={() => onSelect(selected)}>Подтвердить</button>
        {city && <button onClick={onClose}>Отмена</button>}
      </div>
    </div>
  )
}