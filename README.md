# 🎮 Discord Matchmaking Bot (`discord-matchmaking-bot`)

> Sistema automatizado e modular de alta performance desenvolvido para gestão de torneios, matchmaking competitivo e mediação de partidas de Free Fire no Discord.

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![Discord.js](https://img.shields.io/badge/Discord.js-v14-blue.svg)](https://discord.js.org/)
[![Architecture](https://img.shields.io/badge/Architecture-Event--Driven-orange.svg)](#arquitetura)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

---

## 📌 Visão Geral

O **Discord Matchmaking Bot** é uma solução completa em nível de produção voltada para comunidades competitivas de eSports (Free Fire). Construído com foco em escalabilidade, integridade de dados e baixa latência, o bot orquestra desde a entrada de competidores em filas inteligentes até a criação automatizada de salas privadas de duelo, auditoria anti-trapaça (anti-cheat) e confirmações de transações via PIX.

---

## 🏗️ Arquitetura e Engenharia de Software

O projeto adota os princípios de **Event-Driven Architecture (EDA)** implementados sobre a Discord.js v14:

```
[ Usuário / Jogador ]
        │  (Interação: Slash Command / Button / Modal)
        ▼
[ Discord Gateway / API ]
        │
        ▼
[ Client Event Router (index.js) ]
   ├── events/interactionCreate.js
   ├── events/filaMatchmaker.js ─────► [ Gerenciador de Filas ]
   ├── events/matchRoomCreator.js ───► [ Provisionador de Canais ]
   ├── events/analistaModalHandler.js► [ Auditoria & Anti-Cheat ]
   └── events/apostaGoPix.js ────────► [ Integração API PIX ]
```

### Destaques Técnicos:
1. **Matchmaking Inteligente de Filas:** Gerenciamento de estado de filas 1v1, Misto e Normal, garantindo pareamento concorrente sem race conditions e verificação de elegibilidade em tempo real.
2. **Provisionamento Dinâmico de Infraestrutura:** Criação sob demanda de canais temporários de voz e texto com controle estrito de permissões granulares (`PermissionOverwrites`), isolando competidores e mediadores autorizados.
3. **Módulo de Análise e Anti-Cheat:** Fluxo de denúncia e inspeção com transições de estado (Pendente -> Assumido -> Auditado), desacoplado em listeners dedicados de modal para evitar vazamento de memória (*memory leaks*).
4. **Integração Financeira com PIX Dinâmico:** Captura automatizada de requisições de pagamento em canais específicos, integrando-se via Axios com API de QR Code PIX dinâmico com payload padronizado e retorno direto no chat.

---

## 📂 Estrutura do Projeto

```plaintext
├── commands/               # Definição e execução de Slash Commands (v14)
│   ├── analista.js         # Comando de despacho de análise técnica de jogadores
│   ├── blacklist.js        # Gestão de jogadores banidos por trapaça
│   ├── filas.js            # Painel de inicialização de filas competitivas
│   ├── panel.js            # Painel central interativo para a administração
│   └── ...
├── events/                 # Listeners orientados a eventos (EDA)
│   ├── analistaModalHandler.js # Listener isolado para submissões de modais
│   ├── apostaGoPix.js      # Integração e geração de QR Code PIX
│   ├── filaMatchmaker.js   # Algoritmo de processamento e pareamento de filas
│   ├── matchRoomCreator.js # Criação dinâmica de salas e permissões
│   └── ...
├── DataBaseJson/           # Armazenamento e persistência de dados estruturados
├── config.json             # Credenciais e IDs de configuração base
├── .env.example            # Template de variáveis de ambiente
├── index.js                # Bootstrap da aplicação e carregamento de módulos
└── package.json            # Metadados e dependências do projeto
```

---

## 🚀 Guia de Configuração e Instalação

### Pré-requisitos
- **Node.js**: versão 18.x ou superior
- **NPM** ou **Yarn**
- Uma aplicação criada no [Discord Developer Portal](https://discord.com/developers/applications)

### 1. Clonagem e Dependências
```bash
git clone https://github.com/Renato-Aranega/discord-matchmaking-bot.git
cd discord-matchmaking-bot
npm install
```

### 2. Variáveis de Ambiente e Configuração
Copie o arquivo de exemplo de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` (ou `config.json`) com os dados da sua aplicação:
```env
DISCORD_TOKEN=seu_discord_bot_token_aqui
CLIENT_ID=seu_client_id_aqui
OWNER_ID=seu_user_id_aqui
PREFIX=!
```

No `config.json`, assegure-se de manter a sintaxe JSON válida:
```json
{
  "token": "SEU_BOT_TOKEN",
  "clientId": "SEU_CLIENT_ID",
  "ownerId": "SEU_OWNER_ID",
  "prefix": "!"
}
```

### 3. Registro de Comandos e Inicialização
```bash
# Iniciar o bot
node index.js
```

---

## 🛡️ Boas Práticas e Resolução de Problemas
- **Eliminação de Memory Leaks**: Event listeners voláteis não devem ser encapsulados dentro de loops ou métodos `execute` de comandos. Todo modal e interação secundária possui listener próprio registrado no bootstrap.
- **Validação de Permissões**: Verificações granulares de roles antes de conceder acesso aos modais de banimento ou canais de partida.

---

## 👤 Autor
Desenvolvido por **[Renato Barbosa Aranega](https://github.com/Renato-Aranega)**.