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

    // Extract tracker code from URL if present
    const urlParams = new URLSearchParams(window.location.search);
    const trackerCode = urlParams.get('tracker');

    // Track QR code scan if tracker code is present
    function trackScan() {
        if (!trackerCode) {
            return Promise.resolve();
        }

        // Call API to increment scan count
        const apiUrl = `https://api.outfino.io/v3/qr-trackers/increment/${trackerCode}`;

        return fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }).catch(function(error) {
            // Silently fail if tracking fails - don't block redirect
            console.error('QR tracking failed:', error);
        });
    }

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

    // Track scan first, then redirect (with timeout to not block too long)
    trackScan().finally(function() {
        redirect();
    });

    // Safety timeout: redirect after 1 second regardless of tracking status
    setTimeout(function() {
        redirect();
    }, 1000);

    // Fallback: Show manual links after 2 seconds if redirect fails
    setTimeout(function() {
        document.querySelector('.manual-links').style.display = 'block';
    }, 2000);
})();
