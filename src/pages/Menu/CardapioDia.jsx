import { getCardapioHoje } from '../../mocks/cardapio'

export default function CardapioDia() {
  const cardapio = getCardapioHoje()

  if (!cardapio) {
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

      <h2>Almoço</h2>
      <ul className="cardapio-lista">
        <li><strong>Principal:</strong> {cardapio.almoco.principal}</li>
        <li><strong>Acompanhamento:</strong> {cardapio.almoco.acompanhamento}</li>
        <li><strong>Salada:</strong> {cardapio.almoco.salada}</li>
        <li><strong>Sobremesa:</strong> {cardapio.almoco.sobremesa}</li>
      </ul>

      <h2>Janta</h2>
      <ul className="cardapio-lista">
        <li><strong>Principal:</strong> {cardapio.janta.principal}</li>
        <li><strong>Acompanhamento:</strong> {cardapio.janta.acompanhamento}</li>
        <li><strong>Salada:</strong> {cardapio.janta.salada}</li>
        <li><strong>Sobremesa:</strong> {cardapio.janta.sobremesa}</li>
      </ul>
    </div>
  )
}