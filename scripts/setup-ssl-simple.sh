#!/bin/bash

# Simple SSL Setup - CloudFront for Frontend Only
# This approach adds HTTPS to the frontend via CloudFront while keeping backend as-is for demo purposes

set -e

echo "🔒 Setting up HTTPS for Frontend via CloudFront"
echo "=============================================="

# Configuration
REGION="us-east-1"
S3_BUCKET="brais-claude-code"

echo "📋 Configuration:"
echo "  Region: $REGION"
echo "  S3 Bucket: $S3_BUCKET"
echo ""

echo "1️⃣ Creating CloudFront Distribution with HTTPS..."

# Create CloudFront distribution configuration
cat > cloudfront-config.json << 'EOF'
{
  "CallerReference": "ssl-setup-cloudfront-TIMESTAMP",
  "Comment": "HTTPS-enabled CloudFront for brais-claude-code demo",
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-brais-claude-code",
    "ViewerProtocolPolicy": "redirect-to-https",
    "MinTTL": 0,
    "DefaultTTL": 86400,
    "MaxTTL": 31536000,
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {"Forward": "none"},
      "Headers": {"Quantity": 0}
    },
    "TrustedSigners": {
      "Enabled": false,
      "Quantity": 0
    },
    "Compress": true,
    "SmoothStreaming": false
  },
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-brais-claude-code",
        "DomainName": "brais-claude-code.s3-website-us-east-1.amazonaws.com",
        "CustomOriginConfig": {
          "HTTPPort": 80,
          "HTTPSPort": 443,
          "OriginProtocolPolicy": "http-only",
          "OriginSslProtocols": {
            "Quantity": 1,
            "Items": ["TLSv1.2"]
          }
        }
      }
    ]
  },
  "Enabled": true,
  "PriceClass": "PriceClass_100",
  "ViewerCertificate": {
    "CloudFrontDefaultCertificate": true
  },
  "DefaultRootObject": "index.html",
  "CustomErrorResponses": {
    "Quantity": 1,
    "Items": [
      {
        "ErrorCode": 404,
        "ResponseCode": "200",
        "ResponsePagePath": "/index.html",
        "ErrorCachingMinTTL": 300
      }
    ]
  }
}
EOF

# Replace timestamp placeholder
TIMESTAMP=$(date +%s)
sed -i.bak "s/TIMESTAMP/$TIMESTAMP/g" cloudfront-config.json && rm cloudfront-config.json.bak

echo "✅ CloudFront configuration created"

# Create the CloudFront distribution
echo "🚀 Creating CloudFront distribution..."
CLOUDFRONT_OUTPUT=$(aws cloudfront create-distribution --distribution-config file://cloudfront-config.json --region $REGION 2>/dev/null || echo "ERROR")

if [ "$CLOUDFRONT_OUTPUT" = "ERROR" ]; then
    echo "⚠️  CloudFront creation requires AWS CLI access. Please run manually:"
    echo ""
    echo "aws cloudfront create-distribution --distribution-config file://scripts/cloudfront-config.json"
    echo ""
    CLOUDFRONT_DOMAIN="[CREATED-AFTER-RUNNING-COMMAND].cloudfront.net"
else
    CLOUDFRONT_DOMAIN=$(echo $CLOUDFRONT_OUTPUT | jq -r '.Distribution.DomainName')
    CLOUDFRONT_ID=$(echo $CLOUDFRONT_OUTPUT | jq -r '.Distribution.Id')
    echo "✅ CloudFront Distribution created!"
    echo "   Domain: $CLOUDFRONT_DOMAIN"
    echo "   ID: $CLOUDFRONT_ID"
fi

echo ""
echo "2️⃣ Configuration Summary"
echo "======================="
echo "Frontend HTTPS: https://$CLOUDFRONT_DOMAIN"
echo "Backend HTTP:   http://13.217.86.5:8080 (unchanged for demo)"
echo ""
echo "📋 Next Steps:"
echo "1. Update frontend environment to use HTTPS CloudFront URL"
echo "2. Update GitHub Actions to deploy to CloudFront"
echo "3. Test the application with mixed HTTPS/HTTP setup"
echo ""
echo "🔗 Demo URLs:"
echo "  App:    https://$CLOUDFRONT_DOMAIN"
echo "  API:    http://13.217.86.5:8080 (demo backend)"
echo ""

# Clean up config file
rm -f cloudfront-config.json

echo "✅ SSL setup script completed!"