export default function UserProfile() {
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  return (
    <div>
      <h1>Meu Perfil</h1>
      <p>Nome: {user.name}</p>
      <p>Email: {user.email}</p>
    </div>
  )
}