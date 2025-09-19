// Gerador de Mensagens de Cold Outreach para Lojas de Moda
class ColdOutreachGenerator {
    constructor() {
        this.processedUrls = [];
        this.ignoredUrls = [];
        this.allUrls = []; // Todas as URLs, incluindo as não processadas ainda
        this.currentIndex = 0; // Índice da URL atual sendo processada
        this.isProcessing = false;
        this.isPaused = false;
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

    // Aplica regras de análise simulada
    analyzeStore(storeName) {
        const lowerName = storeName.toLowerCase();
        
        if (lowerName.includes('vest')) {
            return {
                contato: 'Mariana',
                conquista: 'Coleção nova com storytelling emocional e ótimo feedback de clientes',
                oportunidade: 'Reels com menos de 500 visualizações — potencial não explorado'
            };
        } else if (lowerName.includes('praia') || lowerName.includes('beach')) {
            return {
                contato: 'Carolina',
                conquista: 'Fotos em cenários tropicais com alto engajamento visual',
                oportunidade: 'Ausência de TikTok e poucas respostas a DMs'
            };
        } else {
            return {
                contato: `Time da ${storeName}`,
                conquista: 'Lançamento recente com bom engajamento nos comentários',
                oportunidade: 'Baixo uso de Reels e ausência de link otimizado na bio'
            };
        }
    }

    // Gera a mensagem personalizada
    generateMessage(storeName, analysis) {
        const template = `Oi, ${analysis.contato},

Adorei o que vocês estão fazendo com ${storeName} — especialmente ${analysis.conquista}. Isso gera conexão genuína.

Percebi, porém, que ${analysis.oportunidade}. É comum — mas é oportunidade escondida para aumentar conversões.

Na DataFashion Marketing, ajudamos marcas como a sua a aumentar vendas online e ROI de anúncios.

Em 15 min, mostro onde está travando e como destravar.

Agende aqui: calendly.com/seunome/15min

Para uma análise ainda mais precisa e personalizada do seu negócio, que tal preencher nosso formulário rápido? Assim, podemos entender melhor seu estado atual e como podemos te ajudar a crescer ainda mais: [LINK_PARA_SEU_FORMULARIO_ONLINE_AQUI]

Com carinho e dados,
[Seu_Nome]
Especialista em Tráfego & SEO para Moda`;

        return template;
    }

    // Processa uma única URL
    processUrl(url) {
        const trimmedUrl = url.trim();
        
        if (!trimmedUrl || !this.isValidUrl(trimmedUrl)) {
            this.ignoredUrls.push(trimmedUrl);
            return null;
        }

        const storeName = this.extractStoreName(trimmedUrl);
        if (!storeName) {
            this.ignoredUrls.push(trimmedUrl);
            return null;
        }

        const analysis = this.analyzeStore(storeName);
        const message = this.generateMessage(storeName, analysis);

        const result = {
            url: trimmedUrl,
            contato: analysis.contato,
            conquista: analysis.conquista,
            oportunidade: analysis.oportunidade,
            mensagem: message
        };

        this.processedUrls.push(result);
        return result;
    }

    // Processa lista de URLs
    async processUrls(urlList) {
        this.processedUrls = [];
        this.ignoredUrls = [];
        this.allUrls = urlList.split('\\n').filter(url => url.trim());
        this.currentIndex = 0;
        this.isProcessing = true;
        this.isPaused = false;

        await this._processUrlsInternal();

        this.isProcessing = false;
        return this.processedUrls;
    }

    async _processUrlsInternal() {
        while (this.currentIndex < this.allUrls.length && this.isProcessing && !this.isPaused) {
            const url = this.allUrls[this.currentIndex];
            try {
                const result = this.processUrl(url);
                if (result) {
                    // A URL já é adicionada a processedUrls dentro de processUrl
                }
            } catch (error) {
                console.error(`Erro ao processar URL ${url}:`, error);
                this.ignoredUrls.push(url); // Adiciona a URL com erro às ignoradas
            }
            this.currentIndex++;
            this.updateProgress(this.currentIndex, this.allUrls.length);
            await new Promise(resolve => setTimeout(resolve, 100)); // Simula processamento assíncrono
        }
    }

    pause() {
        this.isPaused = true;
        this.isProcessing = false;
    }

    async resume() {
        this.isPaused = false;
        this.isProcessing = true;
        await this._processUrlsInternal();
        this.isProcessing = false;
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
        const headers = ['URL', 'Contato', 'Conquista', 'Oportunidade', 'Mensagem'];
        const csvContent = [headers.join(',')];

        data.forEach(row => {
            const csvRow = [
                `"${row.url}"`,
                `"${row.contato}"`,
                `"${row.conquista}"`,
                `"${row.oportunidade}"`,
                `"${row.mensagem.replace(/"/g, '""').replace(/\n/g, '\\n')}"`
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
    const generateBtn = document.getElementById('generate-btn');
    const pauseResumeBtn = document.getElementById('pause-resume-btn');
    const statusDiv = document.getElementById('status-display');
    const progressBarFill = document.querySelector('#progress-bar .progress-fill');
    const progressContainer = document.getElementById('progress-bar');
    const resultsSection = document.getElementById('results-section');

    // Event listener para o botão de Gerar
    generateBtn.addEventListener('click', async function() {
    const urls = urlInput.value.trim();
    
    if (!urls) {
        showStatus('Por favor, insira pelo menos uma URL.', 'error');
        return;
    }

    // Resetar estado para nova análise
    generator.processedUrls = [];
    generator.ignoredUrls = [];
    generator.currentIndex = 0;
    generator.isPaused = false;

    generateBtn.classList.add('hidden');
    pauseResumeBtn.classList.remove('hidden');
    pauseResumeBtn.innerHTML = '<span class="button-icon">⏸️</span><span class="button-text">Pausar</span>';
    pauseResumeBtn.style.background = 'var(--warning-gradient)';
    
    statusDiv.classList.remove('success', 'error');
    statusDiv.classList.add('processing');
    showStatus('Iniciando processamento...', 'processing');
    progressBarFill.style.width = '0%';
    progressContainer.classList.remove('hidden');
    resultsSection.classList.add('hidden');

    await startProcessing(urls);
});

// Event listener para o botão de Pausar/Retomar
pauseResumeBtn.addEventListener('click', async function() {
    if (generator.isProcessing) {
        generator.pause();
        pauseResumeBtn.innerHTML = '<span class="button-icon">▶️</span><span class="button-text">Retomar</span>';
        pauseResumeBtn.style.background = 'var(--success-gradient)';
        showStatus('Processamento pausado.', 'warning');
    } else if (generator.isPaused) {
        generator.resume();
        pauseResumeBtn.innerHTML = '<span class="button-icon">⏸️</span><span class="button-text">Pausar</span>';
        pauseResumeBtn.style.background = 'var(--warning-gradient)';
        showStatus('Retomando processamento...', 'processing');
        }
    });

    async function startProcessing(urls) {
        try {
            await generator.processUrls(urls);
            const stats = generator.getStats();
            
            if (generator.processedUrls.length > 0) {
                const csvContent = generator.generateCSV(generator.processedUrls);
                generator.downloadCSV(csvContent);
                showStatus(`✅ Pronto! CSV baixado. ${stats.processed} processadas com sucesso. ${stats.ignored} ignoradas.`, 'success');
                showResults(generator.processedUrls, stats);
            } else {
                showStatus('❌ Nenhuma URL válida foi encontrada.', 'error');
            }
            
        } catch (error) {
            showStatus('❌ Erro durante o processamento. Tente novamente.', 'error');
            console.error('Erro:', error);
        } finally {
            generateBtn.classList.remove('hidden');
            pauseResumeBtn.classList.add('hidden');
            progressContainer.classList.add('hidden');
            statusDiv.classList.remove('processing', 'warning');
        }
    }

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
                                <strong>${result.url}</strong>
                                <span class="contact-badge">${result.contato}</span>
                            </div>
                            <div class="preview-message">
                                ${result.mensagem.substring(0, 150)}...
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

