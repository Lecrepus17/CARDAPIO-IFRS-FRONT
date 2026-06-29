import { useEffect, useState } from 'react'
import api from '../../services/api'

export default function UserProfile() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}')
    } catch {
      return {}
    }
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function carregarPerfil() {
      try {
        const endpoints = ['/auth/me', '/user/profile', '/profile', '/me']
        let perfil = null

        for (const endpoint of endpoints) {
          try {
            const { data } = await api.get(endpoint)
            perfil = data?.user || data?.data || data

            if (perfil?.email || perfil?.name) {
              break
            }
          } catch {
            // tenta o próximo endpoint
          }
        }

        if (perfil?.email || perfil?.name) {
          const dadosUsuario = {
            name: perfil?.name || perfil?.fullName || perfil?.username || user?.name || '',
            email: perfil?.email || user?.email || '',
            role: perfil?.role || user?.role || 'user',
          }

          setUser(dadosUsuario)
          localStorage.setItem('user', JSON.stringify(dadosUsuario))
        } else {
          setUser((current) => current || {})
        }
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          'Erro ao carregar o perfil'

        setError(message)
      } finally {
        setLoading(false)
      }
    }

    carregarPerfil()
  }, [])

  if (loading) {
    return (
      <div>
        <h1>Meu Perfil</h1>
        <p>Carregando...</p>
      </div>
    )
  }

  return (
    <div>
      <h1>Meu Perfil</h1>
      {error && <p>{error}</p>}
      <p>Nome: {user?.name || 'Não informado'}</p>
      <p>Email: {user?.email || 'Não informado'}</p>
      <p>Perfil: {user?.role || 'user'}</p>
    </div>
  )
}