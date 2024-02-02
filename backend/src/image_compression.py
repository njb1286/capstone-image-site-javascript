from PIL import Image
import io

def compress_image(image_bytes, width=None, quality=90):
    img = Image.open(io.BytesIO(image_bytes))

    if width:
        w_percent = (width / float(img.size[0]))
        h_size = int((float(img.size[1]) * float(w_percent)))
        img = img.resize((width, h_size), Image.BICUBIC)

    # Convert RGBA images to RGB
    if img.mode == 'RGBA':
        img = img.convert('RGB')

    img_io = io.BytesIO()
    img.save(img_io, format="JPEG", quality=quality, optimize=True)
    img_io.seek(0)
    return img_io.read()