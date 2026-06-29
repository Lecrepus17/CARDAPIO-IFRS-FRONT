import { useEffect, useState } from 'react'
import api from '../../services/api'

export default function CardapioProximo() {
  const [menu, setMenu] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function carregarRefeicao() {
      try {
        const { data } = await api.get('/menus/current')
        const resposta = data?.menu || data?.data || data
        setMenu(resposta)
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          'Erro ao carregar a próxima refeição'

        setError(message)
      } finally {
        setLoading(false)
      }
    }

    carregarRefeicao()
  }, [])

  if (loading) {
    return (
      <div>
        <h1>Próxima Refeição</h1>
        <p>Carregando...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h1>Próxima Refeição</h1>
        <p>{error}</p>
      </div>
    )
  }

  if (!menu) {
    return (
      <div>
        <h1>Próxima Refeição</h1>
        <p>Sem cardápio disponível para hoje.</p>
      </div>
    )
  }

  return (
    <div>
      <h1>Próxima Refeição — {menu?.type === 'JANTAR' ? 'Janta' : (menu?.type === 'ALMOCO' ? 'Almoço' : 'Café da manhã')}</h1>
      <ul className="cardapio-lista">
        {Array.isArray(menu?.items) && menu.items.length > 0 ? (
          menu.items.map((item, index) => (
            <li key={`${menu?.type || 'refeicao'}-${index}`}>{item}</li>
          ))
        ) : (
          <li>Sem itens cadastrados.</li>
        )}
      </ul>
    </div>
  )
}