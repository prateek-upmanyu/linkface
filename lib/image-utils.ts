/**
 * Secure Avatar Image Processor
 * Enforces strict size limits, rejects malicious SVG payloads to prevent XSS,
 * and normalizes images to a clean 400x400 square format.
 */
export async function processAvatarImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // 1. Strict File Size limit: 2MB max
    const MAX_FILE_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      reject(new Error("Image size must be under 2MB."));
      return;
    }

    // 2. Strict MIME Type checking: Reject SVG to prevent SVG XSS injection
    const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
    if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
      reject(new Error("Please upload a standard image file (PNG, JPG, or WebP). SVGs are disallowed for security."));
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
      img.onerror = () => reject(new Error("Failed to decode image. File may be corrupted."));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read image file."));
    reader.readAsDataURL(file);
  });
}
