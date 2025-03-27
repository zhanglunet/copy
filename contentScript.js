// contentScript.js
// 监听复制事件并捕获文本

function sendMessageToBackground(text) {
    try {
        chrome.runtime.sendMessage({
            type: "copiedText", 
            text: text
        }, function(response) {
            if (chrome.runtime.lastError) {
                console.error('发送消息错误:', chrome.runtime.lastError);
                // 如果是扩展上下文失效，可以尝试重新加载页面
                if (chrome.runtime.lastError.message.includes('Extension context invalidated')) {
                    console.log('扩展上下文已失效，请刷新页面或重新启用扩展');
                }
            }
        });
    } catch (error) {
        console.error('发送消息时出错:', error);
    }
}

document.addEventListener('copy', function(event) {
    // 获取选中的文本
    const text = window.getSelection().toString();
    
    // 如果有选中的文本，则发送消息到background.js
    if (text && text.trim().length > 0) {
        sendMessageToBackground(text);
    }
});

// 向background.js发送内容脚本已加载的消息
try {
    chrome.runtime.sendMessage({type: "contentScriptLoaded"}, function(response) {
        if (chrome.runtime.lastError) {
            console.error('发送加载消息错误:', chrome.runtime.lastError);
        }
    });
} catch (error) {
    console.error('发送加载消息时出错:', error);
}