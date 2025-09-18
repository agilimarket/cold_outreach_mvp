### Fase 1: Pesquisa de APIs e bibliotecas para web scraping
- [x] Pesquisar APIs públicas para metadados de sites (título, descrição, etc.).
- [x] Pesquisar bibliotecas Python para extração de links de redes sociais.

### Fase 2: Configuração do ambiente Python e Flask
- [x] Criar um diretório para o projeto Flask.
- [x] Configurar um ambiente virtual Python.
- [x] Instalar Flask, requests, beautifulsoup4, metadata-parser, extract-social-media e outras dependências.
- [x] Copiar os arquivos HTML, CSS e JS originais para o diretório do projeto.

### Fase 3: Desenvolvimento do script Python para coleta de dados
- [x] Criar o arquivo `app.py` com a estrutura básica do Flask.
- [x] Implementar a função `get_social_media_links` para extrair links de redes sociais.
- [x] Implementar a função `get_website_metadata` para extrair metadados do site.
- [x] Criar a rota `/analyze` no Flask para processar URLs e retornar os dados coletados.

### Fase 4: Adaptação do frontend (script.js) para interagir com o backend
- [x] Modificar a função `analyzeStore` no `script.js` para chamar a API do backend.
- [x] Atualizar a função `processUrl` para usar os dados retornados pelo backend.
- [x] Ajustar a função `generateMessage` para usar os novos campos de dados.
- [x] Modificar a função `generateCSV` para incluir os novos campos no CSV.
- [x] Modificar a função `showResults` para exibir os novos campos na pré-visualização.

### Fase 5: Adaptação da lógica de análise e geração de mensagens com dados reais
- [x] Refinar a lógica de análise no `app.py` para gerar conquistas e oportunidades mais detalhadas com base nos dados reais.
- [x] Aprimorar o template da mensagem de cold outreach no `app.py` para ser mais dinâmico e personalizado.

### Fase 6: Geração e validação do CSV com dados aprimorados
- [x] Testar o sistema com URLs reais para garantir que a coleta de dados e a geração do CSV funcionem corretamente.
- [x] Validar a estrutura e o conteúdo do arquivo CSV gerado.

### Fase 7: Entrega do Código e Instruções
- [ ] Preparar o código-fonte completo do projeto.
- [ ] Escrever instruções claras sobre como configurar e executar o projeto.
- [ ] Entregar o código e as instruções ao usuário.

