// Import JSON files directly - Netlify Functions can require JSON files
let personSergio, localBusinessSergio, servicePsicologia, serviceOrientacao, faqSergio;

try {
  personSergio = require('../public/json/person-sergio.json');
} catch (e) {
  console.error('Failed to load person-sergio.json:', e.message);
}

try {
  localBusinessSergio = require('../public/json/localbusiness-sergio.json');
} catch (e) {
  console.error('Failed to load localbusiness-sergio.json:', e.message);
}

try {
  servicePsicologia = require('../public/json/service-psicologia-clinica-sergio.json');
} catch (e) {
  console.error('Failed to load service-psicologia-clinica-sergio.json:', e.message);
}

try {
  serviceOrientacao = require('../public/json/service-orientacao-profissional-sergio.json');
} catch (e) {
  console.error('Failed to load service-orientacao-profissional-sergio.json:', e.message);
}

try {
  faqSergio = require('../public/json/faq-sergio.json');
} catch (e) {
  console.error('Failed to load faq-sergio.json:', e.message);
}

// Map of JSON objects by page
const jsonMaps = {
  inicio: [
    personSergio,
    localBusinessSergio
  ].filter(Boolean),
  sobre: [
    personSergio
  ].filter(Boolean),
  psicologia: [
    servicePsicologia
  ].filter(Boolean),
  orientacao: [
    serviceOrientacao
  ].filter(Boolean)
};

exports.handler = async (event) => {
  try {
    const page = event.queryStringParameters?.page || 'inicio';
    const jsonObjects = jsonMaps[page] || jsonMaps.inicio;
    
    console.log(`Processing page: ${page}`);
    console.log(`JSON objects available: ${jsonObjects.length}`);
    
    const scripts = [];
    for (const jsonObj of jsonObjects) {
      if (jsonObj) {
        scripts.push(`<script type="application/ld+json">${JSON.stringify(jsonObj)}</script>`);
      }
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: scripts.length > 0,
        scripts: scripts,
        pageSchemas: scripts.join('\n'),
        debug: {
          page: page,
          jsonObjectsLoaded: jsonObjects.length,
          scriptsGenerated: scripts.length
        }
      })
    };
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message, stack: error.stack })
    };
  }
};
