import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import api from '../../services/api'
import '../../layouts/MenuLayout.css'

function formatarTipo(tipo) {
  switch ((tipo || '').toUpperCase()) {
    case 'CAFEMANHA':
      return 'Café da manhã'
    case 'ALMOCO':
      return 'Almoço'
    case 'JANTAR':
      return 'Janta'
    default:
      return tipo || 'Refeição'
  }
}

function formatarData(data) {
  if (!data) return ''

  const parsed = new Date(data)

  if (Number.isNaN(parsed.getTime())) return data

  return parsed.toLocaleDateString('pt-BR')
}

export default function AdminDashboard() {
  const [menus, setMenus] = useState([])
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const isAdmin = (user?.role || '').toUpperCase() === 'ADMIN'
  const [type, setType] = useState('ALMOCO')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [itemsInput, setItemsInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function carregarMenus() {
    try {
      const { data } = await api.get('/menus')
      const resposta = Array.isArray(data) ? data : data?.menus || data?.data || []
      setMenus(resposta)
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Erro ao carregar os cardápios'

      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarMenus()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    const items = itemsInput
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)

    if (!items.length) {
      setError('Informe pelo menos um prato.')
      return
    }

    try {
      await api.post('/menus', { type, date, items })
      setItemsInput('')
      setType('ALMOCO')
      setDate(new Date().toISOString().slice(0, 10))
      setSuccess('Cardápio cadastrado com sucesso!')
      await carregarMenus()
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Erro ao cadastrar o cardápio'

      setError(message)
    }
  }

  async function handleDelete(id) {
    try {
      await api.delete(`/menus/${id}`)
      setSuccess('Cardápio removido com sucesso!')
      await carregarMenus()
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Erro ao remover o cardápio'

      setError(message)
    }
  }

  return (
    <div className="menu-content admin-dashboard">
      <nav className="menu-nav">
        <NavLink to="/">Área normal</NavLink>
        {isAdmin && <NavLink to="/admin">Painel Admin</NavLink>}
      </nav>

      <h1>Painel Administrativo</h1>
      <p>Gestão de cardápios e refeições.</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="menu-type">Tipo</label>
          <select id="menu-type" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="CAFEMANHA">Café da manhã</option>
            <option value="ALMOCO">Almoço</option>
            <option value="JANTAR">Janta</option>
          </select>
        </div>

        <div>
          <label htmlFor="menu-date">Data</label>
          <input
            id="menu-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="menu-items">Pratos</label>
          <input
            id="menu-items"
            type="text"
            value={itemsInput}
            onChange={(e) => setItemsInput(e.target.value)}
            placeholder="Arroz, Feijão, Carne"
            required
          />
        </div>

        <button type="submit">Cadastrar cardápio</button>
      </form>

      {error && <p className="status-error">{error}</p>}
      {success && <p className="status-success">{success}</p>}

      <h2>Cardápios cadastrados</h2>
      {loading ? (
        <p>Carregando...</p>
      ) : menus.length === 0 ? (
        <p>Nenhum cardápio cadastrado.</p>
      ) : (
        <div>
          {menus.map((menu) => (
            <div key={menu.id} className="dia-semana">
              <h3>{formatarData(menu.date)}</h3>
              <h4>{formatarTipo(menu.type)}</h4>
              <ul className="cardapio-lista">
                {Array.isArray(menu.items) && menu.items.length > 0 ? (
                  menu.items.map((item, index) => <li key={`${menu.id}-${index}`}>{item}</li>)
                ) : (
                  <li>Sem itens cadastrados.</li>
                )}
              </ul>
              <button type="button" className="btn-danger" onClick={() => handleDelete(menu.id)}>
                Excluir
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}