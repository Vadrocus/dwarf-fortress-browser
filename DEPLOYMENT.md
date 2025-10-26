# Deployment Guide - Fortress Terminal

This guide will help you deploy Fortress Terminal as a standalone HTML game that runs across all devices.

## Quick Start

The game is already built and ready to deploy! The `game-build` folder contains everything you need.

## Deployment Options

### Option 1: GitHub Pages (Recommended)

The easiest way to deploy your game online:

1. Go to your GitHub repository settings
2. Navigate to **Settings** > **Pages**
3. Under "Build and deployment":
   - Source: Deploy from a branch
   - Branch: Select your branch (e.g., `main` or `claude/create-html-game-011CUWD8UKTmag41SR2FdBvN`)
   - Folder: Select `/game-build`
4. Click **Save**
5. Your game will be available at: `https://[username].github.io/[repository-name]/`

Note: It may take a few minutes for the site to become available.

### Option 2: Netlify

1. Sign up at [netlify.com](https://netlify.com)
2. Click "Add new site" > "Deploy manually"
3. Drag and drop the `game-build` folder
4. Your game will be live instantly with a free URL

You can also use Netlify Drop: [app.netlify.com/drop](https://app.netlify.com/drop)

### Option 3: Vercel

1. Sign up at [vercel.com](https://vercel.com)
2. Click "Add New" > "Project"
3. Import your GitHub repository
4. Set the root directory to `game-build`
5. Click "Deploy"

### Option 4: Local Hosting

To run the game on your local network:

```bash
# Navigate to the game-build folder
cd game-build

# Start a simple HTTP server (Python 3)
python3 -m http.server 8080

# Or use Node.js
npx serve -p 8080
```

Then open `http://localhost:8080` in your browser.

### Option 5: Any Static Hosting Service

Upload the contents of the `game-build` folder to any static hosting service:

- **Firebase Hosting**: `firebase deploy`
- **Amazon S3**: Upload to S3 bucket with static website hosting
- **Cloudflare Pages**: Connect your repo or upload directly
- **surge.sh**: `surge game-build`

## Building from Source

If you want to make changes and rebuild:

```bash
# Navigate to the FortressGameAll folder
cd FortressGameAll

# Install dependencies (first time only)
npm install

# Build for production
npm run build

# The built files will be in dist/public/
# Copy them to game-build folder
cd ..
rm -rf game-build
cp -r FortressGameAll/dist/public game-build
```

## Mobile Support

The game is already optimized for mobile devices with:
- Responsive viewport settings
- Touch-friendly controls
- Adaptive layout

However, for the best experience, we recommend playing on tablets or desktops due to the complexity of the UI.

## Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for fonts (Google Fonts)
- JavaScript enabled

## File Structure

```
game-build/
├── index.html           # Main HTML file
├── favicon.png          # Game icon
└── assets/
    ├── index-*.js       # Bundled JavaScript
    └── index-*.css      # Bundled styles
```

## Troubleshooting

**Game doesn't load:**
- Make sure JavaScript is enabled
- Check browser console for errors
- Ensure all files are uploaded correctly

**Fonts not displaying:**
- Check internet connection (fonts load from Google Fonts CDN)
- Clear browser cache

**GitHub Pages shows 404:**
- Wait a few minutes after deployment
- Check that the correct folder is selected in settings
- Ensure index.html is in the root of the selected folder

## Custom Domain

If you want to use a custom domain:

1. **GitHub Pages**: Add a `CNAME` file to `game-build` with your domain
2. **Netlify/Vercel**: Configure in their dashboard

## License

MIT License - Feel free to deploy and share!
