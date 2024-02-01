from PIL import Image
import io

def compress_image(image_bytes: bytes, width: int | None = None, quality: int = 50) -> bytes:
  img = Image.open(io.BytesIO(image_bytes))
  
  # Calculate the height based on the aspect ratio
  if width != None:
    aspect_ratio = img.width / img.height
    height = int(width / aspect_ratio)
  
    img = img.resize((width, height))
  
  img_io = io.BytesIO()
  img.save(img_io, format="JPEG", quality=quality, optimize=True)
  
  return img_io.getvalue()