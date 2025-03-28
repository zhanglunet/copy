const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgFiles = [
  'images/icon16.svg',
  'images/icon48.svg',
  'images/icon128.svg',
  'images/promo-large.svg',
  'images/promo-small.svg'
];

async function convertSvgToPng(svgPath) {
  const pngPath = svgPath.replace('.svg', '.png');
  try {
    await sharp(svgPath)
      .png({
        compressionLevel: 9,
        quality: 100,
        chromaSubsampling: '4:4:4',
        force: true
      })
      .toFile(pngPath);
    console.log(`Converted ${svgPath} to ${pngPath}`);
  } catch (error) {
    console.error(`Error converting ${svgPath}:`, error);
  }
}

async function main() {
  for (const svgFile of svgFiles) {
    await convertSvgToPng(svgFile);
  }
}

main().catch(console.error);