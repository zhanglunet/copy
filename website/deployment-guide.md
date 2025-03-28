# 复制保存器网站部署指南

本文档详细说明如何将复制保存器官方网站部署到Cloudflare Pages，并配置copy.pub域名。

## Cloudflare Pages部署流程

### 1. 创建Cloudflare Pages项目

1. 登录Cloudflare控制台：https://dash.cloudflare.com
2. 在侧边栏中选择「Pages」
3. 点击「创建项目」按钮
4. 选择「连接到Git」，并授权GitHub仓库
5. 选择包含网站代码的仓库
6. 配置构建设置：
   - 项目名称：`copy-pub`
   - 生产分支：`main`
   - 构建命令：留空（静态网站无需构建）
   - 构建输出目录：`website`
7. 点击「保存并部署」

### 2. 配置环境变量（如需要）

如果网站需要环境变量，可以在Cloudflare Pages项目设置中添加：

1. 进入项目设置
2. 选择「环境变量」
3. 添加所需的环境变量

## 域名配置

### 1. 在Cloudflare添加域名

1. 在Cloudflare控制台中添加`copy.pub`域名
2. 按照Cloudflare的指引更新域名的DNS服务器

### 2. 配置DNS记录

1. 进入`copy.pub`域名的DNS设置
2. 添加以下DNS记录：
   - 类型：`CNAME`
   - 名称：`@`（根域名）
   - 目标：Cloudflare Pages分配的域名（例如：`copy-pub.pages.dev`）
   - 代理状态：已代理（橙色云朵）

### 3. 在Pages项目中添加自定义域名

1. 进入Pages项目设置
2. 选择「自定义域」
3. 点击「设置自定义域」
4. 输入`copy.pub`
5. 点击「继续」并完成验证流程

## GitHub Actions自动部署

项目已配置GitHub Actions工作流，当代码推送到main分支时会自动部署到Cloudflare Pages。

### 配置GitHub Secrets

需要在GitHub仓库设置中添加以下Secrets：

1. `CLOUDFLARE_API_TOKEN`：Cloudflare API令牌
2. `CLOUDFLARE_ACCOUNT_ID`：Cloudflare账户ID

获取方法：
- API令牌：在Cloudflare控制台 > 个人资料 > API令牌 > 创建令牌
- 账户ID：在Cloudflare控制台右侧边栏底部可以找到

## 文件说明

- `.cloudflare/pages.json`：Cloudflare Pages配置文件
- `.github/workflows/cloudflare.yml`：GitHub Actions工作流配置
- `_headers`：HTTP响应头配置
- `_redirects`：URL重定向规则
- `CNAME`：自定义域名配置

## 测试部署

部署完成后，可以通过以下URL访问网站：

- 自定义域名：https://copy.pub
- Cloudflare Pages默认域名：https://copy-pub.pages.dev

## 故障排除

如果部署过程中遇到问题：

1. 检查Cloudflare Pages构建日志
2. 确认GitHub Actions工作流执行状态
3. 验证DNS记录是否正确配置
4. 检查Cloudflare API令牌权限是否正确