# Deployment Guide

This guide will help you deploy your Dress Up Game to various hosting platforms.

## 🚀 GitHub Pages (Recommended)

GitHub Pages is perfect for this static site. Here's how to set it up:

### Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `dressup-game` (or whatever you prefer)
3. Make it public (required for free GitHub Pages)

### Step 2: Upload Your Files

**Option A: Using Git (Recommended)**
```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit"

# Set main branch
git branch -M main

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/dressup-game.git

# Push to GitHub
git push -u origin main
```

**Option B: Using GitHub Web Interface**
1. Go to your repository on GitHub
2. Click "Add file" → "Upload files"
3. Drag and drop all your project files
4. Click "Commit changes"

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on "Settings" tab
3. Scroll down to "Pages" section (in the left sidebar)
4. Under "Source", select "Deploy from a branch"
5. Choose "main" branch and "/ (root)" folder
6. Click "Save"

### Step 4: Your Site is Live!

Your site will be available at:
```
https://YOUR_USERNAME.github.io/dressup-game/
```

**Note:** It may take a few minutes for the site to be available after enabling GitHub Pages.

## 🌐 Alternative Hosting Options

### Netlify

1. Go to [Netlify](https://netlify.com)
2. Drag and drop your entire project folder
3. Your site will be live instantly with a random URL
4. You can customize the URL in the site settings

### Vercel

1. Go to [Vercel](https://vercel.com)
2. Connect your GitHub repository
3. Vercel will automatically detect it's a static site
4. Deploy with one click

### Surge.sh

```bash
# Install Surge globally
npm install -g surge

# Navigate to your project directory
cd dressup-game

# Deploy
surge

# Follow the prompts to create an account and choose a domain
```

### Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase project
firebase init hosting

# Deploy
firebase deploy
```

## 🔧 Custom Domain (Optional)

### GitHub Pages with Custom Domain

1. In your repository settings → Pages
2. Add your custom domain in the "Custom domain" field
3. Create a `CNAME` file in your repository root with your domain:
   ```
   yourdomain.com
   ```
4. Configure your DNS settings to point to GitHub Pages

### Netlify with Custom Domain

1. Go to your site settings in Netlify
2. Click "Domain settings"
3. Add your custom domain
4. Follow the DNS configuration instructions

## 📱 Mobile Testing

After deployment, test your site on:
- Mobile phones (portrait and landscape)
- Tablets
- Different browsers (Chrome, Safari, Firefox, Edge)

## 🔄 Updating Your Site

### GitHub Pages
```bash
# Make your changes locally
# Then push to GitHub
git add .
git commit -m "Update site"
git push
```

GitHub Pages will automatically rebuild and deploy your site.

### Other Platforms
- **Netlify**: Automatic deployment when you push to connected Git repository
- **Vercel**: Automatic deployment when you push to connected Git repository
- **Surge**: Run `surge` again to redeploy
- **Firebase**: Run `firebase deploy` again

## 🐛 Troubleshooting

### Common Issues

1. **Site not loading**: Check if all files are in the correct location
2. **Images not showing**: Ensure image paths are correct and files exist
3. **Mobile not working**: Test the responsive design on different devices
4. **GitHub Pages not updating**: Wait a few minutes, or check the Actions tab

### File Structure Check

Make sure your repository has this structure:
```
dressup-game/
├── index.html
├── style.css
├── script.js
├── traits/
│   ├── skin/
│   ├── clothes/
│   ├── mouth/
│   ├── eyes/
│   └── headwear/
├── .gitignore
├── README.md
└── DEPLOYMENT.md
```

## 📞 Support

If you encounter issues:
1. Check the browser console for errors
2. Verify all files are uploaded correctly
3. Test locally first before deploying
4. Check the hosting platform's documentation
