# Chrome商店扩展描述

## 扩展名称
### 中文
复制保存器

### 英文
Copy Saver

## 详细描述
### 中文
复制保存器是一个简单而强大的Chrome扩展，它能自动记录和保存您在浏览器中复制的所有内容。无论是文本、链接还是重要信息，都会被安全地保存下来，让您不再担心丢失任何重要的复制内容。

主要功能：
- 自动保存所有复制的内容
- 支持查看和管理历史复制记录
- 简洁的用户界面，易于使用
- 支持导出保存的内容

### 英文
Copy Saver is a simple yet powerful Chrome extension that automatically records and saves everything you copy in your browser. Whether it's text, links, or important information, everything will be safely stored, ensuring you never lose any important copied content.

Key Features:
- Automatically saves all copied content
- View and manage copy history
- Clean user interface, easy to use
- Support for exporting saved content

## 隐私政策说明
复制保存器重视用户隐私，我们仅在本地保存您的复制内容，不会将任何数据上传到云端或与第三方共享。所有数据都存储在您的浏览器本地存储中，您可以随时查看、编辑或删除这些数据。

### 权限使用说明
1. 剪贴板读取权限（clipboardRead）：
   - 用途：监控和捕获用户的复制操作
   - 必要性：这是实现自动保存复制内容的核心功能所必需的
   - 数据使用：仅在本地处理，不会上传或共享

2. 存储权限（storage）：
   - 用途：在浏览器本地存储用户复制的内容
   - 必要性：确保复制的内容能够被安全保存并随时查看
   - 数据使用：所有数据仅存储在用户的浏览器本地存储中

3. 下载权限（downloads）：
   - 用途：支持将保存的复制历史导出为文件
   - 必要性：方便用户备份和迁移历史数据
   - 数据使用：仅在用户明确操作时将数据保存到用户指定的本地位置

4. 内容脚本权限（content_scripts）：
   - 用途：允许在不同网页中捕获复制内容
   - 必要性：确保扩展程序能在所有网页中正常工作
   - 数据使用：仅用于捕获用户复制的内容，不会收集或处理其他页面数据

### 远程代码使用说明
本扩展不使用任何远程代码，所有功能均通过本地代码实现，确保用户数据的安全性和隐私性。

### 数据使用合规性声明
我们确认本扩展的数据使用方式完全符合Chrome开发者计划政策。我们不会收集、存储或传输任何用户的个人信息，所有数据均存储在用户的本地设备中。

Privacy Policy:
Copy Saver values your privacy. We only save your copied content locally and never upload any data to the cloud or share it with third parties. All data is stored in your browser's local storage, and you can view, edit, or delete this data at any time.

### Permission Usage Policy
1. Clipboard Read Permission (clipboardRead):
   - Purpose: Monitor and capture user copy operations
   - Necessity: Essential for the core functionality of automatic copy content saving

2. Storage Permission (storage):
   - Purpose: Store copied content locally in the browser
   - Necessity: Ensure copied content can be safely saved and accessed anytime

3. Download Permission (downloads):
   - Purpose: Support exporting saved copy history as files
   - Necessity: Enable users to backup and migrate historical data

4. Host Permission:
   - Purpose: Allow capturing copy content across different webpages
   - Necessity: Ensure the extension works properly on all websites

### Remote Code Usage Statement
This extension does not use any remote code. All functionalities are implemented through local code to ensure user data security and privacy.

### Data Usage Compliance Statement
We confirm that our extension's data usage fully complies with the Chrome Developer Program Policies. We do not collect, store, or transmit any personal information, and all data is stored locally on the user's device.

## 版本更新说明
### 1.0.0
- 首次发布
- 实现基本的复制内容保存功能
- 添加历史记录查看功能
- 支持数据导出功能