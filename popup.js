// popup.js
// 处理弹出界面的交互逻辑

// 本地化函数
function getLocalizedMessage(messageName) {
    return chrome.i18n.getMessage(messageName) || messageName;
}

document.addEventListener('DOMContentLoaded', function() {
    const chooseDirectoryButton = document.getElementById('chooseDirectory');
    const statusElement = document.getElementById('status');
    const DIRECTORY_ID_KEY = 'savedDirectoryId';
    
    // 本地化UI元素
    chooseDirectoryButton.textContent = getLocalizedMessage('autoSaveButton');
    
    // 更新状态显示
    function updateStatus() {
        chrome.storage.local.get(DIRECTORY_ID_KEY, function(items) {
            const savedDirectoryId = items[DIRECTORY_ID_KEY];
            
            if (savedDirectoryId) {
                statusElement.textContent = getLocalizedMessage('statusEnabled');
                statusElement.style.color = '#4caf50';
                chooseDirectoryButton.textContent = '已启用自动保存';
                chooseDirectoryButton.disabled = true;
            } else {
                statusElement.textContent = getLocalizedMessage('statusWaiting');
                statusElement.style.color = '#f44336';
            }
        });
    }
    
    // 初始化时更新状态
    updateStatus();
    
    // 点击启用自动保存按钮
    chooseDirectoryButton.addEventListener('click', function() {
        // 设置配置状态
        chrome.storage.local.set({[DIRECTORY_ID_KEY]: 'configured'}, function() {
            console.log('已配置为使用下载API');
            updateStatus();
            // 显示成功消息
            const successMessage = document.createElement('div');
            successMessage.textContent = '✓ 自动保存已启用';
            successMessage.style.color = '#4caf50';
            successMessage.style.fontWeight = 'bold';
            successMessage.style.marginTop = '10px';
            document.body.appendChild(successMessage);
            
            // 3秒后移除成功消息
            setTimeout(function() {
                successMessage.style.transition = 'opacity 1s';
                successMessage.style.opacity = '0';
                setTimeout(function() {
                    document.body.removeChild(successMessage);
                }, 1000);
            }, 2000);
        });
    });
    
    // 监听存储变化，更新状态
    chrome.storage.onChanged.addListener(function(changes, namespace) {
        if (namespace === 'local' && DIRECTORY_ID_KEY in changes) {
            updateStatus();
        }
    });
});