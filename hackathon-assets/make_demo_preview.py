from __future__ import annotations

import json
import subprocess
import textwrap
from pathlib import Path

import imageio.v2 as imageio
import imageio_ffmpeg
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parent
CAPTURES = ROOT / "video-captures"
OUT = ROOT / "cat-context-agent-demo-preview.mp4"
SILENT = ROOT / "cat-context-agent-demo-preview.silent.mp4"
AUDIO = ROOT / "cat-context-agent-demo-preview.aiff"
SCRIPT_TXT = ROOT / "cat-context-agent-demo-script.txt"
MANIFEST = ROOT / "cat-context-agent-demo-preview-manifest.json"

W, H = 1920, 1080
FPS = 24


NARRATION = """Most agent demos skip the dangerous middle step.
They jump from messy business data straight to action.

CAT Context Agent is built around a different rule:
context before action.

This is the live hackathon demo for Build with DataHub.
The input is intentionally ordinary: small-business requests with missing owners,
unclear contact fields, stale context, and different levels of risk.

CAT treats DataHub as the agent's context layer.
Before recommending work, it checks the source, schema, ownership, lineage, glossary
terms, and policy boundaries.

Then it separates the work into three lanes.
One request is safe to queue as an internal task.
One needs approval because renewal outreach has missing owner context.
One is blocked because outreach would require missing or unverified context.

The point is not just automation.
The point is accountable automation.

Every decision leaves a receipt:
what data was read, what was missing, what action was allowed, and what action was refused.

The repo includes the runnable proof path, generated DataHub-style metadata,
MCP-style read contracts, a live roundtrip harness, and judge-ready evidence.

CAT is a small prototype, but the pattern is the product:
business data becomes trusted context;
trusted context gates safe agent action;
and every action leaves a receipt."""


SCENES = [
    {
        "kind": "title",
        "duration": 8,
        "eyebrow": "BUILD WITH DATAHUB · AGENTS THAT DO REAL WORK",
        "title": "CAT Context Agent",
        "subtitle": "Context before action for messy business data.",
        "footer": "Live demo · public repo · receipt-backed workflow",
    },
    {
        "kind": "statement",
        "duration": 10,
        "eyebrow": "THE PROBLEM",
        "title": "Agents fail when they skip context.",
        "bullets": [
            "Messy operational data has missing owners and uncertain fields.",
            "A fast agent can still take the wrong action.",
            "CAT forces the context check first.",
        ],
    },
    {
        "kind": "screenshot",
        "duration": 12,
        "image": "01-hero.png",
        "eyebrow": "LIVE PRODUCT",
        "title": "A judge can open the public demo and verify the loop.",
        "callouts": ["DataHub context layer", "Approval queue", "Receipt-backed decisions"],
    },
    {
        "kind": "flow",
        "duration": 10,
        "eyebrow": "THE LOOP",
        "title": "messy data → trusted context → safe action → receipt",
        "steps": [
            ("01", "Business request"),
            ("02", "DataHub-style context read"),
            ("03", "Policy-gated decision"),
            ("04", "Receipt"),
        ],
    },
    {
        "kind": "screenshot",
        "duration": 12,
        "image": "02-demo-safe.png",
        "eyebrow": "CASE 1",
        "title": "Safe work becomes an internal task.",
        "callouts": ["Known source", "Enough confidence", "No external side effect"],
    },
    {
        "kind": "screenshot",
        "duration": 12,
        "image": "03-demo-approval.png",
        "eyebrow": "CASE 2",
        "title": "Missing owner context becomes an approval queue item.",
        "callouts": ["Owner unknown", "Human review needed", "Question before action"],
    },
    {
        "kind": "screenshot",
        "duration": 12,
        "image": "04-demo-blocked.png",
        "eyebrow": "CASE 3",
        "title": "Unsafe outreach is blocked.",
        "callouts": ["Missing verified context", "Policy boundary", "Refusal is a feature"],
    },
    {
        "kind": "screenshot",
        "duration": 12,
        "image": "05-evidence.png",
        "eyebrow": "JUDGE PROOF",
        "title": "The evidence chain is public and reproducible.",
        "callouts": ["Generated artifacts", "MCP-style read contracts", "One-command proof"],
    },
    {
        "kind": "ending",
        "duration": 10,
        "eyebrow": "CAT PATTERN",
        "title": "Trusted context gates safe agent action.",
        "subtitle": "Small prototype. Real workflow boundary. Receipts every time.",
        "footer": "github.com/mytodd1-dotcom/cat-context-agent",
    },
]


def font(size: int, bold: bool = False):
    candidates = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/Supplemental/Helvetica Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Helvetica.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
    ]
    for path in candidates:
        try:
            return ImageFont.truetype(path, size)
        except Exception:
            pass
    return ImageFont.load_default()


FONTS = {
    "eyebrow": font(30, True),
    "title": font(76, True),
    "h2": font(54, True),
    "body": font(39),
    "small": font(28),
    "mono": font(30),
}


def lerp(a, b, t):
    return a + (b - a) * t


def wrapped(draw, text, width, font_obj):
    words = text.split()
    lines, line = [], ""
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
    return lines


def draw_wrapped(draw, text, xy, width, font_obj, fill, gap=10):
    x, y = xy
    for line in wrapped(draw, text, width, font_obj):
        draw.text((x, y), line, font=font_obj, fill=fill)
        y += font_obj.size + gap
    return y


def background():
    cached = getattr(background, "_cached", None)
    if cached is not None:
        return cached.copy()

    img = Image.new("RGB", (W, H), "#07111f")
    x_grad = np.linspace(0, 1, W, dtype=np.float32)[None, :]
    y_grad = np.linspace(0, 1, H, dtype=np.float32)[:, None]
    teal = 22 * x_grad + 16 * (1 - y_grad)
    blue = 28 + 30 * y_grad
    arr = np.zeros((H, W, 3), dtype=np.uint8)
    arr[:, :, 0] = 7
    arr[:, :, 1] = np.clip(18 + teal, 0, 255).astype(np.uint8)
    arr[:, :, 2] = np.clip(38 + blue, 0, 255).astype(np.uint8)
    img = Image.fromarray(arr, "RGB")
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse((W - 680, -360, W + 300, 620), fill=(45, 212, 191, 50))
    gd.ellipse((-300, H - 520, 620, H + 280), fill=(132, 204, 22, 35))
    glow = glow.filter(ImageFilter.GaussianBlur(80))
    cached = Image.alpha_composite(img.convert("RGBA"), glow).convert("RGB")
    background._cached = cached
    return cached.copy()


def panel(draw, box, radius=44, fill="#101c2f", outline="#2dd4bf"):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=2)


def badge(draw, text, x, y):
    pad_x, pad_y = 24, 12
    tw = draw.textlength(text, font=FONTS["eyebrow"])
    draw.rounded_rectangle((x, y, x + tw + pad_x * 2, y + FONTS["eyebrow"].size + pad_y * 2), radius=22, fill="#0f766e")
    draw.text((x + pad_x, y + pad_y - 2), text, font=FONTS["eyebrow"], fill="#d1fae5")


def fit_image(path: Path, size: tuple[int, int]):
    cache_key = (str(path), size)
    cache = getattr(fit_image, "_cache", {})
    if cache_key in cache:
        return cache[cache_key].copy()

    img = Image.open(path).convert("RGB")
    tw, th = size
    scale = min(tw / img.width, th / img.height)
    nw, nh = int(img.width * scale), int(img.height * scale)
    img = img.resize((nw, nh), Image.Resampling.LANCZOS)
    fitted = Image.new("RGB", (tw, th), "#f8fafc")
    fitted.paste(img, ((tw - nw) // 2, (th - nh) // 2))
    cache[cache_key] = fitted
    fit_image._cache = cache
    return fitted.copy()


def paste_screenshot(canvas, capture_name, box, t):
    x1, y1, x2, y2 = box
    img = fit_image(CAPTURES / capture_name, (x2 - x1, y2 - y1))
    rounded = Image.new("RGBA", img.size, (0, 0, 0, 0))
    mask = Image.new("L", img.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, img.width, img.height), radius=30, fill=255)
    rounded.paste(img.convert("RGBA"), (0, 0), mask)
    shadow = Image.new("RGBA", (img.width + 80, img.height + 80), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.rounded_rectangle((40, 40, 40 + img.width, 40 + img.height), radius=34, fill=(0, 0, 0, 120))
    shadow = shadow.filter(ImageFilter.GaussianBlur(24))
    canvas.alpha_composite(shadow, (x1 - 40, y1 - 35))
    canvas.alpha_composite(rounded, (x1, y1))


def title_scene(scene, t):
    img = background().convert("RGBA")
    draw = ImageDraw.Draw(img)
    panel(draw, (110, 100, W - 110, H - 100), radius=54, fill="#101827")
    badge(draw, scene["eyebrow"], 170, 168)
    draw.text((170, 318), scene["title"], font=FONTS["title"], fill="#f8fafc")
    draw_wrapped(draw, scene["subtitle"], (174, 430), 1080, FONTS["body"], "#dbeafe", 14)
    draw.line((170, H - 220, W - 170, H - 220), fill="#334155", width=2)
    draw.text((170, H - 170), scene["footer"], font=FONTS["small"], fill="#94a3b8")
    draw.rounded_rectangle((W - 650, 300, W - 210, 735), radius=46, fill="#061923", outline="#84cc16", width=3)
    for i, label in enumerate(["business data", "trusted context", "safe action", "receipt"]):
        y = 360 + i * 85
        draw.rounded_rectangle((W - 600, y, W - 260, y + 54), radius=20, fill="#12233b")
        draw.text((W - 575, y + 12), label, font=FONTS["small"], fill="#e2e8f0")
        if i < 3:
            draw.text((W - 440, y + 58), "↓", font=FONTS["h2"], fill="#2dd4bf")
    return img.convert("RGB")


def statement_scene(scene, t):
    img = background().convert("RGBA")
    draw = ImageDraw.Draw(img)
    badge(draw, scene["eyebrow"], 120, 110)
    draw_wrapped(draw, scene["title"], (120, 220), 1350, FONTS["title"], "#f8fafc", 16)
    y = 485
    for i, bullet in enumerate(scene["bullets"]):
        draw.rounded_rectangle((128, y - 6, 184, y + 50), radius=18, fill="#22c55e")
        draw.text((147, y + 5), str(i + 1), font=FONTS["small"], fill="#052e16")
        y = draw_wrapped(draw, bullet, (210, y), 1350, FONTS["body"], "#e2e8f0", 12) + 32
    return img.convert("RGB")


def flow_scene(scene, t):
    img = background().convert("RGBA")
    draw = ImageDraw.Draw(img)
    badge(draw, scene["eyebrow"], 120, 110)
    draw_wrapped(draw, scene["title"], (120, 220), 1500, FONTS["h2"], "#f8fafc", 12)
    x = 145
    for number, label in scene["steps"]:
        box = (x, 520, x + 360, 740)
        panel(draw, box, radius=38, fill="#101c2f", outline="#334155")
        draw.text((x + 34, 555), number, font=FONTS["mono"], fill="#84cc16")
        draw_wrapped(draw, label, (x + 34, 620), 280, FONTS["body"], "#e2e8f0", 8)
        if number != "04":
            draw.text((x + 392, 600), "→", font=FONTS["title"], fill="#2dd4bf")
        x += 425
    return img.convert("RGB")


def screenshot_scene(scene, t):
    img = background().convert("RGBA")
    draw = ImageDraw.Draw(img)
    paste_screenshot(img, scene["image"], (92, 100, 1188, 942), t)
    panel(draw, (1225, 112, 1828, 930), radius=42, fill="#101827", outline="#334155")
    badge(draw, scene["eyebrow"], 1270, 164)
    draw_wrapped(draw, scene["title"], (1270, 268), 500, FONTS["h2"], "#f8fafc", 12)
    y = 560
    for callout in scene["callouts"]:
        draw.rounded_rectangle((1274, y, 1330, y + 56), radius=18, fill="#0f766e")
        draw.text((1290, y + 12), "OK", font=FONTS["small"], fill="#d1fae5")
        y = draw_wrapped(draw, callout, (1355, y + 5), 390, FONTS["small"], "#e2e8f0", 8) + 30
    return img.convert("RGB")


def ending_scene(scene, t):
    img = title_scene(scene, t).convert("RGBA")
    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle((690, 760, 1230, 838), radius=30, fill="#84cc16")
    draw.text((746, 782), "CONTEXT BEFORE ACTION", font=FONTS["small"], fill="#102a13")
    return img.convert("RGB")


def render_scene(scene, t):
    if scene["kind"] == "title":
        return title_scene(scene, t)
    if scene["kind"] == "statement":
        return statement_scene(scene, t)
    if scene["kind"] == "flow":
        return flow_scene(scene, t)
    if scene["kind"] == "screenshot":
        return screenshot_scene(scene, t)
    if scene["kind"] == "ending":
        return ending_scene(scene, t)
    raise ValueError(scene["kind"])


def write_silent_video():
    with imageio.get_writer(
        SILENT,
        fps=FPS,
        codec="libx264",
        quality=9,
        macro_block_size=1,
        ffmpeg_log_level="error",
    ) as writer:
        total_frames = sum(scene["duration"] * FPS for scene in SCENES)
        frame_i = 0
        for scene in SCENES:
            frames = scene["duration"] * FPS
            base_frame = render_scene(scene, 0.45).convert("RGB")
            for f in range(frames):
                frame = base_frame.copy()
                # Small progress bar, useful even without audio.
                draw = ImageDraw.Draw(frame)
                progress = (frame_i + 1) / total_frames
                draw.rounded_rectangle((120, H - 54, W - 120, H - 42), radius=6, fill="#1f2937")
                draw.rounded_rectangle((120, H - 54, 120 + int((W - 240) * progress), H - 42), radius=6, fill="#2dd4bf")
                writer.append_data(np.asarray(frame))
                frame_i += 1


def write_audio():
    SCRIPT_TXT.write_text(NARRATION, encoding="utf-8")
    if AUDIO.exists() and AUDIO.stat().st_size > 0:
        return True
    try:
        subprocess.run(["say", "-r", "176", "-o", str(AUDIO), NARRATION], check=True)
        return True
    except Exception:
        return False


def mux_audio(has_audio: bool):
    if not has_audio:
        SILENT.replace(OUT)
        return
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    cmd = [
        ffmpeg,
        "-y",
        "-i",
        str(SILENT),
        "-i",
        str(AUDIO),
        "-map",
        "0:v:0",
        "-map",
        "1:a:0",
        "-c:v",
        "copy",
        "-c:a",
        "aac",
        "-b:a",
        "160k",
        "-shortest",
        str(OUT),
    ]
    subprocess.run(cmd, check=True)


def main():
    missing = [scene["image"] for scene in SCENES if scene.get("image") and not (CAPTURES / scene["image"]).exists()]
    if missing:
        raise SystemExit(f"Missing video capture(s): {', '.join(missing)}")
    write_silent_video()
    has_audio = write_audio()
    mux_audio(has_audio)
    MANIFEST.write_text(
        json.dumps(
            {
                "output": str(OUT),
                "resolution": f"{W}x{H}",
                "fps": FPS,
                "duration_seconds": sum(scene["duration"] for scene in SCENES),
                "has_narration": has_audio,
                "source_captures": sorted(p.name for p in CAPTURES.glob("*.png")),
                "narration_script": str(SCRIPT_TXT),
            },
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    print(OUT)


if __name__ == "__main__":
    main()
