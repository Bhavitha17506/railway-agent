"""
RailGuard AI — Preprocessing & Image Transformation Pipeline
Prepares raw track images with contrast enhancement, histogram equalization, and ROI cropping.
"""

from PIL import Image, ImageEnhance, ImageFilter

def preprocess_rail_frame(image, target_size=(800, 600)):
    """
    Standardizes input frame dimensions and applies adaptive contrast enhancement.
    """
    if isinstance(image, str):
        img = Image.open(image).convert("RGB")
    else:
        img = image.convert("RGB")

    # Resize
    img = img.resize(target_size, Image.Resampling.LANCZOS)

    # Enhance track surface contrast
    enhancer = ImageEnhance.Contrast(img)
    img_enhanced = enhancer.enhance(1.25)

    # Edge sharpness
    img_sharp = img_enhanced.filter(ImageFilter.SHARPEN)

    return img_sharp
