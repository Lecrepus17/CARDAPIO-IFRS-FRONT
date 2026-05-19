import { getRefeicaoAtual } from '../../mocks/cardapio'

export default function CardapioProximo() {
  const refeicao = getRefeicaoAtual()

  if (!refeicao) {
    return (
      <div>
        <h1>Próxima Refeição</h1>
        <p>Sem cardápio disponível para hoje.</p>
      </div>
    )
  }

  return (
    <div>
      <h1>Próxima Refeição — {refeicao.tipo}</h1>
      <ul className="cardapio-lista">
        <li><strong>Principal:</strong> {refeicao.principal}</li>
        <li><strong>Acompanhamento:</strong> {refeicao.acompanhamento}</li>
        <li><strong>Salada:</strong> {refeicao.salada}</li>
        <li><strong>Sobremesa:</strong> {refeicao.sobremesa}</li>
      </ul>
    </div>
  )
}