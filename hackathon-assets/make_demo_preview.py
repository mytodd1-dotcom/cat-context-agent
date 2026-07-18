from pathlib import Path
import math
import textwrap

import imageio.v2 as imageio
import numpy as np
from PIL import Image, ImageDraw, ImageFont


OUT = Path(__file__).with_name("cat-context-agent-demo-preview.mp4")
W, H = 1280, 720
FPS = 24
SECONDS_PER_SLIDE = 6


def font(size: int, bold: bool = False):
    candidates = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/Supplemental/Helvetica Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Helvetica.ttf",
        "/Library/Fonts/Arial Bold.ttf" if bold else "/Library/Fonts/Arial.ttf",
    ]
    for path in candidates:
        try:
            return ImageFont.truetype(path, size)
        except Exception:
            pass
    return ImageFont.load_default()


TITLE = font(62, True)
H2 = font(38, True)
BODY = font(30)
SMALL = font(22)
MONO = font(26)


slides = [
    {
        "eyebrow": "BUILD WITH DATAHUB: THE AGENT HACKATHON",
        "title": "CAT Context Agent",
        "body": [
            "Context before action for messy business data.",
            "A DataHub-backed workflow agent for safe next steps, missing-info questions, and traceable receipts.",
        ],
        "footer": "Public repo: github.com/mytodd1-dotcom/cat-context-agent",
    },
    {
        "eyebrow": "THE PROBLEM",
        "title": "Agents fail when context is missing.",
        "body": [
            "Small teams keep data in CSVs, PDFs, notes, and one-off tools.",
            "Before an agent acts, it should know the schema, source, owner, lineage, and confidence.",
        ],
        "footer": "CAT rule: when context is weak, ask first.",
    },
    {
        "eyebrow": "WHY DATAHUB",
        "title": "DataHub becomes the agent’s context layer.",
        "body": [
            "The prototype uses DataHub OSS/Core, MCP Server, Agent Context Kit, and DataHub Skills.",
            "The agent checks metadata before recommending work.",
        ],
        "footer": "Category: Agents That Do Real Work",
    },
    {
        "eyebrow": "DEMO FLOW",
        "title": "Messy file → trusted workflow",
        "body": [
            "1. Ingest messy sample business data",
            "2. Register/catalog context in DataHub",
            "3. Agent reads DataHub before action",
            "4. Missing fields become questions",
            "5. Safe tasks enter an approval queue",
        ],
        "footer": "Focused prototype: one data scenario, one context loop, one receipt.",
    },
    {
        "eyebrow": "RECEIPT MODEL",
        "title": "Every recommendation explains itself.",
        "body": [
            "Safe next step: ask for missing customer contact owner.",
            "Context used: source file, inferred schema, field confidence, owner metadata.",
            "Blocked action: no outreach until ownership is confirmed.",
        ],
        "footer": "The agent leaves receipts instead of hiding assumptions.",
    },
    {
        "eyebrow": "CURRENT STATUS",
        "title": "Foundation submitted; working demo next.",
        "body": [
            "The public repo, Apache 2.0 license, landing shell, and hackathon draft are in place.",
            "Next milestone: wire sample data into DataHub and produce the runnable agent decision loop.",
        ],
        "footer": "Video preview generated July 2026.",
    },
]


def draw_wrapped(draw, text, xy, width, font_obj, fill, line_gap=10):
    x, y = xy
    words = text.split()
    lines = []
    line = ""
    for word in words:
        test = f"{line} {word}".strip()
        if draw.textlength(test, font=font_obj) <= width:
            line = test
        else:
            if line:
                lines.append(line)
            line = word
    if line:
        lines.append(line)
    for line in lines:
        draw.text((x, y), line, font=font_obj, fill=fill)
        y += font_obj.size + line_gap
    return y


def make_slide(slide, progress=0):
    img = Image.new("RGB", (W, H), "#09111f")
    draw = ImageDraw.Draw(img)

    # Soft gradient + glow.
    for y in range(H):
        shade = int(12 + 26 * y / H)
        draw.line([(0, y), (W, y)], fill=(8, shade, 31 + int(20 * y / H)))
    for r in range(420, 0, -8):
        alpha = r / 420
        color = (int(20 + 45 * alpha), int(94 + 70 * alpha), int(115 + 50 * alpha))
        draw.ellipse((W - 300 - r, 70 - r, W - 300 + r, 70 + r), outline=color)

    # Card.
    margin = 74
    draw.rounded_rectangle((margin, 64, W - margin, H - 64), radius=34, fill="#101c2f", outline="#2dd4bf", width=2)
    draw.rounded_rectangle((margin + 28, 96, W - margin - 28, 140), radius=18, fill="#0f766e")
    draw.text((margin + 54, 107), slide["eyebrow"], font=SMALL, fill="#d1fae5")

    draw.text((margin + 54, 178), slide["title"], font=TITLE if len(slide["title"]) < 26 else H2, fill="#f8fafc")

    y = 294
    for item in slide["body"]:
        if item.startswith(tuple("12345")):
            draw.rounded_rectangle((margin + 54, y - 4, margin + 92, y + 34), radius=12, fill="#22c55e")
            num = item.split(".", 1)[0]
            draw.text((margin + 66, y + 1), num, font=SMALL, fill="#052e16")
            text = item.split(".", 1)[1].strip()
            y = draw_wrapped(draw, text, (margin + 108, y), W - 2 * margin - 180, BODY, "#e2e8f0", 8) + 14
        else:
            draw.ellipse((margin + 58, y + 11, margin + 70, y + 23), fill="#2dd4bf")
            y = draw_wrapped(draw, item, (margin + 88, y), W - 2 * margin - 150, BODY, "#e2e8f0", 9) + 24

    draw.line((margin + 54, H - 138, W - margin - 54, H - 138), fill="#334155", width=2)
    draw.text((margin + 54, H - 112), slide["footer"], font=SMALL, fill="#94a3b8")

    # Progress bar.
    bar_w = W - 2 * margin - 108
    draw.rounded_rectangle((margin + 54, H - 84, margin + 54 + bar_w, H - 74), radius=5, fill="#1e293b")
    draw.rounded_rectangle((margin + 54, H - 84, margin + 54 + int(bar_w * progress), H - 74), radius=5, fill="#84cc16")

    return np.asarray(img)


def main():
    frames = []
    total = len(slides) * SECONDS_PER_SLIDE * FPS
    for si, slide in enumerate(slides):
        for f in range(SECONDS_PER_SLIDE * FPS):
            p = (si * SECONDS_PER_SLIDE * FPS + f + 1) / total
            frames.append(make_slide(slide, p))
    imageio.mimsave(
        OUT,
        frames,
        fps=FPS,
        codec="libx264",
        quality=8,
        macro_block_size=16,
        ffmpeg_log_level="error",
    )
    print(OUT)


if __name__ == "__main__":
    main()
