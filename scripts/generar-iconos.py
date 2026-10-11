"""Genera favicon, iconos de aplicación y tarjeta para compartir desde los logotipos de la carpeta diseodelogo.
Los originales no se modifican. Uso: python scripts/generar-iconos.py"""
import os

from PIL import Image, ImageDraw, ImageFilter

BASE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public")
LOGOS = os.path.join(BASE, "empresa", "diseodelogo")
FONDO = (5, 17, 30, 255)

cubo = Image.open(os.path.join(LOGOS, "Mesa de trabajo 06.png")).convert("RGBA")
cubo = cubo.crop(cubo.getchannel("A").getbbox())


def icono(lado, margen=0.16, redondeo=0.22):
    """Cubo centrado sobre un cuadrado azul de marca con esquinas redondeadas."""
    lienzo = Image.new("RGBA", (lado, lado), (0, 0, 0, 0))
    mascara = Image.new("L", (lado, lado), 0)
    ImageDraw.Draw(mascara).rounded_rectangle((0, 0, lado - 1, lado - 1), radius=int(lado * redondeo), fill=255)
    fondo = Image.new("RGBA", (lado, lado), FONDO)
    lienzo.paste(fondo, (0, 0), mascara)
    util = int(lado * (1 - 2 * margen))
    c = cubo.copy()
    c.thumbnail((util, util), Image.LANCZOS)
    lienzo.alpha_composite(c, ((lado - c.width) // 2, (lado - c.height) // 2))
    return lienzo


grande = icono(512)
for lado, nombre in ((16, None), (32, "favicon-32.png"), (180, "apple-touch-icon.png"), (192, "icon-192.png"), (512, "icon-512.png")):
    if nombre:
        grande.resize((lado, lado), Image.LANCZOS).save(os.path.join(BASE, nombre))
grande.save(os.path.join(BASE, "favicon.ico"), sizes=[(16, 16), (32, 32), (48, 48)])
grande.resize((32, 32), Image.LANCZOS).save(os.path.join(BASE, "favicon.png"))

# Tarjeta para compartir (1200x630): logotipo vertical sobre el fondo de marca.
vertical = Image.open(os.path.join(LOGOS, "Mesa de trabajo 1.png")).convert("RGBA")
vertical = vertical.crop(vertical.getchannel("A").getbbox())
tarjeta = Image.new("RGBA", (1200, 630), FONDO)
halo = Image.new("RGBA", (1200, 630), (0, 0, 0, 0))
ImageDraw.Draw(halo).ellipse((330, -60, 870, 400), fill=(4, 235, 255, 70))
tarjeta.alpha_composite(halo.filter(ImageFilter.GaussianBlur(110)))
vertical.thumbnail((620, 520), Image.LANCZOS)
tarjeta.alpha_composite(vertical, ((1200 - vertical.width) // 2, (630 - vertical.height) // 2))
tarjeta.convert("RGB").save(os.path.join(BASE, "empresa", "ethos-og-card.png"), optimize=True)
print("iconos y tarjeta generados")
