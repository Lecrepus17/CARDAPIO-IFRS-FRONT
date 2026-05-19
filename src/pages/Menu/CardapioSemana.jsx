import { MOCK_CARDAPIO } from '../../mocks/cardapio'

const DIAS_LABEL = {
  segunda: 'Segunda-feira',
  terca: 'Terça-feira',
  quarta: 'Quarta-feira',
  quinta: 'Quinta-feira',
  sexta: 'Sexta-feira',
}

export default function CardapioSemana() {
  return (
    <div>
      <h1>Cardápio Semanal</h1>
      {Object.entries(MOCK_CARDAPIO).map(([dia, refeicoes]) => (
        <div key={dia} className="dia-semana">
          <h2>{DIAS_LABEL[dia]}</h2>

          <h3>Almoço</h3>
          <ul className="cardapio-lista">
            <li><strong>Principal:</strong> {refeicoes.almoco.principal}</li>
            <li><strong>Acompanhamento:</strong> {refeicoes.almoco.acompanhamento}</li>
            <li><strong>Salada:</strong> {refeicoes.almoco.salada}</li>
            <li><strong>Sobremesa:</strong> {refeicoes.almoco.sobremesa}</li>
          </ul>

          <h3>Janta</h3>
          <ul className="cardapio-lista">
            <li><strong>Principal:</strong> {refeicoes.janta.principal}</li>
            <li><strong>Acompanhamento:</strong> {refeicoes.janta.acompanhamento}</li>
            <li><strong>Salada:</strong> {refeicoes.janta.salada}</li>
            <li><strong>Sobremesa:</strong> {refeicoes.janta.sobremesa}</li>
          </ul>
        </div>
      ))}
    </div>
  )
}