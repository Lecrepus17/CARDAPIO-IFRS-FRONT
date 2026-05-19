import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

// inicio do mock
const MOCK_USERS = [
  { email: 'admin@ifrs.edu.br', password: '123456', name: 'Administrador', role: 'admin' },
  { email: 'aluno@ifrs.edu.br', password: '123456', name: 'Aluno Teste', role: 'user' },
]
// fim do mock

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    // inicio do mock
    const user = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    )

    if (user) {
      localStorage.setItem('token', 'mock-token-' + user.role)
      localStorage.setItem('user', JSON.stringify({ name: user.name, email: user.email, role: user.role }))
      navigate('/')
    } else {
      setError('Email ou senha inválidos')
    }
    // fim do mock
  }

  return (
    <div className="auth-container">
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