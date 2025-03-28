# 复制保存器：从开发到部署的全过程

在这篇文章中，我将详细介绍复制保存器Chrome扩展的开发历程，以及如何将其官方网站部署到Cloudflare Pages，实现自动化的持续部署流程。

## 项目背景

复制保存器（Copy Saver）是一个Chrome扩展，它能够自动捕获并保存用户在浏览器中复制的所有内容。这个项目源于日常工作中的一个痛点：我们经常需要从网页上复制大量文本内容，这些内容散落在剪贴板中，很容易丢失。通过自动收集这些内容到一个文本文件中，用户可以更方便地进行二次加工和处理，特别是与大语言模型结合使用时。

## 扩展开发过程

### 核心功能实现

复制保存器的核心功能是监听浏览器中的复制事件，捕获复制的文本内容，并将其保存下来。实现这一功能主要依靠以下几个组件：

1. **contentScript.js**：注入到网页中的脚本，负责监听复制事件
2. **background.js**：后台脚本，处理文件保存逻辑
3. **popup.html/popup.js**：用户界面，提供简单的配置选项

在`contentScript.js`中，我们使用DOM事件监听器来捕获用户的复制操作：

```javascript
document.addEventListener('copy', function(event) {
    // 获取选中的文本
    const text = window.getSelection().toString();
    
    // 如果有选中的文本，则发送消息到background.js
    if (text && text.trim().length > 0) {
        sendMessageToBackground(text);
    }
});
```

而在`background.js`中，我们实现了文本保存的核心逻辑，为复制的文本添加时间戳，并将其追加到当天的文本文件中。

### 开发挑战与解决方案

在开发过程中，我们遇到了一些挑战：

1. **文件系统API权限问题**：最初计划使用Chrome的文件系统API让用户选择保存目录，但这种方式存在权限获取复杂且容易失效的问题。我们改用`chrome.downloads` API替代文件系统API，将文件直接保存到用户的下载文件夹，大大简化了权限管理。

2. **复制事件捕获问题**：某些网站使用自定义的复制机制，导致扩展程序无法捕获复制操作。我们优化了事件监听逻辑，增强了对不同复制机制的兼容性。

## 官方网站开发

为了推广复制保存器扩展，我们开发了一个官方网站。网站采用静态HTML、CSS和JavaScript构建，主要包含以下内容：

- 产品介绍和主要功能
- 下载和安装指南
- 常见问题解答

### SVG到PNG的转换解决方案

在网站开发过程中，我们选择使用SVG格式的图像作为主要图形资源，因为SVG具有无损缩放、文件小、易于编辑等优点。然而，为了兼容所有浏览器和确保最佳显示效果，我们需要同时提供PNG格式的图像作为备选。

为了自动化这一转换过程，我们开发了两个转换脚本：

1. **convert.js**：用于转换扩展图标和宣传图片
2. **convert-web-images.js**：用于转换网站中的SVG图像

以下是`convert-web-images.js`的核心代码：

```javascript
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
```

这个脚本使用`sharp`库进行图像处理，它能够高效地将SVG文件转换为高质量的PNG图像。通过这种方式，我们可以在设计过程中专注于SVG格式，然后自动生成所需的PNG文件，大大提高了工作效率。

## 自动化部署流程

为了简化网站的更新和部署过程，我们采用了Cloudflare Pages作为托管平台，并配置了GitHub Actions实现自动化部署。

### Cloudflare Pages配置

Cloudflare Pages是一个静态网站托管服务，它提供了全球CDN分发、自动HTTPS、自定义域名等功能。我们通过以下步骤配置了Cloudflare Pages：

1. 创建Cloudflare Pages项目，连接到GitHub仓库
2. 配置构建设置，指定`website`目录作为输出目录
3. 添加自定义域名`copy.pub`

在`.cloudflare/pages.json`文件中，我们定义了Pages项目的配置：

```json
{
  "name": "copy-pub",
  "main": "website",
  "build": {
    "baseDirectory": "website",
    "command": null,
    "destinationDirectory": "."
  },
  "routes": [
    { "pattern": "**/*", "script": null }
  ],
  "headers": {
    "/*": {
      "X-Frame-Options": "DENY",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer-when-downgrade",
      "Permissions-Policy": "camera=(), microphone=(), geolocation=()"
    }
  }
}
```

### GitHub Actions自动部署

为了实现持续部署，我们配置了GitHub Actions工作流。每当代码推送到main分支或有针对main分支的Pull Request时，GitHub Actions会自动触发部署流程，将最新的网站内容部署到Cloudflare Pages。

以下是`.github/workflows/cloudflare.yml`文件的内容：

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    name: Deploy to Cloudflare Pages
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: copy-pub
          directory: website
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

这个工作流使用官方的Cloudflare Pages Action，需要配置两个关键的GitHub Secrets：

1. `CLOUDFLARE_API_TOKEN`：Cloudflare API令牌
2. `CLOUDFLARE_ACCOUNT_ID`：Cloudflare账户ID

通过这种配置，我们实现了完全自动化的部署流程：开发人员只需将更改推送到GitHub仓库，剩下的部署工作会自动完成。

## 域名配置

为了提供更专业的用户体验，我们为复制保存器官方网站注册了`copy.pub`域名，并将其配置到Cloudflare Pages项目中：

1. 在Cloudflare控制台中添加`copy.pub`域名
2. 配置DNS记录，将根域名指向Cloudflare Pages分配的域名
3. 在Pages项目中添加自定义域名

通过这种配置，用户可以通过`https://copy.pub`访问官方网站，同时享受Cloudflare提供的CDN加速和安全保护。

## 总结与经验分享

通过复制保存器项目的开发和部署过程，我们积累了一些有价值的经验：

1. **使用SVG格式的图像**：SVG格式不仅文件小，而且可以无损缩放，非常适合网站和扩展程序的图标设计。通过自动化转换脚本，可以同时兼顾设计灵活性和兼容性。

2. **自动化部署流程**：利用GitHub Actions和Cloudflare Pages的集成，可以实现完全自动化的部署流程，大大减少了手动操作的工作量和出错可能。

3. **安全配置**：通过合理配置HTTP响应头和权限策略，可以提高网站的安全性，防止常见的安全问题。

4. **文档驱动开发**：详细的部署文档不仅有助于团队协作，也方便后期维护和问题排查。

复制保存器项目从创意到实现，再到部署上线，展示了现代Web开发的完整流程。通过合理利用各种工具和服务，我们可以高效地开发和部署Web应用，为用户提供更好的体验。

如果你对复制保存器感兴趣，可以访问[官方网站](https://copy.pub)了解更多信息，或者直接从[Chrome网上应用店](https://chrome.google.com/webstore/detail/copy-saver/)安装扩展程序。