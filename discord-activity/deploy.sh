#!/bin/bash

# Discord Activity Deployment Script
# This script helps set up the Discord activity for the Ravager Trait Tester

echo "🎭 Ravager Trait Tester - Discord Activity Setup"
echo "================================================"

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: Please run this script from the discord-activity directory"
    exit 1
fi

echo "✅ Found Discord activity files"

# Function to update URLs in files
update_urls() {
    local new_url=$1
    echo "🔧 Updating URLs to: $new_url"
    
    # Update activity.json
    sed -i.bak "s|https://yourusername.github.io/dressup-game/|$new_url|g" activity.json
    sed -i.bak "s|https://yourusername.github.io/dressup-game/discord-activity/|$new_url/discord-activity/|g" activity.json
    
    # Update index.html
    sed -i.bak "s|https://yourusername.github.io/dressup-game/|$new_url|g" index.html
    
    # Update manifest.json
    sed -i.bak "s|https://yourusername.github.io/dressup-game/|$new_url|g" manifest.json
    
    echo "✅ URLs updated successfully"
}

# Function to check for required assets
check_assets() {
    echo "📁 Checking for required assets..."
    
    if [ ! -f "assets/large-image.png" ]; then
        echo "⚠️  Warning: assets/large-image.png not found"
        echo "   Please create a 512x512 PNG image for the main activity icon"
    else
        echo "✅ Found large-image.png"
    fi
    
    if [ ! -f "assets/small-image.png" ]; then
        echo "⚠️  Warning: assets/small-image.png not found"
        echo "   Please create a 128x128 PNG image for the small activity icon"
    else
        echo "✅ Found small-image.png"
    fi
}

# Function to validate configuration
validate_config() {
    echo "🔍 Validating configuration..."
    
    # Check if application ID is still placeholder
    if grep -q "YOUR_APPLICATION_ID" activity.json; then
        echo "⚠️  Warning: Application ID not set in activity.json"
        echo "   Please update 'YOUR_APPLICATION_ID' with your Discord application ID"
    else
        echo "✅ Application ID configured"
    fi
    
    # Check if URLs are still placeholders
    if grep -q "yourusername.github.io" activity.json; then
        echo "⚠️  Warning: URLs still contain placeholder values"
        echo "   Please run this script with your GitHub Pages URL"
    else
        echo "✅ URLs configured"
    fi
}

# Function to create backup
create_backup() {
    echo "💾 Creating backup of original files..."
    cp activity.json activity.json.backup
    cp index.html index.html.backup
    cp manifest.json manifest.json.backup
    echo "✅ Backup created"
}

# Function to restore backup
restore_backup() {
    echo "🔄 Restoring from backup..."
    cp activity.json.backup activity.json
    cp index.html.backup index.html
    cp manifest.json.backup manifest.json
    echo "✅ Backup restored"
}

# Main script logic
if [ "$1" = "restore" ]; then
    restore_backup
    exit 0
fi

if [ "$1" = "validate" ]; then
    validate_config
    check_assets
    exit 0
fi

if [ "$1" = "backup" ]; then
    create_backup
    exit 0
fi

# If URL is provided, update configuration
if [ -n "$1" ]; then
    create_backup
    update_urls "$1"
    validate_config
    check_assets
else
    echo "📝 Usage:"
    echo "  ./deploy.sh <github-pages-url>  - Update URLs and validate config"
    echo "  ./deploy.sh validate            - Check configuration and assets"
    echo "  ./deploy.sh backup              - Create backup of current files"
    echo "  ./deploy.sh restore             - Restore from backup"
    echo ""
    echo "📋 Example:"
    echo "  ./deploy.sh https://yourusername.github.io/dressup-game"
    echo ""
    echo "🔧 Manual Steps Required:"
    echo "  1. Create Discord application and get Application ID"
    echo "  2. Update 'YOUR_APPLICATION_ID' in activity.json"
    echo "  3. Add activity images to assets/ folder"
    echo "  4. Deploy to GitHub Pages"
    echo "  5. Test Discord activity launcher"
fi

echo ""
echo "🎉 Setup complete! Next steps:"
echo "  1. Push changes to GitHub"
echo "  2. Enable GitHub Pages in repository settings"
echo "  3. Test the Discord activity"
echo "  4. Share with your team"
