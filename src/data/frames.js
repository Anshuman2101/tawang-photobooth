// Frame asset locations + photo-slot geometry.
//
// The slot percentages below were measured directly from the transparency
// (alpha channel) of the real frame PNGs supplied in "photobooth assets.zip"
// -- the Figma board could not be opened (requires WebGL + login). If exact
// values are later confirmed from Figma, update ONLY the numbers below.

export const FRAME_CANVAS = { width: 666, height: 375 };

export const FRAME_STYLES = ['frame1', 'frame2', 'frame3', 'frame4'];

// x/width/height are fractions of the frame canvas; y is one fraction per photo row.
export const FRAME_SLOTS = {
  2: { x: 0.73, w: 0.205, h: 0.193, y: [0.072, 0.282] },
  3: { x: 0.183, w: 0.205, h: 0.193, y: [0.072, 0.283, 0.492] },
  4: { x: 0.468, w: 0.205, h: 0.193, y: [0.072, 0.283, 0.492, 0.701] }
};

import { publicAsset } from '../utils/publicAsset.js';

export function frameImagePath(frameStyle, photoCount) {
  const n = frameStyle.replace('frame', '');
  return publicAsset(`assets/frames/frame${n}-${photoCount}.png`);
}
