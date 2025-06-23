export default function UserPanel({ user }) {
  if (!user) return null

  switch (user.rol) {
    case 'CIUDADANO':
      return <div>Bienvenido, ciudadano</div>
    case 'MIEMBRO_MESA':
      return <div>Panel de miembro de mesa</div>
    case 'AGENTE_POLICIA':
      return <div>Panel de agente de policía</div>
    default:
      return <div>Rol desconocido</div>
  }
}