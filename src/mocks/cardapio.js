// inicio do mock
export const MOCK_CARDAPIO = {
  segunda: {
    almoco: {
      principal: 'Frango grelhado com molho de ervas',
      acompanhamento: 'Arroz integral e feijão preto',
      salada: 'Alface, tomate e cenoura ralada',
      sobremesa: 'Fruta da estação',
    },
    janta: {
      principal: 'Sopa de legumes com macarrão',
      acompanhamento: 'Pão francês',
      salada: 'Coleslaw',
      sobremesa: 'Gelatina',
    },
  },
  terca: {
    almoco: {
      principal: 'Carne moída com batata',
      acompanhamento: 'Arroz branco e lentilha',
      salada: 'Rúcula com beterraba',
      sobremesa: 'Pudim',
    },
    janta: {
      principal: 'Omelete de queijo e presunto',
      acompanhamento: 'Batata sauté',
      salada: 'Mix de folhas',
      sobremesa: 'Fruta da estação',
    },
  },
  quarta: {
    almoco: {
      principal: 'Peixe assado ao limão',
      acompanhamento: 'Purê de batata e arroz',
      salada: 'Pepino, tomate e cebola',
      sobremesa: 'Mousse de chocolate',
    },
    janta: {
      principal: 'Cachorro-quente assado',
      acompanhamento: 'Batata palha',
      salada: 'Repolho e cenoura',
      sobremesa: 'Fruta da estação',
    },
  },
  quinta: {
    almoco: {
      principal: 'Strogonoff de frango',
      acompanhamento: 'Arroz branco e batata palha',
      salada: 'Alface e milho',
      sobremesa: 'Laranja',
    },
    janta: {
      principal: 'Polenta com molho bolonhesa',
      acompanhamento: 'Salada verde',
      salada: 'Agrião com tomate',
      sobremesa: 'Gelatina',
    },
  },
  sexta: {
    almoco: {
      principal: 'Feijoada leve',
      acompanhamento: 'Arroz branco, couve e farofa',
      salada: 'Vinagrete',
      sobremesa: 'Laranja',
    },
    janta: {
      principal: 'Pizza caseira de frango',
      acompanhamento: 'Suco natural',
      salada: 'Alface e tomate',
      sobremesa: 'Fruta da estação',
    },
  },
}

export const DIAS_SEMANA = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado']

export function getCardapioHoje() {
  const dia = DIAS_SEMANA[new Date().getDay()]
  return MOCK_CARDAPIO[dia] || null
}

export function getRefeicaoAtual() {
  const hora = new Date().getHours()
  const cardapio = getCardapioHoje()
  if (!cardapio) return null
  if (hora < 11) return { tipo: 'Café da manhã', ...cardapio.almoco }
  if (hora >= 11 && hora < 14) return { tipo: 'Almoço', ...cardapio.almoco }
  if (hora >= 14 && hora < 18) return { tipo: 'Janta', ...cardapio.janta }
}
// fim do mock
