// 复制保存器网站主要JavaScript文件

document.addEventListener('DOMContentLoaded', function() {
  // 平滑滚动效果
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80, // 考虑固定导航栏的高度
          behavior: 'smooth'
        });
      }
    });
  });
  
  // 当前年份更新
  const currentYear = new Date().getFullYear();
  const copyrightElement = document.querySelector('.footer-bottom p');
  if (copyrightElement) {
    copyrightElement.textContent = copyrightElement.textContent.replace('2023', currentYear);
  }
});