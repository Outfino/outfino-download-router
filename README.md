# Outfino Download Router

Device-aware redirect website for Outfino app downloads.

## Features

- Automatic device detection (iOS, Android, Other)
- Instant redirect to appropriate app store
- Fallback manual download buttons
- Clean, minimal UI with loading animation

## Redirects

- **iOS devices** → App Store: https://apps.apple.com/hu/app/outfino/id6736884918
- **Android devices** → Play Store: https://play.google.com/store/apps/details?id=com.outfino.mobile
- **Other devices** → Website: https://outfino.io

## Local Testing

```bash
npm start
# or
python3 -m http.server 8080
```

Then open: http://localhost:8080

## Deployment

This is a static website. Deploy the contents to your web server or hosting service (e.g., Netlify, Vercel, GitHub Pages) and point the `outfino.download` domain to it.

## Files

- `index.html` - Main HTML structure
- `redirect.js` - Device detection and redirect logic
- `style.css` - Styling and animations
- `package.json` - Project configuration
