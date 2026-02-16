# 📁 Estrutura do Projeto Nexus Frontend

## Organização de Pastas

```
nexus-frontend/
├── app/                          # 🎯 Next.js App Router
│   ├── layout.tsx               # Layout raiz da aplicação
│   ├── page.tsx                 # Página inicial
│   ├── ativos/                  # Rota: /ativos
│   ├── categorias/              # Rota: /categorias
│   ├── dashboard/               # Rota: /dashboard
│   ├── funcionarios/            # Rota: /funcionarios
│   ├── historico/               # Rota: /historico
│   ├── login/                   # Rota: /login
│   └── softwares/               # Rota: /softwares
│
├── components/                   # 🧩 Componentes React reutilizáveis
│   ├── navigation/               # Navegação (Header, Menu)
│   │   ├── Header.tsx          # Componente de cabeçalho
│   │   ├── Menu.tsx            # Componente de menu/sidebar
│   │   └── index.ts            # Exportações
│   ├── ui/                      # Componentes básicos (Button, Input)
│   │   ├── Button.tsx          # Componente de botão
│   │   ├── Input.tsx           # Componente de input
│   │   └── index.ts            # Exportações
│   ├── forms/                   # Componentes de formulários
│   │   ├── LoginForm.tsx        # Formulário de login
│   │   └── index.ts            # Exportações
│   ├── assets/                  # Componentes de ativos
│   ├── employees/               # Componentes de funcionários
│   ├── categories/              # Componentes de categorias
│   ├── softwares/               # Componentes de softwares
│   ├── asset-history/           # Componentes de histórico
│   ├── users/                   # Componentes de usuários
│   ├── images/                  # Componentes de imagens
│   └── dashboard/               # Componentes do dashboard
│
├── context/                      # 🎭 React Context API
│   └── AuthContext.tsx          # Contexto de autenticação
│
├── hooks/                        # 🪝 Custom React Hooks
│   └── verifyLogin.tsx          # Hook de verificação de login
│
├── types/                        # 📝 Tipos TypeScript
│   └── index.ts                 # Tipos e interfaces do projeto
│
├── constants/                    # 🔧 Constantes da aplicação
│   └── api.ts                   # URLs e endpoints de API
│
├── styles/                       # 🎨 Arquivos CSS globais
│   └── global.css
│
├── public/                       # 📦 Arquivos estáticos
│
├── utils/                        # (Considere renomear para lib/)
│
├── .env.example                  # 📋 Template de variáveis
├── .env.local                    # Variables locais (não commitar)
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
└── README.md

```
