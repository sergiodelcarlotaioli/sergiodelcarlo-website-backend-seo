// Import JSON files directly - Netlify bundler will include them
const personSergio = require('./json/person-sergio.json');
const localbusinessSergio = require('./json/localbusiness-sergio.json');
const servicePsicologia = require('./json/service-psicologia-clinica-sergio.json');
const serviceOrientacao = require('./json/service-orientacao-profissional-sergio.json');
const faqSergio = require('./json/faq-sergio.json');

// Map of JSON data by page
const jsonMaps = {
  inicio: [personSergio, localbusinessSergio],
  sobre: [personSergio],
  psicologia: [servicePsicologia],
  orientacao: [serviceOrientacao],
  faq: [faqSergio]
};

exports.handler = async (event) => {
  try {
    const page = event.queryStringParameters?.page || 'inicio';
    const jsonDataArray = jsonMaps[page] || jsonMaps.inicio;
    
    // Generate script tags
    const scripts = jsonDataArray.map(jsonData => 
      `<script type="application/ld+json">${JSON.stringify(jsonData)}</script>`
    );
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
        success: true,
        scripts: scripts,
        pageSchemas: scripts.join('\n'),
        debug: { 
          page, 
          filesLoaded: scripts.length,
          timestamp: new Date().toISOString()
        }
      })
    };
  } catch (error) {
    console.error('[SEO-JSON-LD] Function error:', error);
    return {
      statusCode: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        success: false,
        error: error.message,
        stack: error.stack
      })
    };
  }
};
