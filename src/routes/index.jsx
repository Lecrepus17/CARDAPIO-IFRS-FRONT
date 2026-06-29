import { Routes, Route } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import MenuLayout from '../layouts/MenuLayout'

import Login from '../pages/Auth/login'
import UserCreate from '../pages/Auth/UserCreate'
import CardapioDia from '../pages/Menu/CardapioDia'
import CardapioSemana from '../pages/Menu/CardapioSemana'
import CardapioProximo from '../pages/Menu/CardapioProximo'
import UserProfile from '../pages/Profile/UserProfile'
import AdminDashboard from '../pages/Admin/AdminDashboard'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<UserCreate />} />

      {/* Rotas protegidas com navegação de cardápio */}
      <Route element={<PrivateRoute />}>
        <Route element={<MenuLayout />}>
          <Route path="/" element={<CardapioProximo />} />
          <Route path="/cardapio/dia" element={<CardapioDia />} />
          <Route path="/cardapio/semana" element={<CardapioSemana />} />
        </Route>
        <Route path="/perfil" element={<UserProfile />} />
      </Route>

      {/* Rotas admin */}
      <Route element={<PrivateRoute requiredRole="ADMIN" />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>
    </Routes>
  )
}