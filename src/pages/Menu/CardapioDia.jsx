import { useEffect, useState } from 'react'
import api from '../../services/api'
import { getDateKey, useFavoriteMenus } from '../../hooks/useFavoriteMenus'

function criarResumoCardapio(menus) {
  return menus.map((menu) => ({
    id: menu?.id,
    type: menu?.type,
    date: menu?.date,
    items: Array.isArray(menu?.items) ? menu.items : [],
  }))
}

export default function CardapioDia() {
  const [menus, setMenus] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { isFavorite, toggleFavorite } = useFavoriteMenus()

  useEffect(() => {
    async function carregarCardapio() {
      try {
        const { data } = await api.get('/menus/current-day')
        const resposta = Array.isArray(data) ? data : data?.menus || data?.data || []
        setMenus(resposta)
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          'Erro ao carregar o cardápio do dia'

        setError(message)
      } finally {
        setLoading(false)
      }
    }

    carregarCardapio()
  }, [])

  if (loading) {
    return (
      <div>
        <h1>Cardápio do Dia</h1>
        <p>Carregando...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h1>Cardápio do Dia</h1>
        <p>{error}</p>
      </div>
    )
  }

  if (!menus.length) {
    return (
      <div>
        <h1>Cardápio do Dia</h1>
        <p>Sem cardápio disponível para hoje.</p>
      </div>
    )
  }

  const dataCardapio = menus.find((menu) => menu?.date)?.date || new Date()
  const dateKey = getDateKey(dataCardapio)
  const favorito = isFavorite(dateKey)

  return (
    <div>
      <div className="cardapio-title-row">
        <h1>Cardápio do Dia</h1>
        <button
          type="button"
          className={`favorite-button${favorito ? ' is-favorite' : ''}`}
          aria-pressed={favorito}
          onClick={() =>
            toggleFavorite({
              dateKey,
              label: 'Cardápio do dia',
              menus: criarResumoCardapio(menus),
            })
          }
        >
          {favorito ? 'Remover favorito' : 'Favoritar cardápio'}
        </button>
      </div>

      {menus.map((menu, index) => {
        const titulo = menu?.type === 'JANTAR' ? 'Janta' : (menu?.type === 'ALMOCO' ? 'Almoço' : 'Café da manhã')

        return (
          <section key={`${menu?.id || menu?.date || titulo}-${index}`}>
            <h2>{titulo}</h2>
            <ul className="cardapio-lista">
              {Array.isArray(menu?.items) && menu.items.length > 0 ? (
                menu.items.map((item, itemIndex) => (
                  <li key={`${menu?.type || titulo}-${itemIndex}`}>{item}</li>
                ))
              ) : (
                <li>Sem itens cadastrados.</li>
              )}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
