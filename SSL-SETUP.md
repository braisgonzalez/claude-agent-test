# SSL/HTTPS Setup Guide

## ✅ **HTTPS Implementation Complete!**

**Your application is now available over HTTPS at:**  
**🔒 https://d31mot4ub2zsod.cloudfront.net**

### Configuration Details:
- **Distribution ID**: E50H2W7S8MHH1
- **SSL Certificate**: CloudFront default (free)
- **Status**: Deployed and active
- **Cache Invalidation**: Automated via GitHub Actions

---

This guide explains how HTTPS was enabled for the application using AWS CloudFront.

## Quick Setup (Frontend HTTPS Only)

This approach adds HTTPS to the frontend via CloudFront while keeping the backend as HTTP for demo purposes.

### Step 1: Run SSL Setup Script

```bash
cd scripts
./setup-ssl-simple.sh
```

### Step 2: Manual CloudFront Creation (if script fails)

If the script can't create CloudFront automatically, run this command:

```bash
aws cloudfront create-distribution --distribution-config file://scripts/cloudfront-config.json
```

### Step 3: Update GitHub Actions

After CloudFront is created, update the deployment workflow:

1. Get your CloudFront distribution ID from AWS Console
2. Update `.github/workflows/deploy.yml`:
   ```yaml
   env:
     CLOUDFRONT_DISTRIBUTION_ID: "E1234567890ABC"  # Your distribution ID
   ```

### Step 4: Update Frontend Build

Use the SSL environment configuration:

```bash
cd frontend
cp .env.ssl .env.production
npm run build
```

## Architecture Overview

### Current Setup (HTTP)
```
User → S3 Static Website (HTTP) → EC2 Backend (HTTP)
```

### SSL Setup (Mixed HTTPS/HTTP)
```
User → CloudFront (HTTPS) → S3 Static Website (HTTP) → EC2 Backend (HTTP)
```

### Key Benefits
- ✅ Frontend served over HTTPS
- ✅ Automatic HTTP → HTTPS redirects
- ✅ CloudFront CDN performance boost
- ✅ No custom domain required (uses CloudFront domain)
- ✅ Free SSL certificate (CloudFront default)

## Configuration Details

### CloudFront Configuration
- **SSL Certificate**: CloudFront default certificate (*.cloudfront.net)
- **Viewer Protocol Policy**: Redirect HTTP to HTTPS
- **Origin**: S3 static website (HTTP)
- **Caching**: Optimized for static assets
- **Error Pages**: SPA routing support (404 → index.html)

### Mixed Content Handling
Since frontend is HTTPS and backend is HTTP, modern browsers may show mixed content warnings. This is acceptable for demo purposes.

### Environment Variables
- `VITE_API_BASE_URL`: Backend API endpoint (remains HTTP)
- `VITE_HTTPS_ENABLED`: Flag to indicate HTTPS is enabled
- `VITE_MIXED_CONTENT_WARNING`: Show warning about mixed content

## Deployment Process

1. **Build**: Frontend builds with SSL configuration
2. **Deploy**: Assets uploaded to S3
3. **Invalidate**: CloudFront cache cleared for immediate updates
4. **Access**: Application available via HTTPS at CloudFront domain

## Testing SSL Setup

### Frontend HTTPS Test
```bash
curl -I https://your-distribution-id.cloudfront.net
# Should return: HTTP/2 200
```

### Mixed Content Test
1. Open browser developer tools
2. Navigate to HTTPS frontend
3. Check console for mixed content warnings (expected for demo)

### API Functionality Test
1. Open application in browser
2. Test user/customer CRUD operations
3. Verify API calls work despite mixed content

## Troubleshooting

### CloudFront Distribution Not Working
- Wait 15-20 minutes for distribution to deploy
- Check distribution status in AWS Console
- Verify S3 bucket allows public read access

### Mixed Content Blocked
- Modern browsers may block HTTP API calls from HTTPS frontend
- Use HTTPS backend or configure CSP headers for demo purposes
- Consider this acceptable for demo/prototype scenarios

### Cache Issues
- Invalidate CloudFront cache after deployments
- Use versioned asset names for cache busting
- Set appropriate cache headers on S3 objects

## Cost Impact

### Additional AWS Costs
- **CloudFront**: ~$0.085 per GB (first 10TB)
- **Requests**: ~$0.0075 per 10,000 requests
- **SSL Certificate**: FREE (default CloudFront certificate)

### Estimated Monthly Cost
- Low traffic demo: ~$1-3/month
- Medium usage: ~$5-10/month

## Security Considerations

### What This Provides
- ✅ Encrypted frontend delivery
- ✅ DDoS protection via CloudFront
- ✅ Geographic distribution
- ✅ Automatic HTTPS redirects

### What This Doesn't Provide
- ❌ Backend API encryption (still HTTP)
- ❌ End-to-end encryption
- ❌ Custom domain SSL
- ❌ Advanced WAF protection

### For Production Use
Consider implementing full HTTPS with:
- Application Load Balancer with SSL for backend
- Custom domain with ACM certificate
- VPC with private subnets
- Enhanced security headers

## Next Steps

1. ✅ Run SSL setup script
2. ✅ Update deployment workflow with CloudFront ID
3. ✅ Test HTTPS frontend access
4. ✅ Verify API functionality with mixed content
5. 📋 Document new HTTPS URL for team access

This setup provides HTTPS for the frontend while maintaining simplicity for demo purposes.