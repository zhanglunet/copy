const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// 网站中需要转换的SVG文件列表
const svgFiles = [
  'website/images/feature-export.svg',
  'website/images/hero-image.svg',
  'website/images/logo.svg',
  'website/images/feature-auto-save.svg',
  'website/images/feature-history.svg',
  'website/images/feature-ui.svg'
];

async function convertSvgToPng(svgPath) {
  const pngPath = svgPath.replace('.svg', '.png');
  try {
    // 检查源文件是否存在
    if (!fs.existsSync(svgPath)) {
      console.error(`源文件不存在: ${svgPath}`);
      return;
    }
    
    await sharp(svgPath)
      .png({
        compressionLevel: 9,
        quality: 100,
        chromaSubsampling: '4:4:4',
        force: true
      })
      .toFile(pngPath);
    console.log(`已转换 ${svgPath} 为 ${pngPath}`);
  } catch (error) {
    console.error(`转换 ${svgPath} 时出错:`, error);
  }
}

async function main() {
  for (const svgFile of svgFiles) {
    await convertSvgToPng(svgFile);
  }
  console.log('所有SVG图像已转换为PNG格式');
}

main().catch(console.error);