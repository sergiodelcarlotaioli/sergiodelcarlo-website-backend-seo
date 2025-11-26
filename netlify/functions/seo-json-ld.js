// Netlify Function para servir JSON-LD estruturados para SEO
// Dados inline para evitar problemas com filesystem do Lambda

const schemaData = {
  person: {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://sergiodelcarlosite.wixstudio.com/psicologo#person-sergio",
    "name": "Sergio Del Carlo Taioli",
    "alternateName": "Sergio Del Carlo",
    "givenName": "Sergio",
    "familyName": "Del Carlo",
    "honorificPrefix": "Dr.",
    "birthDate": "1956-04-03",
    "birthPlace": { "@type": "City", "name": "São Paulo, Brasil" },
    "jobTitle": "Psicólogo Clínico Especializado em Terapia Profunda, Psicodrama e Orientação Profissional Integral",
    "description": "Psicólogo clínico com 38 anos de experiência (desde 1986) em Psicologia Analítica Junguiana, Psicodrama, Psicoterapia Existencial e Psicoantropologia Cultural. Mestre em Educação pela Universidade de São Paulo (2006). Especialista em abordagem integrativa que combina diferentes saberes para criar atendimento verdadeiramente singular e transformador.",
    "url": "https://sergiodelcarlosite.wixstudio.com/psicologo",
    "email": "sergio.delcarlo@yahoo.com.br",
    "telephone": "+55 11 99964-4395",
    "image": { "@type": "ImageObject", "url": "https://sergiodelcarlosite.wixstudio.com/images/sergio-profile-professional.jpg", "width": 800, "height": 800 },
    "sameAs": ["https://www.instagram.com/sergio_taioli"],
    "alumniOf": { "@type": "EducationalOrganization", "name": "Universidade de São Paulo - USP" },
    "hasCredential": [{ "@type": "EducationalOccupationalCredential", "credentialCategory": "degree", "name": "Mestrado em Educação" }]
  },
  localbusiness: {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://sergiodelcarlosite.wixstudio.com#localbusiness",
    "name": "Sergio Del Carlo - Psicólogo Clínico",
    "description": "Consultório de psicologia clínica com 38 anos de experiência em São Paulo",
    "url": "https://sergiodelcarlosite.wixstudio.com/psicologo",
    "telephone": "+55 11 99964-4395",
    "email": "sergio.delcarlo@yahoo.com.br",
    "areaServed": "São Paulo, Brasil",
    "address": { "@type": "PostalAddress", "addressLocality": "São Paulo", "addressCountry": "BR" },
    "priceRange": "R$150 - R$300",
    "image": "https://sergiodelcarlosite.wixstudio.com/images/consultorio.jpg"
  },
  servicePsicologia: {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Psicologia Clínica",
    "description": "Atendimento em Psicologia Clínica com enfoque em Psicologia Analítica, Psicodrama e abordagem integrativa",
    "url": "https://sergiodelcarlosite.wixstudio.com/servicos/psicologia-clinica",
    "provider": { "@type": "Person", "name": "Sergio Del Carlo Taioli" },
    "areaServed": "São Paulo, Brasil",
    "image": "https://sergiodelcarlosite.wixstudio.com/images/psicologia-clinica.jpg"
  },
  serviceOrientacao: {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Orientação Profissional",
    "description": "Orientação profissional integral para profissionais em transição de carreira e executivos em busca de autoconhecimento",
    "url": "https://sergiodelcarlosite.wixstudio.com/servicos/orientacao-profissional",
    "provider": { "@type": "Person", "name": "Sergio Del Carlo Taioli" },
    "areaServed": "São Paulo, Brasil",
    "image": "https://sergiodelcarlosite.wixstudio.com/images/orientacao-profissional.jpg"
  },
  faq: {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      { "@type": "Question", "name": "Qual é sua especialidade?", "acceptedAnswer": { "@type": "Answer", "text": "Especialista em Psicologia Clínica com enfoque em Psicologia Analítica Junguiana, Psicodrama e abordagens integrativas" } },
      { "@type": "Question", "name": "Quantos anos de experiência você tem?", "acceptedAnswer": { "@type": "Answer", "text": "38 anos de experiência desde 1986 em prática clínica" } },
      { "@type": "Question", "name": "Você oferece orientação de carreira?", "acceptedAnswer": { "@type": "Answer", "text": "Sim, ofereço orientação profissional integral para profissionais em transição" } }
    ]
  }
};

const pageSchemaMap = {
  inicio: ['localbusiness', 'person'],
  sobre: ['person'],
  psicologia: ['servicePsicologia'],
  orientacao: ['serviceOrientacao'],
  faq: ['faq']
};

exports.handler = async (event) => {
  try {
    const page = (event.queryStringParameters?.page || 'inicio').toLowerCase();
    const schemaKeys = pageSchemaMap[page] || pageSchemaMap.inicio;
    
    const scripts = schemaKeys.map(key => {
      const data = schemaData[key];
      return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=3600'
      },
      body: JSON.stringify({
        success: true,
        page: page,
        scripts: scripts,
        pageSchemas: scripts.join('\n'),
        filesLoaded: scripts.length,
        timestamp: new Date().toISOString()
      })
    };
  } catch (error) {
    console.error('[SEO-JSON-LD] Erro:', error.message);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};

// Handle OPTIONS requests (CORS preflight)
exports.handler.OPTIONS = async () => {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  };
};
