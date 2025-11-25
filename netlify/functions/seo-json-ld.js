const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Função para buscar JSON do GitHub
async function fetchJSON(url) {
  try {
    const response = await fetch(url);
         const token = process.env.GITHUB_TOKEN || '';
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}, { headers: { 'Authorization': `token ${token}` } });
    return await response.json();
  } catch (error) {
    console.error(`Erro ao buscar ${url}:`, error);
    return null;
  }
}

// Mapa de URLs de JSONs por página
const jsonMaps = {
  inicio: [
    'https://raw.githubusercontent.com/sergiodelcarlotaioli/sergiodelcarlo-website-backend-seo/main/person-sergio.json',
    'https://raw.githubusercontent.com/sergiodelcarlotaioli/sergiodelcarlo-website-backend-seo/main/localbusiness-sergio.json'
  ],
  sobre: [
    'https://raw.githubusercontent.com/sergiodelcarlotaioli/sergiodelcarlo-website-backend-seo/main/person-sergio.json'
  ],
  psicologia: [
    'https://raw.githubusercontent.com/sergiodelcarlotaioli/sergiodelcarlo-website-backend-seo/main/service-psicologia-clinica-sergio.json'
  ],
  orientacao: [
    'https://raw.githubusercontent.com/sergiodelcarlotaioli/sergiodelcarlo-website-backend-seo/main/service-orientacao-profissional-sergio.json'
  ]
};

exports.handler = async (event) => {
  try {
    const page = event.queryStringParameters?.page || 'inicio';
    const urls = jsonMaps[page] || jsonMaps.inicio;
    
    const scripts = [];
    for (const url of urls) {
      const json = await fetchJSON(url);
      if (json) {
        scripts.push(`<script type="application/ld+json">${JSON.stringify(json)}</script>`);
      }
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        scripts: scripts,
        pageSchemas: scripts.join('\n')
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message })
    };
  }
};
