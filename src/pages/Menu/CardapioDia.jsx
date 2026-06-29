import { useEffect, useState } from "react";
import api from "../../services/api";
import { getDateKey, useFavoriteMenus } from "../../hooks/useFavoriteMenus";
import { exportCardapioPdf } from "../../utils/exportCardapioPdf";

function criarResumoCardapio(menus) {
  const grouped = menus.reduce((acc, menu) => {
    const tipo = (menu?.type || "CAFEMANHA").toUpperCase();
    const items = Array.isArray(menu?.items) ? menu.items.filter(Boolean) : [];

    if (!acc[tipo]) {
      acc[tipo] = {
        id: tipo,
        type: tipo,
        items: [],
      };
    }

    acc[tipo].items.push(...items);
    return acc;
  }, {});

  return Object.values(grouped).map((group) => ({
    ...group,
    items: [...new Set(group.items)],
  }));
}

function formatarTipo(tipo) {
  switch ((tipo || "").toUpperCase()) {
    case "JANTAR":
      return "Janta";
    case "ALMOCO":
      return "Almoço";
    default:
      return "Café da manhã";
  }
}

function criarLinhasPdf(menus, dateKey) {
  return [
    `Periodo: ${dateKey}`,
    "",
    ...menus.flatMap((menu) => [
      formatarTipo(menu?.type),
      ...(Array.isArray(menu?.items) && menu.items.length
        ? menu.items.map((item) => `- ${item}`)
        : ["- Sem itens cadastrados."]),
      "",
    ]),
  ];
}

export default function CardapioDia() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isFavorite, toggleFavorite } = useFavoriteMenus();

  useEffect(() => {
    async function carregarCardapio() {
      try {
        const { data } = await api.get("/menus/current-day");
        const resposta = Array.isArray(data)
          ? data
          : data?.menus || data?.data || [];
        setMenus(resposta);
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Erro ao carregar o cardápio do dia";

        setError(message);
      } finally {
        setLoading(false);
      }
    }

    carregarCardapio();
  }, []);

  if (loading) {
    return (
      <div>
        <h1>Cardápio do Dia</h1>
        <p>Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1>Cardápio do Dia</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (!menus.length) {
    return (
      <div>
        <h1>Cardápio do Dia</h1>
        <p>Sem cardápio disponível para hoje.</p>
      </div>
    );
  }

  const menusAgrupados = criarResumoCardapio(menus);
  const dataCardapio = menus.find((menu) => menu?.date)?.date || new Date();
  const dateKey = getDateKey(dataCardapio);
  const favorito = isFavorite(dateKey);

  return (
    <div>
      <div className="cardapio-title-row">
        <h1>Cardápio do Dia</h1>
        <button
          type="button"
          className={`favorite-button${favorito ? " is-favorite" : ""}`}
          aria-pressed={favorito}
          onClick={() =>
            toggleFavorite({
              dateKey,
              label: "Cardápio do dia",
              menus: criarResumoCardapio(menus),
            })
          }
        >
          {favorito ? "Remover favorito" : "Favoritar cardápio"}
        </button>
        <button
          type="button"
          className="favorite-button pdf-button"
          onClick={() =>
            exportCardapioPdf({
              title: "Cardápio do Dia",
              fileName: `cardapio-dia-${dateKey}`,
              lines: criarLinhasPdf(menusAgrupados, dateKey),
            })
          }
        >
          Exportar PDF
        </button>
      </div>

      {menusAgrupados.map((menu, index) => {
        const titulo = formatarTipo(menu?.type);

        return (
          <section key={`${menu?.id || menu?.type || titulo}-${index}`}>
            <h2>{titulo}</h2>
            <ul className="cardapio-lista">
              {menu.items.length > 0 ? (
                menu.items.map((item, itemIndex) => (
                  <li key={`${menu?.type || titulo}-${itemIndex}`}>{item}</li>
                ))
              ) : (
                <li>Sem itens cadastrados.</li>
              )}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
