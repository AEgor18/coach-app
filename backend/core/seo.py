from datetime import datetime

from fastapi import APIRouter, Response
from fastapi.responses import PlainTextResponse

from core.config import settings


seo_router = APIRouter(tags=["SEO"])

PUBLIC_PAGES = [
    {"loc": "/", "priority": "1.0", "changefreq": "daily"},
    {"loc": "/auth", "priority": "0.8", "changefreq": "monthly"},
]


def get_base_url() -> str:
    """Безопасное получение BASE_URL"""
    return getattr(settings, "BASE_URL", None) or "https://yourdomain.com"


@seo_router.get("/sitemap.xml")
async def get_sitemap():
    """Динамический sitemap.xml"""
    base_url = get_base_url()
    urlset = []

    for page in PUBLIC_PAGES:
        urlset.append(
            f"""
    <url>
        <loc>{base_url}{page["loc"]}</loc>
        <lastmod>{datetime.now().strftime("%Y-%m-%d")}</lastmod>
        <changefreq>{page["changefreq"]}</changefreq>
        <priority>{page["priority"]}</priority>
    </url>
        """.strip()
        )

    xml_content = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{"".join(urlset)}
</urlset>"""

    return Response(content=xml_content, media_type="application/xml")


@seo_router.get("/robots.txt", response_class=PlainTextResponse)
async def get_robots():
    """Улучшенный robots.txt"""
    base_url = get_base_url()

    content = f"""User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin*
Disallow: /settings*
Disallow: /profile*
Disallow: /athletes*
Disallow: /trainings*
Disallow: /nutrition*
Disallow: /reports*

Sitemap: {base_url}/sitemap.xml
"""
    return content


@seo_router.get("/json-ld")
async def get_json_ld():
    base_url = get_base_url()
    json_ld = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Coach App",
        "url": base_url,
        "description": "Управление тренировками и спортсменами для тренеров",
        "logo": f"{base_url}/logo.png",
    }
    return Response(
        content=str(json_ld).replace("'", '"'), media_type="application/ld+json"
    )
