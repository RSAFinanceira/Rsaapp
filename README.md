# RSA Cred - Gerenciador de Leads

Sistema de gerenciamento de leads desenvolvido em React + TypeScript + Vite.

## 🚀 Deploy na Vercel

### Configurações Obrigatórias:

1. **Root Directory**: `project`
2. **Build Command**: `npm run build`
3. **Output Directory**: `dist`
4. **Install Command**: `npm install`

### Estrutura do Projeto:
```
Gerenciador de leads/
├── project/           # ← Pasta principal do projeto
│   ├── package.json   # Dependências do projeto
│   ├── src/          # Código fonte
│   ├── dist/         # Build de produção
│   └── vercel.json   # Configuração da Vercel
└── README.md
```

### Como fazer o deploy:

1. Acesse [vercel.com](https://vercel.com)
2. Importe o repositório `wandersonmk/rsacred`
3. **IMPORTANTE**: Configure o Root Directory como `project`
4. Deploy Command: `npm run build`
5. Output Directory: `dist`
6. Clique em "Deploy"

## 🛠️ Desenvolvimento Local

```bash
# Na raiz do projeto
npm run dev

# Ou dentro da pasta project
cd project
npm run dev
```

## 📦 Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build de produção
- `npm run preview` - Preview do build

## 🏗️ Tecnologias

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide React (ícones) 