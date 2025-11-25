const fs = require('fs');
const path = require('path');

// Function to read JSON files from public/json directory
function readJSONFile(filename) {
  try {
    // In Netlify, files from /public are served at the root
    // Try multiple path strategies for compatibility
    const possiblePaths = [
      path.join(__dirname, '..', '..', 'public', 'json', filename),
      path.join(process.env.LAMBDA_TASK_ROOT || __dirname, '..', '..', 'public', 'json', filename),
      `/var/task/public/json/${filename}`,
      `./public/json/${filename}`
    ];
    
    for (const filePath of possiblePaths) {
      console.log(`Attempting to read: ${filePath}`);
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        console.log(`Successfully read from: ${filePath}`);
        return JSON.parse(content);
      } catch (e) {
        console.log(`Path ${filePath} failed, trying next...`);
        continue;
      }
    }
    
    // If all paths fail, log and return null
    console.error(`Error reading ${filename}: All paths exhausted`);
    return null;
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
    console.log(`LAMBDA_TASK_ROOT: ${process.env.LAMBDA_TASK_ROOT}`);
    console.log(`__dirname: ${__dirname}`);
    
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
          filesLoaded: scripts.length,
          taskRoot: process.env.LAMBDA_TASK_ROOT,
          dirname: __dirname
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
