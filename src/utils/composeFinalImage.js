// Builds the final composite image: captured photos placed into their frame
// slots (cropped proportionally, never stretched), then the frame PNG drawn
// on top so its decorative art overlaps the photos exactly as designed.

import { FRAME_CANVAS, FRAME_SLOTS, frameImagePath } from '../data/frames.js';

const OUTPUT_SCALE = 3; // upscale the 666x375 frame canvas for a crisper download

export async function composeFinalImage({ photoCount, frame, photos }) {
  const canvas = document.createElement('canvas');
  canvas.width = FRAME_CANVAS.width * OUTPUT_SCALE;
  canvas.height = FRAME_CANVAS.height * OUTPUT_SCALE;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#f6efdd';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const slots = FRAME_SLOTS[photoCount];

  for (let i = 0; i < photoCount; i++) {
    const photo = photos[i];
    if (!photo) continue;

    const img = await loadImage(photo.imageData);
    const rect = {
      x: slots.x * canvas.width,
      y: slots.y[i] * canvas.height,
      w: slots.w * canvas.width,
      h: slots.h * canvas.height
    };
    drawImageCover(ctx, img, rect);
  }

  const frameImg = await loadImage(frameImagePath(frame, photoCount));
  ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);

  return canvas;
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// Draws `img` into `rect` cropping proportionally (like CSS background-size: cover),
// so photos are never stretched or distorted.
function drawImageCover(ctx, img, rect) {
  const imgRatio = img.width / img.height;
  const rectRatio = rect.w / rect.h;

  let sx, sy, sw, sh;
  if (imgRatio > rectRatio) {
    sh = img.height;
    sw = sh * rectRatio;
    sx = (img.width - sw) / 2;
    sy = 0;
  } else {
    sw = img.width;
    sh = sw / rectRatio;
    sx = 0;
    sy = (img.height - sh) / 2;
  }

  ctx.drawImage(img, sx, sy, sw, sh, rect.x, rect.y, rect.w, rect.h);
}
