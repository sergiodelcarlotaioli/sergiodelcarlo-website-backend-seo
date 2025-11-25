const fs = require('fs');
const path = require('path');

// Function to read JSON files from public/json directory
function readJSONFile(filename) {
  try {
    // Use relative path from function location
    const filePath = path.join(__dirname, '..', '..', 'public', 'json', filename);
    console.log(`Attempting to read: ${filePath}`);
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error.message);
    return null;
  }
}

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

exports.handler = async (event) => {
  try {
    const page = event.queryStringParameters?.page || 'inicio';
    const files = jsonMaps[page] || jsonMaps.inicio;
    
    console.log(`Processing page: ${page}, files:`, files);
    
    const scripts = [];
    for (const filename of files) {
      const json = readJSONFile(filename);
      if (json) {
        scripts.push(`<script type="application/ld+json">${JSON.stringify(json)}</script>`);
      } else {
        console.warn(`Failed to load ${filename}`);
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
      body: JSON.stringify({ error: error.message, stack: error.stack })
    };
  }
};
