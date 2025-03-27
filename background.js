// background.js
// 处理文件系统操作和逻辑

// 存储目录ID的键名
const DIRECTORY_ID_KEY = 'savedDirectoryId';
const HISTORY_KEY = 'copyHistory';  // 添加历史记录的键名

// 错误处理函数
function errorHandler(error) {
    console.error('文件操作错误:', error);
    // 如果是权限错误，可能需要重新选择目录
    if (error.name === 'SecurityError') {
        chrome.storage.local.remove(DIRECTORY_ID_KEY);
    }
}

// 保存文本到文件
function saveTextToFile(text) {
    // 创建带时间戳的内容
    const timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    const newContent = "[" + timestamp + "] - " + text + "\n\n";  // 添加额外的换行
    
    // 生成文件名（使用当天的日期）
    const today = new Date();
    const dateStr = today.getFullYear() + 
                   String(today.getMonth() + 1).padStart(2, '0') + 
                   String(today.getDate()).padStart(2, '0');
    const filename = `copied_text_${dateStr}.txt`;
    
    // 从storage中读取现有内容
    chrome.storage.local.get(HISTORY_KEY, function(result) {
        // 合并现有内容和新内容
        const existingContent = result[HISTORY_KEY] || '';
        const content = existingContent + newContent;
        
        // 保存更新后的内容到storage
        chrome.storage.local.set({[HISTORY_KEY]: content}, function() {
            // 创建包含所有内容的Blob
            const blob = new Blob([content], {type: 'text/plain'});
            const reader = new FileReader();
            
            reader.onload = function() {
                chrome.downloads.download({
                    url: reader.result,
                    filename: filename,
                    saveAs: false,
                    conflictAction: 'overwrite'  // 覆盖现有文件
                }, function(downloadId) {
                    if (chrome.runtime.lastError) {
                        console.error('下载错误:', chrome.runtime.lastError);
                    } else {
                        console.log('文本已保存，下载ID:', downloadId);
                    }
                });
            };
            
            reader.readAsDataURL(blob);
        });
    });
}

// 设置保存状态
function chooseDirectory(callback) {
    // 直接设置状态为已配置
    chrome.storage.local.set({[DIRECTORY_ID_KEY]: 'configured'}, function() {
        console.log('已配置为使用下载API');
        if (callback) callback();
    });
}

// 检查保存状态
function getSavedDirectory(callback) {
    chrome.storage.local.get(DIRECTORY_ID_KEY, function(items) {
        const savedDirectoryId = items[DIRECTORY_ID_KEY];
        
        if (savedDirectoryId) {
            // 已配置，直接回调
            if (callback) callback();
        } else {
            // 如果未配置，设置配置
            chooseDirectory(callback);
        }
    });
}

// 追加文本到文件（使用下载API）
function appendToFile(directoryEntry, text) {
    // 直接使用saveTextToFile函数保存文本
    saveTextToFile(text);
}

// 处理来自contentScript.js的消息
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.type === "copiedText" && message.text) {
        // 直接保存文本，不再需要获取目录
        saveTextToFile(message.text);
    } else if (message.type === "contentScriptLoaded") {
        console.log("内容脚本已加载");
    }
    
    return true; // 保持消息通道开放以进行异步响应
});

// 扩展程序安装或更新时的处理
chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason === "install") {
        // 首次安装时，自动配置
        chooseDirectory();
        console.log("扩展程序已安装，已自动配置为使用下载API");
    }
});

// 点击扩展图标时的处理（现在使用popup.html，此处不再需要处理）
// chrome.action.onClicked.addListener(function() {
//     // 已使用popup.html替代
// });