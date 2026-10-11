"""Separa el cubo y las letras de «Mesa de trabajo 1.png» (logo vertical, fondo transparente) para la intro animada.
Los originales no se modifican. Genera public/empresa/ethos-cubo.webp y public/empresa/ethos-letras.webp.
Uso: python scripts/recortar-cubo.py"""
import os

from PIL import Image

RAIZ = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "empresa")
im = Image.open(os.path.join(RAIZ, "diseodelogo", "Mesa de trabajo 1.png")).convert("RGBA")

# Bloques medidos por filas de alfa: cubo (y 194-565), «ETHOS IA» y lema (y 591-733). Ambos centrados en x ≈ 501.
cubo = im.crop((342, 194, 663, 566))
letras = im.crop((84, 591, 918, 734))

cubo.save(os.path.join(RAIZ, "ethos-cubo.webp"), "WEBP", quality=84, method=6)
letras.save(os.path.join(RAIZ, "ethos-letras.webp"), "WEBP", quality=90, method=6)
print("ethos-cubo.webp", cubo.size, "· ethos-letras.webp", letras.size)
