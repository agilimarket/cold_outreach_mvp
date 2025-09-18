
from flask import Flask, request, jsonify, send_from_directory
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse, urljoin
import os
import re

app = Flask(__name__, static_folder=".", static_url_path="")

@app.route("/")
def serve_index():
    return send_from_directory(".", "index.html")

def get_social_media_links(url):
    social_links = {
        "instagram": None,
        "facebook": None,
        "twitter": None,
        "linkedin": None,
        "youtube": None,
        "tiktok": None,
    }
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Encontrar links de redes sociais
        for link_tag in soup.find_all('a', href=True):
            href = link_tag['href']
            if "instagram.com" in href and not social_links["instagram"]:
                social_links["instagram"] = href
            elif "facebook.com" in href and not social_links["facebook"]:
                social_links["facebook"] = href
            elif "twitter.com" in href and not social_links["twitter"]:
                social_links["twitter"] = href
            elif "linkedin.com" in href and not social_links["linkedin"]:
                social_links["linkedin"] = href
            elif "youtube.com" in href and not social_links["youtube"]:
                social_links["youtube"] = href
            elif "tiktok.com" in href and not social_links["tiktok"]:
                social_links["tiktok"] = href

    except requests.exceptions.RequestException as e:
        print(f"Erro ao acessar {url}: {e}")
    except Exception as e:
        print(f"Erro ao processar {url}: {e}")
    return social_links

def get_website_metadata(url):
    metadata = {
        "title": None,
        "description": None,
        "keywords": None,
        "og_image": None,
    }
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')

        # Título
        if soup.title and soup.title.string:
            metadata["title"] = soup.title.string.strip()

        # Meta descrição e palavras-chave
        for meta_tag in soup.find_all('meta'):
            if meta_tag.get('name') == 'description':
                metadata["description"] = meta_tag.get('content', '').strip()
            elif meta_tag.get('name') == 'keywords':
                metadata["keywords"] = meta_tag.get('content', '').strip()
            elif meta_tag.get('property') == 'og:image':
                metadata["og_image"] = urljoin(url, meta_tag.get('content', '')).strip()

    except requests.exceptions.RequestException as e:
        print(f"Erro ao acessar {url}: {e}")
    except Exception as e:
        print(f"Erro ao extrair metadados de {url}: {e}")
    return metadata

@app.route('/analyze', methods=['POST'])
def analyze_url():
    data = request.get_json()
    url = data.get('url')

    if not url:
        return jsonify({"error": "URL não fornecida"}), 400

    # Coleta de metadados do site
    website_metadata = get_website_metadata(url)

    # Coleta de links de redes sociais
    social_media_links = get_social_media_links(url)

    # Simulação de dados de visibilidade (para MVP, pois APIs reais são complexas/pagas)
    visibility_data = {
        "estimated_traffic": "5000-10000",
        "seo_score": "B+",
        "has_blog": "Sim" if "blog" in url else "Não",
    }

    # Lógica de análise aprimorada
    oportunidade = []
    conquista = []

    # Análise de Redes Sociais
    if social_media_links["instagram"]:
        conquista.append("Presença ativa no Instagram.")
        oportunidade.append("Explorar mais Reels e Stories para aumentar o engajamento e alcance.")
    else:
        oportunidade.append("Grande potencial de crescimento com a criação de uma presença no Instagram.")

    if social_media_links["facebook"]:
        conquista.append("Presença no Facebook.")
        oportunidade.append("Otimizar campanhas de Facebook Ads para segmentação de público.")
    else:
        oportunidade.append("Considerar a criação de uma página no Facebook para alcançar um público mais amplo.")

    if social_media_links["twitter"]:
        conquista.append("Presença no Twitter.")
        oportunidade.append("Utilizar o Twitter para notícias rápidas, promoções e promoções em tempo real.")

    if social_media_links["linkedin"]:
        conquista.append("Presença no LinkedIn.")
        oportunidade.append("Aproveitar o LinkedIn para networking B2B ou branding corporativo.")

    if social_media_links["youtube"]:
        conquista.append("Presença no YouTube.")
        oportunidade.append("Desenvolver conteúdo em vídeo (tutoriais, reviews) para SEO e engajamento.")

    if social_media_links["tiktok"]:
        conquista.append("Presença no TikTok.")
        oportunidade.append("Criar vídeos curtos e virais para atrair a geração Z.")
    else:
        oportunidade.append("Explorar o TikTok para alcançar um público jovem e engajado.")

    # Análise de Metadados do Site
    if website_metadata["title"] and len(website_metadata["title"]) > 10:
        conquista.append("Título do site claro e descritivo.")
    else:
        oportunidade.append("Otimizar o título do site para melhorar o SEO e a atratividade nos resultados de busca.")

    if website_metadata["description"] and len(website_metadata["description"]) > 50:
        conquista.append("Meta descrição otimizada e informativa.")
    else:
        oportunidade.append("Melhorar a meta descrição para aumentar a taxa de cliques nos motores de busca.")

    if website_metadata["keywords"]:
        conquista.append("Palavras-chave relevantes configuradas.")
    else:
        oportunidade.append("Adicionar palavras-chave relevantes para melhorar a indexação e o SEO.")

    if website_metadata["og_image"]:
        conquista.append("Imagem Open Graph configurada para compartilhamento social.")
    else:
        oportunidade.append("Configurar uma imagem Open Graph para melhorar a apresentação em redes sociais.")

    # Análise de Visibilidade (simulada)
    if visibility_data["has_blog"] == "Sim":
        conquista.append("Possui um blog ativo.")
        oportunidade.append("Publicar conteúdo regularmente no blog para atrair tráfego orgânico e educar o público.")
    else:
        oportunidade.append("Considerar a criação de um blog para melhorar o SEO, gerar conteúdo e autoridade.")

    # Converter listas para strings
    conquista_str = ". ".join(conquista) + "."
    oportunidade_str = ". ".join(oportunidade) + "."

    # Gerar mensagem de cold outreach
    store_name = website_metadata["title"] if website_metadata["title"] else urlparse(url).netloc
    contact_person = "Time de Marketing"

    message_template = f"""
Olá, {contact_person},

Nós da DataFashion Marketing notamos o trabalho de vocês em {store_name}. Identificamos as seguintes conquistas: {conquista_str}

E vimos que há uma grande oportunidade para: {oportunidade_str} Podemos ajudar a destravar esse potencial.

Que tal conversarmos por 15 minutos para mostrar como podemos impulsionar suas vendas online?

Agende aqui: calendly.com/datafashion/15min

Atenciosamente,
Equipe DataFashion Marketing
"""

    result = {
        "url": url,
        "store_name": store_name,
        "contact_person": contact_person,
        "title": website_metadata["title"],
        "description": website_metadata["description"],
        "keywords": website_metadata["keywords"],
        "og_image": website_metadata["og_image"],
        "instagram_link": social_media_links["instagram"],
        "facebook_link": social_media_links["facebook"],
        "twitter_link": social_media_links["twitter"],
        "linkedin_link": social_media_links["linkedin"],
        "youtube_link": social_media_links["youtube"],
        "tiktok_link": social_media_links["tiktok"],
        "estimated_traffic": visibility_data["estimated_traffic"],
        "seo_score": visibility_data["seo_score"],
        "has_blog": visibility_data["has_blog"],
        "conquista": conquista_str,
        "oportunidade": oportunidade_str,
        "cold_outreach_message": message_template
    }

    return jsonify(result)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)


