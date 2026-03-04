# Order Link - Build Resources

This directory contains resources for building the application.

## Contents

- `icon.ico` - Windows application icon (256x256)
- `icon.icns` - macOS application icon
- `icons/` - Linux icon set (various sizes)
- `entitlements.mac.plist` - macOS code signing entitlements

## Icon Requirements

### Windows (`.ico`)
- 256x256 pixels
- Multiple resolutions embedded

### macOS (`.icns`)
- 1024x1024 pixels source
- Generates multiple sizes automatically

### Linux (PNG)
- 512x512 pixels
- Also provide: 256x256, 128x128, 64x64, 32x32, 16x16

## Generating Icons

```bash
# Install iconutil (macOS)
# Convert PNG to ICNS
mkdir icon.iconset
sips -z 512 512 icon.png --out icon.iconset/icon_512x512.png
sips -z 256 256 icon.png --out icon.iconset/icon_256x256.png
sips -z 128 128 icon.png --out icon.iconset/icon_128x128.png
iconutil -c icns icon.iconset -o icon.icns
```

## Placeholder Icons

Currently using placeholder icons. Replace with actual branding before release.
