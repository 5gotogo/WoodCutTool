"""Encode the existing hero photographs without changing their content.

Run manually with Python 3 and Pillow's AVIF support after replacing a source.
Derived assets are committed so the normal Node/Pages build needs no encoder.
"""
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parent.parent
sources = [
    *[f"compare/compare-{name}" for name in ("hero", "materials", "saws", "planning", "construction")],
    *[f"tools/tools-{name}" for name in ("cabinet", "cut-layout", "measurement")],
    "learn/tile-layout", "learn/quilt-planning",
]
for name in sources:
    source = root / "assets/images" / f"{name}.webp"
    with Image.open(source) as image:
        for width in (480, 800, image.width):
            target = source.with_name(f"{source.stem}-{width}.avif")
            resized = image.resize((width, round(image.height * width / image.width)), Image.Resampling.LANCZOS)
            resized.save(target, "AVIF", quality=42, speed=4, subsampling="4:2:0")
        # Preserve existing WebP candidates; add a small fallback where absent.
        small = source.with_name(f"{source.stem}-480.webp")
        if not small.exists():
            image.resize((480, round(image.height * 480 / image.width)), Image.Resampling.LANCZOS).save(small, "WEBP", quality=75, method=6)
    print(source.relative_to(root))
