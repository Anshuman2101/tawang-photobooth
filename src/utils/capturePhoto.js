// Turns the current video frame into a still image (data URL), applying the
// selected filter directly to the exported pixels (not just a CSS preview).

export function capturePhoto(videoEl, filter) {
  if (!videoEl.videoWidth || !videoEl.videoHeight) {
    throw new Error('Camera is not ready yet. Please wait a moment and try again.');
  }

  const canvas = document.createElement('canvas');
  canvas.width = videoEl.videoWidth;
  canvas.height = videoEl.videoHeight;

  const ctx = canvas.getContext('2d');

  if (filter === 'blackAndWhite') {
    ctx.filter = 'grayscale(100%)';
  }

  // Mirror horizontally so the exported photo matches what the visitor saw
  // in the (mirrored) selfie preview.
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);

  return canvas.toDataURL('image/png');
}
