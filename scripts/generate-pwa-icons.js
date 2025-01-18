import sharp from 'sharp';
import { mkdir } from 'fs/promises';
import { dirname } from 'path';

const sizes = [192, 512];

async function ensureDir(file) {
  await mkdir(dirname(file), { recursive: true });
}

async function generateIcons() {
  console.log('Generating PWA icons...');
  
  for (const size of sizes) {
    const outputFile = `public/pwa-${size}x${size}.png`;
    await ensureDir(outputFile);
    
    await sharp('public/icon.svg')
      .resize(size, size)
      .png()
      .toFile(outputFile);
      
    console.log(`Generated ${outputFile}`);
  }
  
  console.log('PWA icons generated successfully');
}

generateIcons().catch(console.error);
