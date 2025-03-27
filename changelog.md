# 错误修改日志

本文档记录了"复制内容保存器"Chrome扩展程序开发过程中遇到的错误和修复情况，以便后续调试和参考。

## 2023-06-15

### 文件系统API权限问题

**问题描述**：
初始版本使用Chrome的文件系统API（chrome.fileSystem）来让用户选择保存目录，但在实际使用中发现权限获取复杂且容易失败。

**原因分析**：
- Chrome扩展的文件系统API需要特殊权限
- 用户可能拒绝授予权限
- 权限可能在浏览器重启后失效

**解决方案**：
- 改用chrome.downloads API替代文件系统API
- 将文件直接保存到用户的下载文件夹，简化权限管理
- 在background.js中实现了新的saveTextToFile函数

## 2023-06-20

### TypeError错误：无法读取未定义属性

**问题描述**：
在某些情况下，扩展程序会抛出TypeError，提示无法读取未定义对象的属性。

**原因分析**：
- 在处理chrome.storage.local.get回调时，没有正确检查返回的对象是否包含预期的键
- 在某些情况下，directoryEntry可能为null或undefined

**解决方案**：
- 添加了更严格的空值检查
- 在调用API前确保对象存在
- 改进了错误处理函数errorHandler

## 2023-07-05

### 无法复制内容问题

**问题描述**：
某些网站上的复制操作无法被扩展程序捕获。

**原因分析**：
- 某些网站使用自定义的复制机制，不触发标准的copy事件
- 内容安全策略(CSP)可能阻止内容脚本执行

**解决方案**：
- 优化了contentScript.js中的事件监听逻辑
- 确保在document完全加载后再添加事件监听器

## 2023-07-10

### 保存文件失败问题

**问题描述**：
有时复制的内容无法成功保存到文件中。

**原因分析**：
- 下载API可能因为网络问题或权限问题而失败
- Blob URL创建后没有及时释放，可能导致内存泄漏

**解决方案**：
- 添加了更完善的错误处理
- 确保在下载完成后释放Blob URL
- 在下载失败时提供用户反馈

## 2023-07-15

### UI响应问题

**问题描述**：
点击"启用自动保存"按钮后，UI状态更新不及时。

**原因分析**：
- 状态更新逻辑依赖于storage事件，但有时事件触发不及时
- 成功消息显示逻辑不完善

**解决方案**：
- 改进了popup.js中的updateStatus函数
- 添加了直接更新UI的逻辑，不完全依赖事件
- 优化了成功消息的显示和消失动画

## 2023-07-20

### TypeError: URL.createObjectURL不是一个函数

**问题描述**：
在background.js中调用saveTextToFile函数时，出现TypeError错误：URL.createObjectURL不是一个函数。

**原因分析**：
- 在Chrome扩展的background脚本中，全局的URL对象可能不可用
- 直接使用URL.createObjectURL而不是通过window.URL或self.URL调用导致错误

**解决方案**：
- 将URL.createObjectURL替换为self.URL.createObjectURL
- 确保在background脚本中正确访问URL API
- 添加注释说明在background脚本中访问URL API的正确方式

## 2023-07-25

### TypeError: self.URL.createObjectURL不是一个函数

**问题描述**：
在background.js中调用saveTextToFile函数时，出现TypeError错误：self.URL.createObjectURL不是一个函数。

**原因分析**：
- 在Chrome扩展的background脚本中，self.URL可能不可用
- 使用self.URL.createObjectURL导致错误

**解决方案**：
- 将self.URL.createObjectURL替换为window.URL.createObjectURL
- 将self.URL.revokeObjectURL替换为window.URL.revokeObjectURL
- 确保在background脚本中使用正确的URL API

## 2023-07-30

### TypeError: window is not defined

**问题描述**：
在background.js中调用saveTextToFile函数时，出现TypeError错误：window is not defined。

**原因分析**：
- 在Chrome扩展的Service Worker（background.js）中不能直接访问window对象
- 使用window.URL.createObjectURL和window.URL.revokeObjectURL导致错误

**解决方案**：
- 将window.URL.createObjectURL替换为self.URL.createObjectURL
- 将window.URL.revokeObjectURL替换为self.URL.revokeObjectURL
- 添加注释说明在Service Worker中正确访问URL API的方式

## 2023-08-01

### TypeError: self.URL.createObjectURL is not a function

**问题描述**：
在background.js中调用saveTextToFile函数时，出现TypeError错误：self.URL.createObjectURL is not a function。

**原因分析**：
- 在Chrome扩展的Service Worker中，无法使用window.URL或self.URL
- Service Worker环境下URL API的访问方式需要重新设计

**解决方案**：
- 改用FileReader API来创建数据URL
- 使用readAsDataURL方法将Blob转换为base64编码的URL
- 移除对URL.createObjectURL和URL.revokeObjectURL的依赖
- 简化了文件保存流程，减少了潜在的错误点

这个解决方案避免了使用URL.createObjectURL，而是使用更可靠的FileReader API，应该能在Service Worker环境中正常工作。

## 2023-08-02

### TypeError: Invalid conflictAction value

**问题描述**：
在background.js中调用chrome.downloads.download时出现错误：Error at property 'conflictAction': Value must be one of overwrite, prompt, uniquify.

**原因分析**：
- chrome.downloads.download API的conflictAction参数只接受'overwrite'、'prompt'或'uniquify'这三个值
- 我们错误地使用了'append'值，这不是有效的选项

**解决方案**：
- 将conflictAction的值从'append'改为'uniquify'
- 'uniquify'选项会在文件名冲突时自动添加数字后缀，确保每次保存都是新文件
- 这样可以保留所有复制的内容，而不是覆盖之前的文件

这个修改确保了下载API能够正确处理文件名冲突的情况，每次复制的内容都会被保存在一个新的文件中。

## 2023-08-03

### Extension context invalidated 错误

**问题描述**：
在使用扩展程序时出现"Extension context invalidated"错误，导致无法发送消息到background.js。

**原因分析**：
- 当扩展程序被禁用、重新加载或更新时，扩展的上下文会被销毁
- contentScript.js继续尝试发送消息到已失效的扩展上下文
- 缺少适当的错误处理机制

**解决方案**：
- 在contentScript.js中添加了错误处理逻辑
- 将消息发送逻辑封装到单独的函数中
- 添加try-catch块来捕获可能的错误
- 当检测到扩展上下文失效时，提示用户刷新页面或重新启用扩展
- 为所有chrome.runtime.sendMessage调用添加错误处理

这个修改提高了扩展程序的稳定性，使其能够优雅地处理扩展上下文失效的情况，并为用户提供清晰的错误提示。

## 2023-08-04

### 改进文件保存机制

**更新描述**：
修改了文件保存机制，使所有复制的内容都保存到同一个文件中，而不是创建多个文件。

**原因**：
- 之前的实现会为每次复制创建一个新文件，导致文件过多
- 用户需要在同一个文件中查看所有复制的内容
- 需要一个更简洁的文件管理方式

**实现方案**：
- 使用fetch API尝试读取现有文件内容
- 将新复制的内容追加到现有内容后面
- 使用conflictAction: 'overwrite'覆盖现有文件
- 保持时间戳格式，方便追踪每条内容的复制时间

这个更新使得扩展程序的使用更加方便，所有复制的内容都集中在一个文件中，便于查看和管理。

## 2023-08-05

### 文件内容覆盖问题

**问题描述**：
使用fetch API读取现有文件内容的方式导致每次复制都会覆盖之前的内容，而不是追加。

**原因分析**：
- 使用fetch API尝试读取本地文件是不可行的，因为扩展无法直接访问下载的文件
- 没有一个可靠的方式来保存历史内容

**解决方案**：
- 使用chrome.storage.local API来保存复制历史
- 添加HISTORY_KEY常量来存储所有复制的内容
- 每次保存新内容时，先从storage中读取现有内容
- 将新内容追加到现有内容后，再保存回storage
- 最后将完整内容下载为文件

这个修改确保了所有复制的内容都能被正确保存和追加，不会丢失历史记录。

## 2023-08-06

### 改进内容格式和文件命名

**更新描述**：
改进了保存内容的格式和文件命名方式，使其更加清晰和有组织。

**改进内容**：
- 在每条复制记录之间添加空行，提高可读性
- 使用日期作为文件名（例如：copied_text_20230806.txt）
- 每天的内容保存在独立的文件中，方便按日期查找

**实现方案**：
- 修改newContent的格式，在每条记录后添加额外的换行符
- 使用当前日期生成文件名
- 使用padStart确保月份和日期始终是两位数

这个更新使得保存的内容更容易阅读，并且文件组织更加清晰。

## 总结

通过以上一系列错误修复，我们解决了以下主要问题：
1. 文件系统API的权限问题
2. 未定义属性的TypeError错误
3. 复制内容捕获问题
4. 文件保存失败问题
5. UI响应问题
6. URL API访问问题

这些修复确保了扩展程序能够稳定运行，正确捕获复制内容并保存到文件中。我们将继续监控和改进扩展程序的性能和可靠性。