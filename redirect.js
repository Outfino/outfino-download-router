// Device detection and redirect logic
(function() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // iOS detection
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;

    // Android detection
    const isAndroid = /android/i.test(userAgent);

    // Redirect URLs
    const iosUrl = 'https://apps.apple.com/hu/app/outfino/id6736884918';
    const androidUrl = 'https://play.google.com/store/apps/details?id=com.outfino.mobile';
    const webUrl = 'https://outfino.io';

    // Perform redirect
    function redirect() {
        if (isIOS) {
            window.location.href = iosUrl;
        } else if (isAndroid) {
            window.location.href = androidUrl;
        } else {
            window.location.href = webUrl;
        }
    }

    // Redirect immediately on page load
    redirect();

    // Fallback: Show manual links after 2 seconds if redirect fails
    setTimeout(function() {
        document.querySelector('.manual-links').style.display = 'block';
    }, 2000);
})();
