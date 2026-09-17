// Resizes and compresses an image file entirely in the browser before it's
// stored, so a full-resolution phone photo doesn't bloat the request payload
// or the database record. Returns a base64 data URL (JPEG).
export const resizeImageFile = (file, maxWidth = 1200, quality = 0.75) =>
  new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) {
      reject(new Error("Please choose an image file."));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the selected file."));
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => reject(new Error("Could not process the selected image."));
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
