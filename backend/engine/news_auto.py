import feedparser
import time
import random

RSS_MAP = {
    "FOREXCOM:ESP35": "https://e00-expansion.uecdn.es/rss/empresas.xml",
    "FOREXCOM:EU50": "https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/economia/portada",
    "FOREXCOM:US2000": "https://feeds.bbci.co.uk/news/business/rss.xml",
    "FOREXCOM:NAS100": "https://feeds.bbci.co.uk/news/business/rss.xml",
    "FX:SPX500": "https://feeds.bbci.co.uk/news/business/rss.xml",
}

_last_update = {}
_cached_news = {}

CACHE_TIME = 60


def get_sentiment(text):
    text = text.lower()

    positives = ["sube", "crece", "beneficio", "récord", "expansión", "mejora"]
    negatives = ["cae", "crisis", "pérdida", "deuda", "inflación", "riesgo"]

    if any(word in text for word in positives):
        return "positive"
    if any(word in text for word in negatives):
        return "negative"
    return "neutral"


def _fallback_news(market):
    return [
        {
            "title": f"Seguimiento activo en {market}",
            "summary": "No hay noticias disponibles.",
            "image": None,
            "url": "#",
            "time": "Ahora",
            "sentiment": "neutral",
        },
        {
            "title": f"Contexto de mercado {market}",
            "summary": "Esperando nueva información.",
            "image": None,
            "url": "#",
            "time": "Ahora",
            "sentiment": "neutral",
        },
    ]


def get_auto_news(market):
    now = time.time()

    if market in _last_update and market in _cached_news:
        if now - _last_update[market] < CACHE_TIME:
            return _cached_news[market]

    rss_url = RSS_MAP.get(market, RSS_MAP["FOREXCOM:ESP35"])

    try:
        feed = feedparser.parse(rss_url)
        news = []

        for entry in feed.entries[:4]:
            image = None

            media_content = getattr(entry, "media_content", None)
            if media_content:
                image = media_content[0].get("url")

            title = getattr(entry, "title", "").strip()
            summary = getattr(entry, "summary", "").strip()
            link = getattr(entry, "link", "#")

            if not title:
                continue

            if not summary:
                summary = "Sin resumen disponible."

            sentiment = get_sentiment(title + " " + summary)

            news.append({
                "title": title,
                "summary": (summary[:140] + "...") if len(summary) > 140 else summary,
                "image": image,
                "url": link,
                "time": "Reciente",
                "sentiment": sentiment,
            })

        if len(news) < 2:
            news += _fallback_news(market)

        random.shuffle(news)

        _cached_news[market] = news
        _last_update[market] = now
        return news

    except Exception:
        return _fallback_news(market)