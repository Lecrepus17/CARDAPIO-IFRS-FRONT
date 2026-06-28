import { useEffect, useState } from 'react'
import api from '../../services/api'

export default function CardapioDia() {
  const [menus, setMenus] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

  return (
    <div>
      <h1>Cardápio do Dia</h1>

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