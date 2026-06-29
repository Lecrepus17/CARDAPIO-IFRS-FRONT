
import { useEffect, useState } from 'react'
import api from '../../services/api'
import { useFavoriteMenus } from '../../hooks/useFavoriteMenus'

function formatarDia(dateValue) {
  if (!dateValue) return 'Dia'

  const data = new Date(dateValue)

  if (Number.isNaN(data.getTime())) return dateValue

  const nomeDia = data.toLocaleDateString('pt-BR', { weekday: 'long' })
  return nomeDia.charAt(0).toUpperCase() + nomeDia.slice(1)
}

function criarFavoritoDia(dateKey, dia) {
  return {
    dateKey,
    label: dia.label,
    menus: {
      cafe: dia.cafe,
      almoco: dia.almoco,
      janta: dia.janta,
    },
  }
}

export default function CardapioSemana() {
  const [menus, setMenus] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { isFavorite, toggleFavorite } = useFavoriteMenus()

  useEffect(() => {
    async function carregarCardapios() {
      try {
        const { data } = await api.get('/menus/current-week')
        const resposta = Array.isArray(data) ? data : data?.menus || data?.data || []
        setMenus(resposta)
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          'Erro ao carregar o cardápio semanal'

        setError(message)
      } finally {
        setLoading(false)
      }
    }

    carregarCardapios()
  }, [])

  if (loading) {
    return (
      <div>
        <h1>Cardápio Semanal</h1>
        <p>Carregando...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h1>Cardápio Semanal</h1>
        <p>{error}</p>
      </div>
    )
  }

  if (!menus.length) {
    return (
      <div>
        <h1>Cardápio Semanal</h1>
        <p>Sem cardápio disponível para esta semana.</p>
      </div>
    )
  }
  
  const todayKey = new Date().toISOString().slice(0, 10)

  const menusPorDia = [...menus]
    .sort((a, b) => new Date(a?.date || 0) - new Date(b?.date || 0))
    .reduce((acc, menu) => {
      const data = menu?.date ? new Date(menu.date) : null
      const chave = data
        ? `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}`
        : 'sem-data'

      if (!acc[chave]) {
        acc[chave] = {
          label: formatarDia(menu?.date),
          cafe: [],
          almoco: [],
          janta: [],
        }
      }

      const tipo = (menu?.type || '').toUpperCase()
      const items = Array.isArray(menu?.items) ? menu.items : []

      if (tipo === 'JANTAR') {
        acc[chave].janta.push(...items)
      } else if (tipo === 'ALMOCO') {
        acc[chave].almoco.push(...items)
      } else {
        acc[chave].cafe.push(...items)
      }

      return acc
    }, {})

  return (
    <div>
      <h1>Cardápio Semanal</h1>
      {Object.entries(menusPorDia).map(([chave, dia], index) => {
        const favorito = isFavorite(chave)
        const isToday = chave === todayKey

        return (
          <div key={`${chave}-${index}`} className={`dia-semana${isToday ? ' dia-hoje' : ''}`}>
            <div className="cardapio-title-row">
              <h2>{dia.label}{isToday ? ' • Hoje' : ''}</h2>
              <button
                type="button"
                className={`favorite-button${favorito ? ' is-favorite' : ''}`}
                aria-pressed={favorito}
                onClick={() => toggleFavorite(criarFavoritoDia(chave, dia))}
              >
                {favorito ? 'Remover favorito' : 'Favoritar cardápio'}
              </button>
            </div>

            <h3>Café da manhã</h3>
            <ul className="cardapio-lista">
              {dia.cafe.length > 0 ? (
                dia.cafe.map((item, itemIndex) => <li key={`cafe-${chave}-${itemIndex}`}>{item}</li>)
              ) : (
                <li>Sem itens cadastrados.</li>
              )}
            </ul>

            <h3>Almoço</h3>
            <ul className="cardapio-lista">
              {dia.almoco.length > 0 ? (
                dia.almoco.map((item, itemIndex) => <li key={`almoco-${chave}-${itemIndex}`}>{item}</li>)
              ) : (
                <li>Sem itens cadastrados.</li>
              )}
            </ul>

            <h3>Janta</h3>
            <ul className="cardapio-lista">
              {dia.janta.length > 0 ? (
                dia.janta.map((item, itemIndex) => <li key={`janta-${chave}-${itemIndex}`}>{item}</li>)
              ) : (
                <li>Sem itens cadastrados.</li>
              )}
            </ul>
          </div>
        )
      })}
    </div>
  )
}