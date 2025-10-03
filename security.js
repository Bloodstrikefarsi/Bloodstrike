// Security features for the website

// Prevent right-click context menu
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
});

// Disable text selection on certain elements
['header', 'footer', 'nav', '.logo', '.section-header'].forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
        el.style.userSelect = 'none';
        el.style.webkitUserSelect = 'none';
    });
});

// Simple bot detection and protection
(function() {
    // Check if user agent indicates a bot
    const userAgent = navigator.userAgent.toLowerCase();
    const bots = ['bot', 'crawler', 'spider', 'scraper'];
    
    const isBot = bots.some(bot => userAgent.includes(bot));
    
    if (isBot) {
        // Redirect bots or apply restrictions
        console.log('Bot detected, applying restrictions');
        // You can add specific restrictions for bots here
    }
})();

// Protect against iframe embedding
if (window.self !== window.top) {
    window.top.location = window.self.location;
}

// Simple XSS protection for URL parameters
(function() {
    const params = new URLSearchParams(window.location.search);
    const dangerousChars = /[<>"'`]/g;
    
    params.forEach((value, key) => {
        if (dangerousChars.test(value)) {
            // Remove dangerous parameters
            params.delete(key);
        }
    });
    
    // Replace current URL without dangerous parameters
    if (params.toString() !== window.location.search.slice(1)) {
        const newUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
        window.history.replaceState({}, document.title, newUrl);
    }
})();
