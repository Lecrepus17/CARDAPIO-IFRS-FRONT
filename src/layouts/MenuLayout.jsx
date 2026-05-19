import { NavLink, Outlet } from 'react-router-dom'

export default function MenuLayout() {
  return (
    <div className="menu-layout">
      <nav className="menu-nav">
        <NavLink to="/" end>Próxima Refeição</NavLink>
        <NavLink to="/cardapio/dia">Diário</NavLink>
        <NavLink to="/cardapio/semana">Semanal</NavLink>
      </nav>
      <main className="menu-content">
        <Outlet />
      </main>
    </div>
  )
}
