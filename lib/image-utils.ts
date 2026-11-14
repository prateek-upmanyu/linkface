/**
 * Client-side image processor: compresses and resizes avatars
 * to a clean 400x400 square format for crisp, fast loading.
 */
export async function processAvatarImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Please upload an image file (PNG, JPG, or WebP)."));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const size = 400; // standard crisp avatar resolution
        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas initialization failed."));
          return;
        }

        // Center crop math
        const minDim = Math.min(img.width, img.height);
        const startX = (img.width - minDim) / 2;
        const startY = (img.height - minDim) / 2;

        ctx.drawImage(
          img,
          startX,
          startY,
          minDim,
          minDim,
          0,
          0,
          size,
          size
        );

        // Convert to efficient WebP (fallback to JPEG)
        try {
          const dataUrl = canvas.toDataURL("image/webp", 0.85);
          resolve(dataUrl);
        } catch {
          const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
          resolve(dataUrl);
        }
      };
      img.onerror = () => reject(new Error("Failed to load image."));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsDataURL(file);
  });
}
