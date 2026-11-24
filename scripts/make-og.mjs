// Renders the share image (shown when a link to the site is posted) from
// src/assets/og.svg to public/og.png. Run with `npm run og` after editing the
// SVG; the PNG is committed, so CI never needs to render it.
import sharp from 'sharp';

const src = new URL('../src/assets/og.svg', import.meta.url);
const out = new URL('../public/og.png', import.meta.url);

const info = await sharp(src.pathname ? decodeURIComponent(src.pathname) : src, { density: 144 })
  .resize(1200, 630)
  .png({ compressionLevel: 9 })
  .toFile(decodeURIComponent(out.pathname));

console.log(`public/og.png written: ${info.width}×${info.height}, ${(info.size / 1024).toFixed(1)} KB`);
