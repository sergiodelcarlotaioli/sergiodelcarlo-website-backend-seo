# Guia de Setup: JSON-LD com Netlify Functions e Wix Studio

## 📋 Overview

Este guia descreve como configurar o sistema de **JSON-LD via SSR (Server-Side Rendering)** usando Netlify Functions e Wix Studio para garantir que o Google capture corretamente os dados estruturados.

## ⚠️ Problema Original

- Wix tem limite de 8000 caracteres para código customizado
- JSON-LD via `fetch()` no cliente **não é capturado pelo Googlebot**
- Solução: Renderizar JSON-LD no servidor (Netlify) para que seja visível na primeira requisição

## ✅ Solução Implementada

### Arquitetura:
```
Wix Página → Netlify Function (SSR) → JSON-LD Renderizado → Google Bots
```

## 🚀 Passo a Passo de Setup

### 1. Criar conta no Netlify

- Acesse: https://www.netlify.com
- Clique em "Sign up"
- Conecte com sua conta do GitHub

### 2. Fazer fork/clone deste repositório

```bash
git clone https://github.com/sergiodelcarlotaioli/sergiodelcarlo-website-backend-seo.git
cd sergiodelcarlo-website-backend-seo
```

### 3. Conectar repositório ao Netlify

1. No Netlify Dashboard, clique em "Add new site"
2. Selecione "Import an existing project"
3. Escolha "GitHub"
4. Autorize o Netlify
5. Selecione o repositório `sergiodelcarlo-website-backend-seo`
6. Clique em "Deploy"

### 4. Configurar Netlify.toml (opcional)

Crie um arquivo `netlify.toml` na raiz do repositório:

```toml
[build]
  functions = "netlify/functions"
  
[functions]
  node_bundler = "esbuild"
```

### 5. Deploy automático

Netlify fará deploy automaticamente quando você fizer push para o `main`.

### 6. Copiar URL do Netlify

Após o deploy, você terá uma URL como:
```
https://seu-site-123456.netlify.app
```

## 📍 Integração com Wix Studio

### 1. No Wix Studio - Página Início

Acesse o backend (Velo) e atualize o código:

```javascript
$w.onReady(async function () {
  try {
    const page = 'inicio';
    const response = await fetch(
      `https://SEU_SITE.netlify.app/.netlify/functions/seo-json-ld?page=${page}`
    );
    
    const data = await response.json();
    
    if (data.scripts && Array.isArray(data.scripts)) {
      data.scripts.forEach(scriptHTML => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(scriptHTML, 'text/html');
        const script = doc.querySelector('script');
        if (script) {
          document.head.appendChild(script);
        }
      });
    }
  } catch (error) {
    console.error('Erro ao carregar JSON-LD:', error);
  }
});
```

### 2. Substituir "SEU_SITE.netlify.app"

Substituir pela URL real do seu Netlify (ex: `https://psico-seo-ld.netlify.app`)

### 3. Ajustar valor `page` por página Wix:

- **Página Início**: `page = 'inicio'` → Carrega Person + LocalBusiness
- **Página Sobre mim**: `page = 'sobre'` → Carrega Person
- **Página Psicologia Clínica**: `page = 'psicologia'` → Carrega Service (Psicologia)
- **Página Orientação**: `page = 'orientacao'` → Carrega Service (Orientação)

### 4. Publicar e testar

## 🔍 Validação

### Teste 1: Ver Código-Fonte

1. Acesse o site: `https://seu-site.wixstudio.com`
2. Clique com botão direito → "Ver código-fonte"
3. Procure por `<script type="application/ld+json">`
4. Deve aparecer com os dados estruturados!

### Teste 2: Google Rich Results

1. Acesse: https://search.google.com/test/rich-results
2. Cole a URL do seu site
3. Clique em "Testar"
4. Deve aparecer os Schemas reconhecidos (Person, LocalBusiness, Service)

## 🔧 Troubleshooting

### Erro: "Function not found"

- Verifique se o arquivo está em `netlify/functions/seo-json-ld.js`
- Faça um novo deploy no Netlify

### Erro: CORS

- A função retorna `'Access-Control-Allow-Origin': '*'`
- Se ainda houver problema, atualize o header no arquivo da função

### JSON-LD não aparece

- Verifique se a URL do Netlify está correta
- Confira se o valor `page` matches os mapeamentos da função
- Veja console do navegador (F12) para erros

## 📚 Arquivos Importantes

- `netlify/functions/seo-json-ld.js` - Função que renderiza JSON-LD
- Arquivos JSON: `*.json` - Schemas estruturados
- `SETUP-NETLIFY-SEO.md` - Este arquivo

## 🎯 Próximos Passos

1. ✅ Setup Netlify
2. ✅ Deploy função
3. ✅ Integrar com Wix
4. ✅ Validar com Google
5. 📌 Monitorar performance

## 📞 Suporte

Para dúvidas, abra uma issue neste repositório.

---

**Criado em**: Nov 25, 2025
**Última atualização**: Nov 25, 2025
