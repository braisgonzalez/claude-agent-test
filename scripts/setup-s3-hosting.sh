#!/bin/bash

# Setup S3 bucket for static website hosting
BUCKET_NAME="brais-claude-code"
REGION="us-east-1"

echo "Setting up S3 bucket for static website hosting..."

# Enable static website hosting
aws s3 website s3://$BUCKET_NAME --index-document index.html --error-document index.html

# Create bucket policy for public read access
cat > bucket-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
        }
    ]
}
EOF

# Apply the bucket policy
aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file://bucket-policy.json

# Clean up
rm bucket-policy.json

echo "✅ S3 static website hosting configured!"
echo "🌐 Website URL: http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com/"
echo ""
echo "To deploy frontend manually:"
echo "cd frontend && npm run build && aws s3 sync dist/ s3://$BUCKET_NAME --delete"