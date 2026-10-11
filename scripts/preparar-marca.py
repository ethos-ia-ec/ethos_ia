"""Copia las variantes del logotipo desde diseodelogo a public/marca con nombres claros (PNG, máx. 1600 px de ancho).
Los originales y los archivos .ai no se tocan ni se publican. Uso: python scripts/preparar-marca.py"""
import os

from PIL import Image

BASE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public")
ORIGEN = os.path.join(BASE, "empresa", "diseodelogo")
DESTINO = os.path.join(BASE, "marca")
os.makedirs(DESTINO, exist_ok=True)

VARIANTES = {
    "ethos-ia-vertical-color.png": ("Mesa de trabajo 1.png", True),      # transparente, letras blancas: para fondos oscuros
    "ethos-ia-cubo.png": ("Mesa de trabajo 06.png", True),               # símbolo solo, transparente
    "ethos-ia-horizontal-oscuro.png": ("Mesa de trabajo 2.png", False),  # sobre fondo oscuro
    "ethos-ia-horizontal-claro.png": ("Mesa de trabajo 3.png", False),   # sobre fondo claro
    "ethos-ia-mono-claro.png": ("Mesa de trabajo 4.png", False),         # monocromo blanco sobre negro
    "ethos-ia-mono-oscuro.png": ("Mesa de trabajo 5.png", False),        # monocromo negro sobre blanco
}
for nombre, (origen, recortar) in VARIANTES.items():
    im = Image.open(os.path.join(ORIGEN, origen)).convert("RGBA")
    if recortar:
        im = im.crop(im.getchannel("A").getbbox())
    im.thumbnail((1600, 1600), Image.LANCZOS)
    im.save(os.path.join(DESTINO, nombre), optimize=True)
    print(nombre, im.size)
