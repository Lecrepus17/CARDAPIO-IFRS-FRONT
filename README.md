# 🍱 Food Management System

Sistema de gestão de cardápio e usuários desenvolvido com React, focado em modularidade, experiência do usuário e segurança da informação.

## 📌 Sumário

- [Funcionalidades](#-funcionalidades)
- [Arquitetura e Pastas](#-arquitetura-e-pastas)
- [Cibersegurança (Tríade CIA)](#️-cibersegurança-tríade-cia)
- [Lógica de Negócio](#-lógica-de-negócio)
- [Instalação](#-instalação)

## 🚀 Funcionalidades

### 🔐 Autenticação e Perfis

- **Login & Registro:** Interface para acesso e criação de novas contas.
- **User Profile:** Gerenciamento de informações pessoais e configurações de conta.
- **Controle de Acesso (RBAC):** Proteção de rotas baseada em cargos (Ex: Usuário comum vs. Admin).

### 🍽️ Gestão de Cardápio

- **Cardápio do Dia:** Exibição das refeições programadas para a data atual.
- **Cardápio Semanal:** Visualização da grade completa de refeições da semana.
- **Próxima Refeição (Smart View):** Lógica automática de exibição:
  - 00:00 às 13:59: Exibe o Almoço.
  - 14:00 às 23:59: Exibe a Janta.

### 🛠️ Painel Administrativo

Área restrita para gestão de pratos, edição de cardápios e controle de usuários.

## 📂 Arquitetura e Pastas

A estrutura segue o padrão de **Separation of Concerns (SoC)**, facilitando a manutenção e testes:

```
src/
├── api/            # Configurações do Axios e instâncias de serviços
├── assets/         # Imagens, ícones e arquivos estáticos
├── components/     # Componentes atômicos e reutilizáveis
├── hooks/          # Custom hooks para lógica de estado
├── layouts/        # Wrappers de estrutura (Ex: AdminLayout vs UserLayout)
├── pages/          # Telas principais da aplicação
│   ├── Admin/      # Gestão do sistema
│   ├── Auth/       # Login e Cadastro
│   ├── Menu/       # Telas de cardápio (Dia, Semana, Próximo)
│   └── Profile/    # Gestão de perfil
└── utils/          # Helpers (formatadores de data, lógica de horários)
```

## 🛡️ Cibersegurança (Tríade CIA)

Como o sistema lida com dados de usuários e controle de acesso, a arquitetura foi pensada sob os três pilares:

### Confidencialidade

- Uso de Context API para gerenciar o estado de autenticação de forma privada.
- Implementação de PrivateRoutes para impedir acesso não autorizado a endpoints sensíveis via URL.

### Integridade

- Validação de esquemas de dados no Front-end antes do envio à API.
- Garantia de que inputs de formulários sejam sanitizados e validados.

### Disponibilidade

- Tratamento de erros e estados de carregamento (Skeletons/Spinners).
- Resiliência da interface em caso de falhas na comunicação com o servidor.

## 🕒 Lógica de Negócio

A aplicação utiliza uma lógica centralizada para determinar qual refeição exibir na tela `CardapioProximo.jsx`, garantindo que o usuário sempre veja a informação mais relevante para o momento atual do dia.

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/CARDAPIO-IFRS-FRONT.git

# Acesse a pasta do projeto
cd CARDAPIO-IFRS-FRONT

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

---

> **Nota:** Este projeto é desenvolvido com foco em *Security by Design*, aplicando conhecimentos de defesa cibernética no desenvolvimento Front-end.
