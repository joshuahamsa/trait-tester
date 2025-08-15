# 🎭 Ravager Trait Tester - Discord Activity

A Discord Activity that allows users to test and preview trait combinations for Ravager NFTs directly within Discord. This activity is designed for single-player use in DMs, perfect for team members to review traits without leaving Discord.

## ✨ Features

- **Discord Integration**: Full Discord Activity SDK integration
- **Rich Presence**: Shows current trait selections in Discord status
- **Real-time Updates**: Activity state updates as you change traits
- **Share Combinations**: Share your favorite combinations with team members
- **Discord Styling**: Beautiful Discord-themed UI with gradients and blur effects
- **Single Player**: Designed for individual use in DMs
- **GitHub Hosted**: Easy to update and maintain via GitHub

## 🚀 Quick Start

### 1. Deploy to GitHub Pages

1. **Push to GitHub**: Upload the entire project to a GitHub repository
2. **Enable GitHub Pages**: 
   - Go to repository Settings → Pages
   - Select "Deploy from a branch" → "main" → "/ (root)"
   - Your site will be live at `https://yourusername.github.io/dressup-game/`

### 2. Configure Discord Activity

1. **Update URLs**: Edit `discord-activity/index.html` and replace:
   - `https://yourusername.github.io/dressup-game/` with your actual GitHub Pages URL
   - `YOUR_APPLICATION_ID` in `activity.json` with your Discord application ID

2. **Add Assets**: Create and upload activity images:
   - `assets/large-image.png` (512x512px)
   - `assets/small-image.png` (128x128px)

### 3. Test the Activity

1. **Open in Discord**: Use the Discord Activity launcher
2. **Test Features**: Try changing traits and see Discord status updates
3. **Share Combinations**: Use the "Share Combination" button

## 📁 File Structure

```
discord-activity/
├── index.html              # Discord activity version of the main page
├── discord-activity.js     # Discord SDK integration
├── activity.json          # Activity configuration
├── manifest.json          # Activity manifest
└── README.md             # This file
```

## 🎨 Discord Activity Features

### Rich Presence Integration
- **Real-time Status**: Shows current trait selections in Discord
- **Activity Details**: Displays trait combination information
- **Timestamps**: Tracks how long you've been testing traits
- **Assets**: Custom images for the activity

### UI Enhancements
- **Discord Theme**: Beautiful Discord-inspired design
- **Gradient Backgrounds**: Discord brand colors and gradients
- **Glass Morphism**: Modern blur effects and transparency
- **Responsive Design**: Works on all Discord client sizes

### Sharing Features
- **Share Button**: Share combinations directly to Discord
- **Clipboard Fallback**: Copies combination text if Discord sharing fails
- **Combination Format**: Clean, readable trait descriptions

## 🔧 Configuration

### Activity Settings (`activity.json`)
```json
{
  "name": "Ravager Trait Tester",
  "type": "ACTIVITY",
  "description": "Test and preview trait combinations for Ravager NFTs",
  "application_id": "YOUR_APPLICATION_ID",
  "supported_platforms": ["desktop"],
  "launch_url": "https://yourusername.github.io/dressup-game/discord-activity/"
}
```

### Discord SDK Integration (`discord-activity.js`)
- **Automatic Connection**: Connects to Discord on page load
- **State Management**: Updates activity state based on trait changes
- **Error Handling**: Graceful fallback if Discord is unavailable
- **Cleanup**: Proper disconnection on page unload

## 🎯 Use Cases

### For Your Team
1. **Quick Reviews**: Team members can quickly test trait combinations
2. **No Context Switching**: Stay in Discord while reviewing traits
3. **Easy Sharing**: Share combinations directly in team channels
4. **Visual Feedback**: See what others are testing via Discord status

### For Development
1. **Rapid Iteration**: Test new traits quickly
2. **Team Collaboration**: Share findings instantly
3. **Version Control**: Easy updates via GitHub
4. **Cross-Platform**: Works on all Discord clients

## 🛠️ Development

### Adding New Traits
1. **Add Files**: Place new trait PNGs in appropriate folders
2. **Update Manifest**: Run `python3 update_manifest.py`
3. **Deploy**: Push changes to GitHub
4. **Test**: Verify new traits appear in Discord activity

### Customizing the Activity
1. **Styling**: Modify CSS in `discord-activity/index.html`
2. **Behavior**: Edit `discord-activity.js` for different Discord features
3. **Configuration**: Update `activity.json` for different activity settings

### Debugging
- **Console Logs**: Check browser console for Discord SDK messages
- **Status Indicator**: Watch the status indicator in the top-right corner
- **Network Tab**: Monitor Discord API calls in browser dev tools

## 🔒 Security & Privacy

- **No Data Collection**: Activity doesn't collect or store user data
- **Client-Side Only**: All processing happens in the browser
- **Discord Permissions**: Only requests necessary Discord permissions
- **HTTPS Required**: GitHub Pages provides secure hosting

## 📱 Compatibility

- **Discord Desktop**: Full support for all features
- **Discord Web**: Works in Discord web client
- **Mobile**: Limited support (Discord activities are primarily desktop)
- **Browsers**: Chrome, Firefox, Safari, Edge

## 🚀 Deployment Checklist

- [ ] Push code to GitHub repository
- [ ] Enable GitHub Pages
- [ ] Update URLs in configuration files
- [ ] Add activity images to assets folder
- [ ] Test Discord activity launcher
- [ ] Verify rich presence updates
- [ ] Test sharing functionality
- [ ] Share with team members

## 🎉 Success Metrics

- **Team Adoption**: How many team members use the activity
- **Time Saved**: Reduced time spent switching between apps
- **Combination Sharing**: Number of combinations shared
- **Feedback**: Team satisfaction with the workflow

## 🔮 Future Enhancements

- **Multi-player Support**: Allow team members to collaborate
- **Favorites System**: Save and share favorite combinations
- **Export Features**: Export combinations as images
- **Analytics**: Track most popular trait combinations
- **Custom Themes**: Different visual themes for the activity

## 📞 Support

For issues or questions:
1. Check the browser console for error messages
2. Verify Discord Activity SDK is available
3. Ensure all URLs are correctly configured
4. Test in different Discord clients

---

**Made with ❤️ for the Ravager team**
