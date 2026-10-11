"""Copia las capturas de los laboratorios Docker a public/paneles/ en WebP (máx. 1600 px).

No mueve ni modifica los originales. Excluye a propósito Lab_C06 y Lab_C09: muestran
vulnerabilidades abiertas del sitio en producción y no deben publicarse.
Uso: python scripts/preparar-paneles.py
"""
import glob
import os

from PIL import Image

RAIZ = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
ORIGEN = os.path.join(RAIZ, "Practicantes Ethos IA")
DESTINO = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "public", "paneles"))
EXCLUIDAS = ("Lab_C06", "Lab_C09")

os.makedirs(DESTINO, exist_ok=True)
vistos = set()
for ruta in sorted(glob.glob(os.path.join(ORIGEN, "**", "Lab_*.png"), recursive=True)):
    nombre = os.path.splitext(os.path.basename(ruta))[0]
    if nombre.startswith(EXCLUIDAS) or nombre in vistos:
        continue
    vistos.add(nombre)
    img = Image.open(ruta).convert("RGB")
    img.thumbnail((1600, 4000))
    img.save(os.path.join(DESTINO, nombre + ".webp"), "WEBP", quality=82, method=6)
print(f"{len(vistos)} imágenes en {DESTINO}")

# ── Ethos DevOps Kit: diagramas y primera página de cada documento de gobierno ──
import pymupdf  # noqa: E402

KIT = os.path.join(RAIZ, "Ethos DevOps Kit")
DEST_KIT = os.path.join(DESTINO, "devops")
os.makedirs(DEST_KIT, exist_ok=True)
for nombre in ("D1_pipeline", "D2_empresas_y_entornos"):
    img = Image.open(os.path.join(KIT, "docs", "fig", nombre + ".png")).convert("RGB")
    img.thumbnail((1800, 1800))
    img.save(os.path.join(DEST_KIT, nombre + ".webp"), "WEBP", quality=85, method=6)
for pdf in sorted(glob.glob(os.path.join(KIT, "docs", "0*.pdf"))):
    doc = pymupdf.open(pdf)
    pix = doc[0].get_pixmap(dpi=100)
    img = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
    img.save(os.path.join(DEST_KIT, os.path.splitext(os.path.basename(pdf))[0][:2] + ".webp"), "WEBP", quality=82, method=6)
print("kit DevOps:", len(os.listdir(DEST_KIT)), "imágenes")
