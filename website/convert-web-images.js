const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// 网站中需要转换的SVG文件列表
const svgFiles = [
  path.join(__dirname, 'images/feature-export.svg'),
  path.join(__dirname, 'images/hero-image.svg'),
  path.join(__dirname, 'images/logo.svg'),
  path.join(__dirname, 'images/feature-auto-save.svg'),
  path.join(__dirname, 'images/feature-history.svg'),
  path.join(__dirname, 'images/feature-ui.svg')
];

// 确保所有文件路径都是正确的
console.log('准备转换以下SVG文件:');
svgFiles.forEach(file => {
  console.log(` - ${file} ${fs.existsSync(file) ? '(存在)' : '(不存在)'}`);
});

async function convertSvgToPng(svgPath) {
  const pngPath = svgPath.replace('.svg', '.png');
  try {
    // 检查源文件是否存在
    if (!fs.existsSync(svgPath)) {
      console.error(`源文件不存在: ${svgPath}`);
      return;
    }
    console.log(`开始转换: ${svgPath}`);
    // 确保文件可读
    
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