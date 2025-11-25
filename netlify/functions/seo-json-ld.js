const fs = require('fs');
const path = require('path');

// Map of JSON files by page
const jsonMaps = {
  inicio: [
    'person-sergio.json',
    'localbusiness-sergio.json'
  ],
  sobre: [
    'person-sergio.json'
  ],
  psicologia: [
    'service-psicologia-clinica-sergio.json'
  ],
  orientacao: [
    'service-orientacao-profissional-sergio.json'
  ]
};

// Function to read JSON files
function readJSONFile(filename) {
  try {
    // Try to read from /public/json/ directory
    const publicPath = path.join(__dirname, '..', '..', 'public', 'json', filename);
    const content = fs.readFileSync(publicPath, 'utf-8');
    return JSON.parse(content);
  } catch (e) {
    console.error(`Could not read ${filename} from /public/json/: ${e.message}`);
    return null;
  }
}

exports.handler = async (event) => {
  try {
    const page = event.queryStringParameters?.page || 'inicio';
    const files = jsonMaps[page] || jsonMaps.inicio;
    
    console.log(`Processing page: ${page}, files:`, files);
    
    const scripts = [];
    for (const filename of files) {
      const jsonData = readJSONFile(filename);
      if (jsonData) {
        scripts.push(`<script type="application/ld+json">${JSON.stringify(jsonData)}</script>`);
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
          filesRequested: files,
          filesLoaded: scripts.length
        }
      })
    };
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message })
    };
  }
};
