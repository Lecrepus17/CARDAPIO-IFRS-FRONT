import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import logo from '../../assets/Logo-IFRS-cores-sem-fundo-Vertical.png'
import api from '../../services/api'
import './Auth.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    try {
      const { data } = await api.post('/auth/login', { email, password })
      const token = data?.token || data?.accessToken || data?.access_token || data?.jwt

      if (!token) {
        throw new Error('Token não recebido da API')
      }

      const userData = data?.user || {
        name: data?.name || email,
        email,
        role: data?.role || 'user',
      }

      localStorage.setItem('@CardapioIFRS:token', token)
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userData))

      navigate('/')
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Email ou senha inválidos'

      setError(message)
    }
  }

  return (
    <div className="auth-container">
      <img src={logo} alt="Logo IFRS" className="auth-logo" />
      <h1>Login</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Entrar</button>
      </form>
      <p>
        Não tem conta? <Link to="/cadastro">Cadastre-se</Link>
      </p>
    </div>
  )
}