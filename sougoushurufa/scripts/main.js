// 主要JavaScript功能

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化导航栏滚动效果
    initNavbarScroll();
    
    // 初始化平滑滚动
    initSmoothScroll();
    
    // 初始化动画效果
    initAnimations();
    
    // 初始化下载按钮功能
    initDownloadButton();
});

// 导航栏滚动效果
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // 添加背景模糊效果
        if (scrollTop > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
        
        lastScrollTop = scrollTop;
    });
}

// 平滑滚动功能
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-item[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // 减去导航栏高度
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 动画效果初始化
function initAnimations() {
    // 创建Intersection Observer用于滚动动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 观察所有需要动画的元素
    const animatedElements = document.querySelectorAll('.section-title, .section-description, .feature-list, .placeholder-image');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// 下载按钮功能
function initDownloadButton() {
    const downloadButtons = document.querySelectorAll('.download-button, .download-btn');
    
    downloadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 显示下载提示
            showDownloadMessage();
            
            // 这里可以添加实际的下载逻辑
            // 例如：window.open('下载链接', '_blank');
        });
    });
}

// 显示下载消息
function showDownloadMessage() {
    // 创建提示消息
    const message = document.createElement('div');
    message.className = 'download-message';
    message.innerHTML = `
        <div class="message-content">
            <h3>下载提示</h3>
            <p>下载链接将在后续更新中提供</p>
            <button onclick="this.parentElement.parentElement.remove()">确定</button>
        </div>
    `;
    
    // 添加样式
    message.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    const messageContent = message.querySelector('.message-content');
    messageContent.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 10px;
        text-align: center;
        max-width: 400px;
        margin: 20px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    `;
    
    messageContent.querySelector('button').style.cssText = `
        background: #007bff;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        margin-top: 15px;
        font-size: 14px;
    `;
    
    // 添加到页面
    document.body.appendChild(message);
    
    // 3秒后自动关闭
    setTimeout(() => {
        if (message.parentElement) {
            message.remove();
        }
    }, 3000);
}

// 全局下载处理函数
function handleDownload() {
    showDownloadMessage();
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    .download-message {
        animation: fadeIn 0.3s ease;
    }
`;
document.head.appendChild(style);

// 页面滚动进度指示器
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #007bff, #0056b3);
        z-index: 10001;
        transition: width 0.1s ease;
    `;
    
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        
        progressBar.style.width = progress + '%';
    });
}

// 初始化滚动进度条
initScrollProgress(); 