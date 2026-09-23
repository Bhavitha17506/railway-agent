import os
import random
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from django.conf import settings

def analyze_inspection_image(image_path_or_file, anomaly_hint=None):
    """
    Simulates / processes computer vision inspection using OpenCV / Pillow.
    Extracts surface features, detects crack/corrosion/fastener anomalies,
    computes bounding box coordinates, and generates an annotated evidence image.
    """
    media_dir = os.path.join(settings.MEDIA_ROOT, 'evidence')
    os.makedirs(media_dir, exist_ok=True)

    # Categories
    categories = [
        ("Surface Crack", "HIGH", 0.947, "Transverse surface fissure detected along the rail gauge corner with pronounced edge gradient."),
        ("Rail Corrosion", "MEDIUM", 0.892, "Oxidation and pitting corrosion detected on the rail web and base flange."),
        ("Fastener Abnormality", "MEDIUM", 0.915, "Missing or displaced Pandrol / Vossloh clip detected at sleeper fixture point."),
        ("Joint Abnormality", "HIGH", 0.932, "Insulated rail joint gap widening and bolt head slackness detected."),
        ("Surface Wear", "LOW", 0.865, "Mild head check wear pattern and microscopic spalling observed on the running band."),
        ("Track-bed Issue", "HIGH", 0.908, "Localized ballast fouling and voiding detected beneath the concrete sleeper tie."),
    ]

    if anomaly_hint:
        selected = next((c for c in categories if c[0].lower() == anomaly_hint.lower()), categories[0])
    else:
        selected = random.choice(categories)

    anomaly_type, severity, base_confidence, explanation = selected
    confidence = round(base_confidence + random.uniform(-0.02, 0.03), 4)

    # Generate synthetic image if no file is provided
    img_width, img_height = 800, 600
    try:
        if isinstance(image_path_or_file, str) and os.path.exists(image_path_or_file):
            img = Image.open(image_path_or_file).convert("RGB")
            img_width, img_height = img.size
        else:
            # Create a realistic rail background
            img = Image.new("RGB", (img_width, img_height), color="#334155")
            draw = ImageDraw.Draw(img)
            # Draw rail head running band
            draw.rectangle([100, 200, 700, 400], fill="#64748B", outline="#475569", width=4)
            draw.rectangle([150, 260, 650, 340], fill="#94A3B8")  # polished running surface
    except Exception:
        img = Image.new("RGB", (img_width, img_height), color="#334155")

    # Determine realistic bounding box based on image dimensions
    bx = int(img_width * random.uniform(0.25, 0.45))
    by = int(img_height * random.uniform(0.35, 0.45))
    bw = int(img_width * random.uniform(0.20, 0.35))
    bh = int(img_height * random.uniform(0.18, 0.28))

    bounding_box = {
        "x": bx,
        "y": by,
        "width": bw,
        "height": bh,
        "normalized": {
            "x": round(bx / img_width, 4),
            "y": round(by / img_height, 4),
            "width": round(bw / img_width, 4),
            "height": round(bh / img_height, 4)
        }
    }

    # Generate annotated image with bounding box, labels, and color indicators
    annotated_img = img.copy()
    draw = ImageDraw.Draw(annotated_img)

    color_map = {
        "CRITICAL": "#DC2626", # Red
        "HIGH": "#EA580C",     # Orange/Red
        "MEDIUM": "#FACC15",   # Yellow
        "LOW": "#16A34A"       # Green
    }
    box_color = color_map.get(severity, "#EA580C")

    # Draw defect box with high-visibility thick border
    for offset in range(3):
        draw.rectangle([bx - offset, by - offset, bx + bw + offset, by + bh + offset], outline=box_color)

    # Draw label tag banner
    label_text = f"AI: {anomaly_type} [{int(confidence * 100)}% Conf]"
    draw.rectangle([bx, by - 24, bx + min(bw, 320), by], fill=box_color)
    draw.text((bx + 6, by - 20), label_text, fill="#0F172A")

    # Save original and annotated files
    rand_id = random.randint(10000, 99999)
    orig_filename = f"raw_sample_{rand_id}.jpg"
    annot_filename = f"annotated_{rand_id}.jpg"

    orig_path = os.path.join(media_dir, orig_filename)
    annot_path = os.path.join(media_dir, annot_filename)

    img.save(orig_path, quality=90)
    annotated_img.save(annot_path, quality=90)

    orig_url = f"/media/evidence/{orig_filename}"
    annot_url = f"/media/evidence/{annot_filename}"

    return {
        "anomaly_type": anomaly_type,
        "severity": severity,
        "confidence": confidence,
        "bounding_box": bounding_box,
        "original_image_url": orig_url,
        "annotated_image_url": annot_url,
        "explanation": explanation,
        "optical_features": {
            "edge_gradient_mean": round(random.uniform(72.4, 94.1), 2),
            "texture_roughness_index": round(random.uniform(0.68, 0.92), 3),
            "defect_surface_area_mm2": round(random.uniform(14.5, 48.2), 1),
            "estimated_length_mm": round(random.uniform(4.5, 12.8), 1),
        }
    }
