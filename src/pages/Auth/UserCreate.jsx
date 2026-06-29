import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../services/api'
import logo from '../../assets/Logo-IFRS-cores-sem-fundo-Vertical.png'
import './Auth.css'

export default function UserCreate() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('ALUNO')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    try {
      await api.post('/auth/register', {
        name,
        email,
        password,
        role,
      })

      navigate('/login')
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Erro ao cadastrar'

      setError(message)
    }
  }

  return (
    <div className="auth-container">
      <img src={logo} alt="Logo IFRS" className="auth-logo" />
      <h1>Cadastro</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Nome</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
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

        <div>
          <label htmlFor="role">Tipo de usuário</label>
          <select id="role" value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="ALUNO">Aluno</option>
            <option value="SERVIDOR">Servidor</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <button type="submit">Cadastrar</button>
      </form>
      <p>
        Já tem conta? <Link to="/login">Fazer login</Link>
      </p>
    </div>
  )
}