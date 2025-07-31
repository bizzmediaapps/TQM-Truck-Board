# Viplex Software LED Display Installation Guide
## Soccer Scoreboard for Large LED Screens

### 🎯 Overview
This guide provides step-by-step instructions for deploying the Soccer Scoreboard application on Viplex Software Large LED Screens. The application has been specifically optimized for LED display performance, scaling, and compatibility.

---

## 📋 Prerequisites

### Hardware Requirements
- **LED Display Controller**: NovaStar compatible controller (recommended)
- **LED Screen**: Minimum 1920x1080 resolution
- **Network**: Gigabit Ethernet connection
- **Computer**: Control PC with Viplex Express software installed

### Software Requirements
- **Viplex Express**: Version 2.0 or higher
- **Web Browser**: Chrome 90+, Firefox 88+, or Edge 90+
- **Node.js**: Version 14.0.0 or higher (for local development)

---

## 🚀 Quick Start Deployment

### Option 1: Vercel Deployment (Recommended)

1. **Fork/Clone the Repository**
   ```bash
   git clone <repository-url>
   cd soccer-scoreboard
   ```

2. **Deploy to Vercel**
   ```bash
   npm install -g vercel
   vercel --prod
   ```

3. **Configure Viplex Express**
   - Open Viplex Express software
   - Select "Studio Mode"
   - Set canvas size to match your LED display resolution
   - Add web page source with your Vercel URL

### Option 2: Local Server Deployment

1. **Install Dependencies**
   ```bash
   npm install http-server -g
   ```

2. **Start Local Server**
   ```bash
   http-server . -p 8080 -c-1
   ```

3. **Access Application**
   - Main Display: `http://localhost:8080`
   - Admin Panel: `http://localhost:8080/admin.html`

---

## 🖥️ Viplex Express Configuration

### Step 1: Initial Setup
1. Launch **Viplex Express**
2. Select **"Studio Mode"** (not Async Mode)
3. Choose **"General Screen"** option
4. Set canvas resolution to match your LED display:
   - **1920x1080** (Full HD)
   - **2560x1440** (2K)
   - **3840x2160** (4K)
   - Custom resolution as needed

### Step 2: Add Web Content
1. In Viplex Express, click **"Files"** → **"Web Page"**
2. Enter your application URL:
   - Production: `https://your-app.vercel.app`
   - Local: `http://your-local-ip:8080`
3. Set **Update Interval**: 5 seconds (recommended)
4. Enable **"Auto Refresh"**

### Step 3: Optimize Display Settings
1. **Brightness**: Set according to environment
   - Indoor: 800-1200 cd/m²
   - Outdoor: 5000-10000 cd/m²
2. **Refresh Rate**: 120Hz or higher (if supported)
3. **Color Depth**: 16-bit for optimal color reproduction

---

## 🎛️ LED Display Resolution Configuration

### Supported Resolutions
The application automatically adapts to various LED screen resolutions:

| Resolution | Aspect Ratio | Use Case |
|------------|-------------|----------|
| 1280x720 | 16:9 | Small indoor displays |
| 1920x1080 | 16:9 | Standard LED screens |
| 2560x1440 | 16:9 | High-resolution displays |
| 3840x2160 | 16:9 | 4K LED walls |
| Custom | Various | Non-standard installations |

### Manual Resolution Override
If you need to force a specific resolution:

1. Edit the CSS in `public/index.html`
2. Modify the viewport meta tag:
   ```html
   <meta name="viewport" content="width=1920, height=1080, user-scalable=no">
   ```
3. Update media queries for your specific resolution

---

## 🎨 Visual Optimization for LED Displays

### Color and Contrast Settings
The application includes LED-optimized styling:
- **High Contrast Colors**: Ensures visibility from distance
- **Large Fonts**: Scalable typography for readability
- **Bold Borders**: Enhanced visual separation
- **Glow Effects**: LED-friendly visual enhancements

### Customization Options
Edit `public/index.html` to modify:
- **Colors**: Change the color scheme in CSS variables
- **Font Sizes**: Adjust `clamp()` values for different screen sizes
- **Layout**: Modify flexbox properties for custom arrangements

---

## 🎬 Media Configuration

### Supported Media Formats
| Type | Formats | Recommendations |
|------|---------|----------------|
| Video | MP4, AVI, MOV, WEBM | H.264 codec, max 100MB |
| Images | JPG, PNG, GIF | High resolution, max 50MB |
| Audio | MP3, WAV, AAC | 192kbps, max 10MB |

### Media Triggers Setup
1. Access admin panel: `your-url/admin.html`
2. Navigate to **"Media Triggers"** section
3. Configure hotkeys (1-0) with media URLs
4. Save configuration

### File Storage Recommendations
- **Cloud Storage**: Use CDN services (Cloudinary, AWS S3)
- **Local Storage**: Place files in `/public` directory
- **URL Format**: Use absolute URLs for reliability

---

## 🔧 API Configuration

### Endpoints
- **GET** `/api/scores` - Retrieve current scoreboard data
- **POST** `/api/update` - Update scoreboard information
- **GET** `/api/rss` - RSS feed for external integrations

### Real-time Updates
The application polls for updates every 2 seconds by default. To modify:

```javascript
// In public/index.html, change the interval
setInterval(fetchData, 2000); // 2000ms = 2 seconds
```

---

## 🌐 Network Configuration

### Port Requirements
- **HTTP**: Port 80 or 8080
- **HTTPS**: Port 443 (recommended for production)
- **WebSocket**: Same port as HTTP (for real-time features)

### Firewall Settings
Ensure the following ports are open:
- Incoming: 80, 443
- Outgoing: 80, 443, 53 (DNS)

### IP Configuration
For LED controllers, set static IP addresses:
```
LED Controller: 192.168.1.100
Control PC: 192.168.1.101
Gateway: 192.168.1.1
```

---

## 🔍 Troubleshooting

### Common Issues

#### Display Not Loading
1. Check network connectivity
2. Verify Viplex Express URL configuration
3. Test URL in web browser first
4. Check firewall/antivirus settings

#### Poor Performance
1. Reduce update frequency (increase interval)
2. Optimize media file sizes
3. Check network bandwidth
4. Update graphics drivers

#### Media Not Playing
1. Verify file formats are supported
2. Check file size limits
3. Test URLs in browser
4. Ensure CORS headers if cross-origin

#### Scaling Issues
1. Verify LED display resolution settings
2. Check Viplex canvas configuration
3. Test with different viewport settings
4. Adjust CSS media queries

### Performance Optimization

#### For Large LED Displays (4K+)
```javascript
// Reduce update frequency for stability
setInterval(fetchData, 5000); // 5 seconds

// Disable hardware acceleration if needed
document.body.style.transform = 'none';
```

#### For Multiple Displays
- Use separate instances for each display
- Configure unique API endpoints
- Implement load balancing if needed

---

## 🛡️ Security Considerations

### Production Deployment
1. **HTTPS**: Always use SSL/TLS in production
2. **API Security**: Implement authentication for admin endpoints
3. **CORS**: Configure appropriate cross-origin policies
4. **Rate Limiting**: Prevent API abuse

### Network Security
1. Use VPN for remote administration
2. Implement firewall rules
3. Regular security updates
4. Monitor access logs

---

## 📊 Monitoring and Maintenance

### Health Checks
The application includes built-in status monitoring:
- Connection status indicator
- Real-time data verification
- Error logging and reporting

### Backup and Recovery
1. **Configuration Backup**: Save Viplex Express settings
2. **Media Backup**: Maintain copies of media files
3. **Database Backup**: Export scoreboard configurations

### Updates and Upgrades
1. Test updates in staging environment
2. Schedule maintenance windows
3. Maintain rollback procedures
4. Document configuration changes

---

## 📞 Support and Resources

### Documentation
- **Viplex Express Manual**: Available from NovaStar
- **API Documentation**: See `api/` directory
- **Configuration Reference**: See `viplex-config.json`

### Community Resources
- NovaStar Support Forums
- LED Display Communities
- Technical Documentation Libraries

### Professional Support
For complex installations or custom modifications:
1. Contact certified NovaStar integrators
2. Engage LED display professionals
3. Consider professional monitoring services

---

## ✅ Installation Checklist

### Pre-Installation
- [ ] Hardware compatibility verified
- [ ] Network infrastructure configured
- [ ] Viplex Express software installed
- [ ] Media files prepared and optimized

### Installation
- [ ] Application deployed successfully
- [ ] Viplex Express configured
- [ ] Display resolution optimized
- [ ] Network connectivity tested

### Post-Installation
- [ ] Admin panel accessible
- [ ] Media triggers configured
- [ ] Performance testing completed
- [ ] Backup procedures established

### Go-Live
- [ ] Final testing completed
- [ ] User training provided
- [ ] Support contacts established
- [ ] Monitoring systems active

---

## 🎯 Best Practices

### Content Guidelines
1. **Keep it Simple**: Large, clear text and graphics
2. **High Contrast**: Ensure visibility from distance
3. **Consistent Branding**: Maintain visual identity
4. **Test Thoroughly**: Verify on actual LED hardware

### Performance Tips
1. **Optimize Images**: Use appropriate compression
2. **Minimize Animations**: Reduce CPU/GPU load
3. **Cache Effectively**: Leverage browser caching
4. **Monitor Resources**: Track memory and CPU usage

### Operational Excellence
1. **Regular Maintenance**: Schedule routine checks
2. **Proactive Monitoring**: Set up alerts and notifications
3. **Documentation**: Keep detailed operational logs
4. **Training**: Ensure staff are familiar with systems

---

*Last updated: 2024*
*Version: 1.0.0*