// Gerador de Mensagens de Cold Outreach para Lojas de Moda
class ColdOutreachGenerator {
    constructor() {
        this.processedUrls = [];
        this.ignoredUrls = [];
        this.isProcessing = false;
    }

    // Extrai o nome da loja a partir da URL
    extractStoreName(url) {
        try {
            // Remove protocolo
            let cleanUrl = url.replace(/^https?:\/\//, '');
            
            // Remove www.
            cleanUrl = cleanUrl.replace(/^www\./, '');
            
            // Se for Instagram, extrai o handle
            if (cleanUrl.includes('instagram.com/')) {
                const handle = cleanUrl.replace(/.*instagram\.com\//, '').split('/')[0];
                return handle;
            }
            
            // Para outros sites, pega apenas o domínio principal
            const domain = cleanUrl.split('/')[0].split('.')[0];
            return domain;
        } catch (error) {
            return null;
        }
    }

    // Valida se a URL é válida
    isValidUrl(url) {
        try {
            const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
            const instagramPattern = /^(https?:\/\/)?(www\.)?instagram\.com\/[\w\.]+\/?$/;
            
            return urlPattern.test(url) || instagramPattern.test(url);
        } catch (error) {
            return false;
        }
    }

    // A função analyzeStore será substituída pela chamada à API do backend
    async analyzeStore(url) {
        try {
            const response = await fetch('/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url: url })
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Erro ao analisar URL no backend:', error);
            return null;
        }
    }

    // Gera a mensagem personalizada
    generateMessage(analysis) {
        const template = `Oi, ${analysis.contact_person},

Nós da DataFashion Marketing notamos o trabalho de vocês em ${analysis.store_name}. ${analysis.conquista}

Identificamos que há uma grande oportunidade para ${analysis.oportunidade} Podemos ajudar a destravar esse potencial.

Que tal conversarmos por 15 minutos para mostrar como podemos impulsionar suas vendas online?

Agende aqui: calendly.com/datafashion/15min

Atenciosamente,
Equipe DataFashion Marketing
`;

        return template;
    }

    // Processa uma única URL
    async processUrl(url) {
        const trimmedUrl = url.trim();
        
        if (!trimmedUrl || !this.isValidUrl(trimmedUrl)) {
            this.ignoredUrls.push(trimmedUrl);
            return null;
        }

        const analysis = await this.analyzeStore(trimmedUrl);
        if (!analysis) {
            this.ignoredUrls.push(trimmedUrl);
            return null;
        }

        const message = this.generateMessage(analysis);

        const result = {
            url: trimmedUrl,
            store_name: analysis.store_name,
            contact_person: analysis.contact_person,
            title: analysis.title,
            description: analysis.description,
            keywords: analysis.keywords,
            og_image: analysis.og_image,
            instagram_link: analysis.instagram_link,
            facebook_link: analysis.facebook_link,
            twitter_link: analysis.twitter_link,
            linkedin_link: analysis.linkedin_link,
            youtube_link: analysis.youtube_link,
            tiktok_link: analysis.tiktok_link,
            estimated_traffic: analysis.estimated_traffic,
            seo_score: analysis.seo_score,
            has_blog: analysis.has_blog,
            conquista: analysis.conquista,
            oportunidade: analysis.oportunidade,
            cold_outreach_message: message
        };

        this.processedUrls.push(result);
        return result;
    }

    // Processa lista de URLs
    async processUrls(urlList) {
        this.processedUrls = [];
        this.ignoredUrls = [];
        this.isProcessing = true;

        const urls = urlList.split('\n').filter(url => url.trim());
        
        for (let i = 0; i < urls.length; i++) {
            this.processUrl(urls[i]);
            
            // Simula processamento assíncrono
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Atualiza progresso
            this.updateProgress(i + 1, urls.length);
        }

        this.isProcessing = false;
        return this.processedUrls;
    }

    // Atualiza o progresso na interface
    updateProgress(current, total) {
        const progressFill = document.querySelector('.progress-fill');
        const statusText = document.querySelector('.status-text');
        
        if (progressFill) {
            const percentage = (current / total) * 100;
            progressFill.style.width = `${percentage}%`;
        }
        
        if (statusText) {
            statusText.textContent = `Processando... ${current}/${total} URLs`;
        }
    }

    // Gera CSV
    generateCSV(data) {
        const headers = [
            'URL', 'Nome da Loja', 'Pessoa de Contato', 'Título do Site', 'Descrição do Site', 'Keywords do Site',
            'Imagem OG', 'Link Instagram', 'Link Facebook', 'Link Twitter', 'Link LinkedIn', 'Link YouTube', 'Link TikTok',
            'Tráfego Estimado', 'Score SEO', 'Tem Blog', 'Conquistas', 'Oportunidades', 'Mensagem Cold Outreach'
        ];
        const csvContent = [headers.join(',')];

        data.forEach(row => {
            const csvRow = [
                `"${row.url}"`,
                `"${row.store_name || ''}"`,
                `"${row.contact_person || ''}"`,
                `"${row.title || ''}"`,
                `"${row.description ? row.description.replace(/"/g, '""') : ''}"`,
                `"${row.keywords || ''}"`,
                `"${row.og_image || ''}"`,
                `"${row.instagram_link || ''}"`,
                `"${row.facebook_link || ''}"`,
                `"${row.twitter_link || ''}"`,
                `"${row.linkedin_link || ''}"`,
                `"${row.youtube_link || ''}"`,
                `"${row.tiktok_link || ''}"`,
                `"${row.estimated_traffic || ''}"`,
                `"${row.seo_score || ''}"`,
                `"${row.has_blog || ''}"`,
                `"${row.conquista ? row.conquista.replace(/"/g, '""') : ''}"`,
                `"${row.oportunidade ? row.oportunidade.replace(/"/g, '""') : ''}"`,
                `"${row.cold_outreach_message ? row.cold_outreach_message.replace(/"/g, '""').replace(/\n/g, '\\n') : ''}"`
            ];
            csvContent.push(csvRow.join(','));
        });

        return csvContent.join('\n');
    }

    // Faz download do CSV
    downloadCSV(csvContent) {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'mensagens_prospeccao.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    // Retorna estatísticas do processamento
    getStats() {
        return {
            processed: this.processedUrls.length,
            ignored: this.ignoredUrls.length,
            total: this.processedUrls.length + this.ignoredUrls.length
        };
    }
}

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    const generator = new ColdOutreachGenerator();
    const urlInput = document.getElementById('urls-input');
    const processBtn = document.getElementById('generate-btn');
    const statusDiv = document.getElementById('status-display');
    const progressContainer = document.getElementById('progress-bar');
    const resultContainer = document.getElementById('results-section');

    // Event listener para o botão de processar
    processBtn.addEventListener('click', async function() {
        const urls = urlInput.value.trim();
        
        if (!urls) {
            showStatus('Por favor, insira pelo menos uma URL.', 'error');
            return;
        }

        // Desabilita o botão e mostra progresso
        processBtn.disabled = true;
        processBtn.textContent = 'Processando...';
        progressContainer.classList.remove('hidden');
        resultContainer.classList.add('hidden');
        
        try {
            // Processa as URLs
            const results = await generator.processUrls(urls);
            const stats = generator.getStats();
            
            if (results.length > 0) {
                // Gera e faz download do CSV
                const csvContent = generator.generateCSV(results);
                generator.downloadCSV(csvContent);
                
                // Mostra resultado
                showStatus(`✅ Pronto! CSV baixado. ${stats.processed} processadas com sucesso. ${stats.ignored} ignoradas.`, 'success');
                showResults(results, stats);
            } else {
                showStatus('❌ Nenhuma URL válida foi encontrada.', 'error');
            }
            
        } catch (error) {
            showStatus('❌ Erro durante o processamento. Tente novamente.', 'error');
            console.error('Erro:', error);
        } finally {
            // Reabilita o botão
            processBtn.disabled = false;
            processBtn.textContent = '🚀 Analisar e Gerar CSV';
            progressContainer.classList.add('hidden');
        }
    });

    // Função para mostrar status
    function showStatus(message, type) {
        const statusText = statusDiv.querySelector('.status-text');
        const statusIcon = statusDiv.querySelector('.status-icon');
        
        if (statusText) {
            statusText.textContent = message;
        }
        
        if (type === 'success') {
            statusIcon.textContent = '✅';
        } else if (type === 'error') {
            statusIcon.textContent = '❌';
        } else {
            statusIcon.textContent = '⏳';
        }
    }

    // Função para mostrar resultados
    function showResults(results, stats) {
        const resultHTML = `
            <h3 class="results-title">📊 Resumo do Processamento</h3>
            <div class="results-summary">
                <div class="stats">
                    <div class="stat-item">
                        <span class="stat-number">${stats.processed}</span>
                        <span class="stat-label">URLs Processadas</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${stats.ignored}</span>
                        <span class="stat-label">URLs Ignoradas</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${stats.total}</span>
                        <span class="stat-label">Total</span>
                    </div>
                </div>
            </div>
            
            <div class="preview-section">
                <h4>👀 Preview das Mensagens</h4>
                <div class="preview-list">
                    ${results.slice(0, 3).map(result => `
                        <div class="preview-item">
                            <div class="preview-header">
                                <strong>${result.store_name || result.url}</strong>
                                <span class="contact-badge">${result.contact_person}</span>
                            </div>
                            <div class="preview-details">
                                <p><strong>Título:</strong> ${result.title || 'N/A'}</p>
                                <p><strong>Descrição:</strong> ${result.description ? result.description.substring(0, 100) + '...' : 'N/A'}</p>
                                <p><strong>Instagram:</strong> ${result.instagram_link || 'N/A'}</p>
                                <p><strong>SEO Score:</strong> ${result.seo_score || 'N/A'}</p>
                                <p><strong>Oportunidade:</strong> ${result.oportunidade || 'N/A'}</p>
                            </div>
                            <div class="preview-message">
                                ${result.cold_outreach_message ? result.cold_outreach_message.substring(0, 150) + '...' : 'N/A'}
                            </div>
                        </div>
                    `).join('')}
                    ${results.length > 3 ? `<div class="preview-more">E mais ${results.length - 3} mensagens...</div>` : ''}
                </div>
            </div>
        `;
        
        resultContainer.innerHTML = resultHTML;
        resultContainer.classList.remove('hidden');
    }

    // Auto-resize do textarea
    urlInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 200) + 'px';
    });

    // Placeholder dinâmico
    const placeholders = [
        'https://usemegavest.com.br\nhttps://instagram.com/lojapraiaazul\nhttps://modafeminina.com.br',
        'https://vestidoschic.com\nhttps://instagram.com/beachstyle\nhttps://trendy.com.br',
        'https://instagram.com/vestuariofino\nhttps://praiamodas.com\nhttps://elegance.com.br'
    ];
    
    let placeholderIndex = 0;
    setInterval(() => {
        if (!urlInput.value) {
            urlInput.placeholder = placeholders[placeholderIndex];
            placeholderIndex = (placeholderIndex + 1) % placeholders.length;
        }
    }, 3000);
});

