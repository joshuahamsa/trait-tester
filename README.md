# Dress Up Game Webapp

This repository contains a simple web application that allows you to layer multiple trait images (e.g. for an NFT collection) and preview different combinations. The app uses plain HTML, CSS and JavaScript so you can open it locally in a browser or host it anywhere you like. It is intended as a starting point for you and your team to verify that all traits align nicely before finalizing your artwork contract.

## 🌐 Live Demo

This app is designed to be easily deployed to GitHub Pages. Once you push this repository to GitHub, you can enable GitHub Pages in your repository settings to get a live URL like:
```
https://yourusername.github.io/dressup-game/
```

## File Structure

```
dressup-game/
├── index.html      # Main page
├── style.css       # Basic styling (mobile responsive)
├── script.js       # Application logic
├── traits/         # Folder containing sub‑folders for each trait layer
│   ├── skin/
│   ├── clothes/
│   ├── mouth/
│   ├── eyes/
│   └── headwear/
├── .gitignore      # Git ignore file
└── README.md       # Instructions
```

Each trait layer has its own folder under `traits/`. Inside those folders you'll find PNG files with transparent backgrounds. Replace these placeholder images with your actual NFT traits. The file names (without the extension) will be shown in the drop‑down menus on the page.

## 🚀 Deployment Options

### Option 1: GitHub Pages (Recommended)

1. **Create a GitHub repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/dressup-game.git
   git push -u origin main
   ```

2. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Click on "Settings" tab
   - Scroll down to "Pages" section
   - Under "Source", select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click "Save"

3. **Your site will be live at:**
   ```
   https://yourusername.github.io/dressup-game/
   ```

### Option 2: Local Development

This project is completely front‑end based; you do not need a Node server or any special tooling. To try it out locally:

1. Make sure all of the files in the `dressup-game` folder remain together.
2. Simply open `index.html` in your favourite web browser (e.g. drag and drop it into Chrome).
3. The page will load with drop‑down selectors for each trait layer (Skin, Clothes, Mouth, Eyes, Headwear). Selecting a different option from any drop‑down will update the preview image.

### Option 3: Other Hosting Services

- **Netlify**: Drag and drop the entire folder to Netlify
- **Vercel**: Connect your GitHub repository to Vercel
- **Surge.sh**: Use `surge` command line tool
- **Firebase Hosting**: Use Firebase CLI

## 📱 Mobile Responsive

The app is fully mobile responsive and works great on:
- Mobile phones (portrait and landscape)
- Tablets
- Desktop computers
- Touch devices

## 🎨 Adding Your Own Traits

To add your own traits:

1. Replace the placeholder images in the appropriate folders with your `.png` files
2. Keep the file names simple (e.g. `blue-shirt.png`, `red-hat.png`)
3. The script will automatically detect and list all `.png` files in each folder
4. Make sure all images have transparent backgrounds and are the same dimensions

### Resizing large trait images

NFT artwork is typically created at very high resolution (for example 2048×2048). To keep your project lightweight and to speed up loading in the browser, you may want to downscale these assets to 1024×1024 before uploading them. A helper script called `resize_traits.py` is included in this repository. It uses the [Pillow](https://python-pillow.org/) library to resize all PNG files in a directory tree.

Here is an example of how to use the script:

```bash
# Navigate to the folder where your high‑resolution traits are stored
python3 resize_traits.py --input path/to/your/highres/traits --output path/to/resized/traits --size 1024

# This will create a copy of your traits resized to 1024×1024 in the `path/to/resized/traits` directory.
# If you omit the --output flag, the original files will be overwritten, so make sure you have backups!

# To preserve aspect ratio and pad with transparency instead of distorting to a square, add --keep-aspect:
python3 resize_traits.py --input path/to/highres/traits --size 1024 --keep-aspect
```

Once resized, copy the 1024×1024 images into the corresponding subfolders under `traits/`.

## 🎯 Features

- **Real-time preview**: See trait combinations instantly
- **Mobile responsive**: Works on all devices
- **Randomize**: Generate random trait combinations
- **Easy to customize**: Simple file structure
- **No dependencies**: Pure HTML, CSS, and JavaScript
- **Fast loading**: Optimized for performance

## 🔧 Customising

* **Image sizes:** The placeholder images are 500×500 pixels. For best results, use images of the same dimensions, with transparent backgrounds (PNG format). All layers should be the exact same canvas size so that they align correctly when stacked.
* **Trait order:** The layering order is controlled by the `TRAIT_ORDER` array in `script.js`. Currently it is `["skin", "clothes", "mouth", "eyes", "headwear"]`, with `skin` on the bottom and `headwear` on top. If you want to change the order, adjust this array accordingly.
* **Styling:** Feel free to modify `style.css` to change the layout, colours or fonts. The current styles keep the interface minimal so you can focus on the artwork.

## 📄 License

The code in this repository is provided as‑is, without warranty, for demonstration purposes. You are free to adapt it for your needs.