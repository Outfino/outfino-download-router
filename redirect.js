// Device detection and redirect logic
(function() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // iOS detection
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;

    // Android detection
    const isAndroid = /android/i.test(userAgent);

    // Environment detection — `dev.outfino.download` (and any
    // `localhost` for local testing) point at the dev API. Everything
    // else (the canonical `outfino.download`) hits prod. Lets us share
    // one codebase between two Firebase Hosting sites without a build
    // step.
    const host = (window.location.hostname || '').toLowerCase();
    const isDev = host === 'dev.outfino.download' ||
                  host === 'localhost' ||
                  host === '127.0.0.1';
    const apiHost = isDev ? 'dev.api.outfino.io' : 'api.outfino.io';

    // Redirect URLs. The App Store / Play Store links are the same on
    // dev and prod — there's no separate listing. A user opening a
    // dev tracker link only ends up hitting dev API IF the device
    // already runs a TestFlight / Play Internal build that's wired
    // to the dev API; otherwise they get a prod-API install (which
    // is harmless — the tracker view is recorded on dev, the install
    // just won't claim it).
    const iosUrl = 'https://apps.apple.com/hu/app/outfino/id6736884918';
    const androidUrl = 'https://play.google.com/store/apps/details?id=com.outfino.mobile';
    const webUrl = 'https://outfino.io';

    // Extract tracker code from URL if present
    const urlParams = new URLSearchParams(window.location.search);
    const trackerCode = urlParams.get('tracker');

    // Track download-page view if a tracker code is present.
    // The backend uses (ip + timezone + language) as a fingerprint
    // so that when the freshly installed app first asks
    // "/lookup-deferred", it can match the install back to the click
    // that brought the user here.
    function trackView() {
        if (!trackerCode) {
            return Promise.resolve();
        }

        const apiUrl = `https://${apiHost}/v3/download-trackers/track-view/${trackerCode}`;

        // Platform = where this click is about to be redirected to.
        // Lets the admin pie chart on the tracker details screen
        // split clicks by destination (App Store / Play Store /
        // marketing web) — same UA check the redirect itself uses
        // so the platform field can't disagree with the actual
        // redirect target.
        const platform = isIOS ? 'ios' : (isAndroid ? 'android' : 'web');

        const fingerprint = {
            timezoneOffset: new Date().getTimezoneOffset(),
            language: navigator.language || (navigator.languages && navigator.languages[0]) || null,
            platform: platform
        };

        return fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(fingerprint)
        }).catch(function(error) {
            // Silently fail if tracking fails - don't block redirect
            console.error('Tracker view tracking failed:', error);
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

    // Track view first, then redirect (with timeout to not block too long)
    trackView().finally(function() {
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
