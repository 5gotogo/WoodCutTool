"""Encode the existing hero photographs without changing their content.

Run manually with Python 3 and Pillow's AVIF support after replacing a source.
Derived assets are committed so the normal Node/Pages build needs no encoder.
"""
from pathlib import Path
from PIL import Image
import argparse

parser = argparse.ArgumentParser()
parser.add_argument("--group", choices=("all", "templates"), default="all")
args = parser.parse_args()

root = Path(__file__).resolve().parent.parent
sources = [
    *[f"compare/compare-{name}" for name in ("hero", "materials", "saws", "planning", "construction")],
    *[f"tools/tools-{name}" for name in ("cabinet", "cut-layout", "measurement")],
    "learn/tile-layout", "learn/quilt-planning",
    "apps/cutlist/cutlist-layout-stats",
    *[f"templates/template-{name}" for name in ("cabinets", "storage", "furniture", "shop")],
    *[str(path.relative_to(root / "assets/images").with_suffix(""))
      for path in sorted((root / "assets/images/woodworking").glob("wood-*.webp"))
      if not path.stem.endswith("-480")],
]
if args.group == "templates":
    sources = [name for name in sources if name.startswith("templates/")]
for name in sources:
    source = root / "assets/images" / f"{name}{'.png' if name.startswith('templates/') else '.webp'}"
    with Image.open(source) as image:
        widths = (image.width,) if name.startswith("apps/") else (480, image.width) if name.startswith("woodworking/") else (480, 960, image.width) if name.startswith("templates/") else (480, 800, image.width)
        for width in widths:
            target = source.with_name(f"{source.stem}-{width}.avif")
            resized = image.resize((width, round(image.height * width / image.width)), Image.Resampling.LANCZOS)
            resized.save(target, "AVIF", quality=55 if name.startswith("apps/") else 42, speed=4, subsampling="4:2:0")
        # Preserve existing WebP candidates; add a small fallback where absent.
        small = source.with_name(f"{source.stem}-480.webp")
        if not small.exists() and not name.startswith(("apps/", "templates/")):
            image.resize((480, round(image.height * 480 / image.width)), Image.Resampling.LANCZOS).save(small, "WEBP", quality=75, method=6)
    print(source.relative_to(root))
