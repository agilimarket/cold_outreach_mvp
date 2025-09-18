# Gerador de Mensagens Cold Outreach para Lojas de Moda (MVP)

Este projeto é um MVP (Produto Mínimo Viável) de um gerador de mensagens de cold outreach, focado em lojas de moda. Ele utiliza um backend Flask para coletar metadados de sites e links de redes sociais de URLs fornecidas, e um frontend simples em HTML, CSS e JavaScript para interação do usuário. Os dados coletados são usados para gerar mensagens de cold outreach personalizadas e um arquivo CSV com as informações analisadas.

## Funcionalidades

- Coleta de título, descrição, palavras-chave e imagem Open Graph de sites.
- Extração de links para Instagram, Facebook, Twitter, LinkedIn, YouTube e TikTok.
- Análise simplificada de oportunidades e conquistas de marketing digital.
- Geração de mensagens de cold outreach personalizadas.
- Exportação dos resultados para um arquivo CSV.

## Estrutura do Projeto

```
cold_outreach_mvp/
├── venv/                 # Ambiente virtual Python
├── app.py                # Backend Flask
├── index.html            # Frontend HTML
├── script.js             # Frontend JavaScript
├── styles.css            # Frontend CSS
└── README.md             # Este arquivo
```

## Como Configurar e Executar

Siga os passos abaixo para configurar e executar o projeto em seu ambiente local.

### Pré-requisitos

- Python 3.8 ou superior
- `pip` (gerenciador de pacotes do Python)
- `git` (opcional, para clonar o repositório)

### Passos

1.  **Clone o repositório (se aplicável) ou crie o diretório:**

    ```bash
    mkdir cold_outreach_mvp
    cd cold_outreach_mvp
    ```

2.  **Crie e ative um ambiente virtual:**

    É altamente recomendável usar um ambiente virtual para isolar as dependências do projeto.

    ```bash
    python3.11 -m venv venv
    source venv/bin/activate  # No Windows, use `venv\Scripts\activate`
    ```

3.  **Instale as dependências:**

    ```bash
    pip install Flask requests beautifulsoup4 metadata-parser extract-social-media lxml html-to-etree six tldextract requests-toolbelt w3lib
    ```

    *Nota: Se você encontrar erros de compilação relacionados a `cchardet`, pode ser necessário instalar ferramentas de desenvolvimento C/C++ (por exemplo, `sudo apt-get install build-essential python3.11-dev` no Ubuntu) ou tentar instalar sem `cchardet` se não for estritamente necessário para sua plataforma (`pip install ... --no-binary cchardet`). No entanto, as dependências listadas acima devem ser suficientes.* 

4.  **Copie os arquivos do projeto:**

    Certifique-se de que `app.py`, `index.html`, `script.js` e `styles.css` estejam no diretório `cold_outreach_mvp/`.

5.  **Inicie o servidor Flask:**

    ```bash
    source venv/bin/activate
    python app.py
    ```

    O servidor será iniciado e estará acessível em `http://127.0.0.1:5000` (ou outro endereço IP local, como `http://169.254.0.21:5000`).

6.  **Acesse a interface do usuário:**

    Abra seu navegador e navegue para `http://127.0.0.1:5000/`.

7.  **Use a ferramenta:**

    Na interface, insira as URLs das lojas (uma por linha) e clique em "Analisar e Gerar CSV". Um arquivo CSV será baixado com os resultados da análise e as mensagens de cold outreach geradas.

## Próximos Passos e Melhorias Potenciais

-   **Integração com APIs de Visibilidade:** Substituir os dados simulados de tráfego e SEO por dados reais de APIs como SimilarWeb, Ahrefs, Moz, etc.
-   **Extração de Contato Real:** Implementar lógica para tentar extrair nomes de contato reais dos sites.
-   **Análise de Sentimento/Tom:** Adicionar análise de sentimento para refinar as mensagens de cold outreach.
-   **Persistência de Dados:** Salvar os resultados em um banco de dados para acompanhamento e análise futura.
-   **Autenticação e Usuários:** Adicionar um sistema de autenticação para gerenciar usuários e suas análises.
-   **Interface do Usuário Aprimorada:** Melhorar a UI/UX com feedback mais detalhado durante o processamento, visualizações de dados e opções de filtragem.
-   **Otimização de Performance:** Melhorar a performance da coleta de dados para processar um grande volume de URLs mais rapidamente (ex: processamento assíncrono, filas de tarefas).
-   **Dockerização:** Empacotar a aplicação em um contêiner Docker para facilitar a implantação.

---

Desenvolvido por Manus AI.

