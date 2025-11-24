***

# sergiodelcarlo-website-backend-seo

**Repositório para dados estruturados de SEO (JSON-LD) e documentação técnica do site profissional de psicologia clínica de Sergio Del Carlo. Todos os esquemas seguem práticas avançadas de SEO, Google Maps, busca por voz e conformidade para integrações futuras.**

## Objetivo

Centralizar os arquivos de schemas JSON-LD utilizados para otimizar SEO, indexação inteligente, presença em Google Maps, Voice Search e garantir conformidade técnica para o site do psicólogo Sergio Del Carlo.

## Conteúdo do repositório

- Schemas completos em arquivos `.json`:
  - `localbusiness-sergio.json` (Início)
  - `person-sergio.json` (Início/Sobre mim)
  - `service-clinica.json` (Serviço de Psicologia Clínica)
  - `service-orientacao.json` (Serviço de Orientação Profissional)
  - `faq-completo.json` (Perguntas Frequentes, se aplicável)
  - `article-tapecaria.json` (Artigos/blog, se aplicável)
- Documentação sobre estrutura, integração e manutenção técnica.

## Stack e fluxos utilizados

- **VS Code**: Criação, validação e revisão dos arquivos JSON-LD.
- **Google Docs**: Manual dos schemas, histórico de decisões e controle de versões.
- **GitHub**: Versionamento, backup e disponibilização dos arquivos para integração backend.
- **Strapi (opcional)**: Gerenciamento dos schemas via API, facilitando futuras automações.
- **Velo by Wix**: Injeção dinâmica dos JSON-LD nas páginas via código/fetch no backend do site.
- **Wix Studio**: Frontend do site, integrado aos dados estruturados.

**Fluxograma da stack SEO avançado**
Fluxograma ilustrando todo o percurso dos dados estruturados do SEO até o algoritmo Google/IA:
<img width="8173" height="2604" alt="Frame 13 (1)" src="https://github.com/user-attachments/assets/b29c95aa-660c-4370-bc6b-cfdb9531236f" />


## Instruções de integração ao Wix/Backend

1. Armazene cada arquivo JSON neste repositório.
2. Utilize URLs do GitHub (`raw.githubusercontent.com/`) para integrar via fetch no backend do site Wix.
3. Implemente scripts JavaScript em Velo by Wix para consumir e injetar os dados na página usando `<script type="application/ld+json">`.
4. Sempre validar as atualizações usando [Google Rich Results Test](https://search.google.com/test/rich-results).

## Atualização e manutenção

- Toda edição ou adição de campos, FAQs ou artigos deve ser feita neste ambiente, facilitando versionamento e colaboração futura por outros profissionais.

## Documentação complementar

- Para detalhes completos sobre cada schema, finalidade, campos utilizados e exemplos de integrações, consulte o documento central do projeto disponível no Google Docs (link privado).

***

**Contato para transferência, dúvidas técnicas ou manutenção futura:**
Luana Gonçalves
lugonc.lga@gmail.com
(11) 98395-2879

***
