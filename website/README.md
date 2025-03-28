# 复制保存器官方网站

这是复制保存器Chrome扩展的官方网站源代码，网站地址：[copy.pub](https://copy.pub)

## 网站内容

- 产品介绍和主要功能
- 下载和安装指南
- 常见问题解答

## 部署说明

本网站通过Cloudflare Pages自动部署。

### 部署流程

1. 将代码推送到GitHub仓库
2. Cloudflare Pages会自动检测代码变更并触发构建
3. 构建完成后，网站会自动部署到Cloudflare的CDN网络

### 域名设置

网站使用`copy.pub`域名，DNS记录已配置为指向Cloudflare Pages服务。

## 本地开发

可以使用任何静态网站服务器在本地预览网站：

```bash
# 使用Python的简易HTTP服务器
python -m http.server

# 或使用Node.js的http-server
npx http-server
```

## 文件结构

- `index.html` - 网站主页
- `css/` - 样式文件
- `images/` - 图片资源
- `downloads/` - 下载文件
- `_headers` - Cloudflare Pages HTTP头配置
- `_redirects` - URL重定向规则