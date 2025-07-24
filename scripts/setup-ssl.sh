#!/bin/bash

# SSL Setup Script for AWS Infrastructure
# This script sets up CloudFront and ALB with SSL certificates

set -e

echo "🔒 Setting up SSL/HTTPS infrastructure for the application"
echo "========================================================"

# Configuration
REGION="us-east-1"
S3_BUCKET="brais-claude-code"
DOMAIN_FRONTEND="d123456789.cloudfront.net"  # Will be updated after CloudFront creation
DOMAIN_BACKEND="ssl-api.brais-demo.com"      # Custom domain for backend
EC2_INSTANCE_ID="i-0c5c631508a9d1e93"
VPC_ID=$(aws ec2 describe-instances --instance-ids $EC2_INSTANCE_ID --query 'Reservations[0].Instances[0].VpcId' --output text --region $REGION)
SUBNET_IDS=$(aws ec2 describe-instances --instance-ids $EC2_INSTANCE_ID --query 'Reservations[0].Instances[0].SubnetId' --output text --region $REGION)

echo "📋 Configuration:"
echo "  Region: $REGION"
echo "  S3 Bucket: $S3_BUCKET"
echo "  EC2 Instance: $EC2_INSTANCE_ID"
echo "  VPC: $VPC_ID"
echo ""

# Step 1: Request SSL Certificate for CloudFront (Global - us-east-1)
echo "1️⃣ Requesting SSL certificate for CloudFront..."
CERT_ARN_CLOUDFRONT=$(aws acm request-certificate \
  --domain-name "$S3_BUCKET-ssl.brais-demo.com" \
  --validation-method DNS \
  --region us-east-1 \
  --query 'CertificateArn' \
  --output text)

echo "✅ CloudFront SSL Certificate requested: $CERT_ARN_CLOUDFRONT"
echo "⚠️  IMPORTANT: You need to validate this certificate via DNS before proceeding"
echo ""

# Step 2: Request SSL Certificate for ALB (Regional)
echo "2️⃣ Requesting SSL certificate for ALB..."
CERT_ARN_ALB=$(aws acm request-certificate \
  --domain-name "api-ssl.brais-demo.com" \
  --validation-method DNS \
  --region $REGION \
  --query 'CertificateArn' \
  --output text)

echo "✅ ALB SSL Certificate requested: $CERT_ARN_ALB"
echo "⚠️  IMPORTANT: You need to validate this certificate via DNS before proceeding"
echo ""

# Step 3: Create Application Load Balancer
echo "3️⃣ Creating Application Load Balancer..."

# Get all subnets in the VPC for ALB (needs at least 2 AZs)
ALL_SUBNETS=$(aws ec2 describe-subnets \
  --filters "Name=vpc-id,Values=$VPC_ID" \
  --query 'Subnets[].SubnetId' \
  --output text --region $REGION)

ALB_ARN=$(aws elbv2 create-load-balancer \
  --name brais-ssl-alb \
  --subnets $ALL_SUBNETS \
  --security-groups sg-015054163da20eeea \
  --scheme internet-facing \
  --type application \
  --ip-address-type ipv4 \
  --region $REGION \
  --query 'LoadBalancers[0].LoadBalancerArn' \
  --output text)

echo "✅ ALB created: $ALB_ARN"

# Get ALB DNS name
ALB_DNS=$(aws elbv2 describe-load-balancers \
  --load-balancer-arns $ALB_ARN \
  --query 'LoadBalancers[0].DNSName' \
  --output text --region $REGION)

echo "✅ ALB DNS: $ALB_DNS"
echo ""

# Step 4: Create Target Group
echo "4️⃣ Creating Target Group..."
TG_ARN=$(aws elbv2 create-target-group \
  --name brais-ssl-targets \
  --protocol HTTP \
  --port 8080 \
  --vpc-id $VPC_ID \
  --target-type instance \
  --health-check-protocol HTTP \
  --health-check-path "/actuator/health" \
  --health-check-interval-seconds 30 \
  --health-check-timeout-seconds 5 \
  --healthy-threshold-count 2 \
  --unhealthy-threshold-count 3 \
  --region $REGION \
  --query 'TargetGroups[0].TargetGroupArn' \
  --output text)

echo "✅ Target Group created: $TG_ARN"

# Register EC2 instance with target group
aws elbv2 register-targets \
  --target-group-arn $TG_ARN \
  --targets Id=$EC2_INSTANCE_ID \
  --region $REGION

echo "✅ EC2 instance registered with target group"
echo ""

# Step 5: Create HTTPS Listener (will need to be done after certificate validation)
echo "5️⃣ Creating HTTPS Listener..."
echo "⚠️  This step requires validated SSL certificate. Run this after DNS validation:"
echo ""
echo "aws elbv2 create-listener \\"
echo "  --load-balancer-arn $ALB_ARN \\"
echo "  --protocol HTTPS \\"
echo "  --port 443 \\"
echo "  --certificates CertificateArn=$CERT_ARN_ALB \\"
echo "  --default-actions Type=forward,TargetGroupArn=$TG_ARN \\"
echo "  --region $REGION"
echo ""

# Step 6: Create HTTP Redirect Listener
echo "6️⃣ Creating HTTP to HTTPS redirect..."
aws elbv2 create-listener \
  --load-balancer-arn $ALB_ARN \
  --protocol HTTP \
  --port 80 \
  --default-actions Type=redirect,RedirectConfig='{Protocol=HTTPS,Port=443,StatusCode=HTTP_301}' \
  --region $REGION

echo "✅ HTTP to HTTPS redirect configured"
echo ""

# Step 7: CloudFront Distribution (will need to be done after certificate validation)
echo "7️⃣ Creating CloudFront Distribution..."
echo "⚠️  This step requires validated SSL certificate. Configuration saved to cloudfront-config.json"

cat > cloudfront-config.json << EOF
{
  "CallerReference": "ssl-setup-$(date +%s)",
  "Comment": "SSL-enabled CloudFront for brais-claude-code",
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-brais-claude-code",
    "ViewerProtocolPolicy": "redirect-to-https",
    "MinTTL": 0,
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {"Forward": "none"}
    },
    "TrustedSigners": {
      "Enabled": false,
      "Quantity": 0
    }
  },
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-brais-claude-code",
        "DomainName": "$S3_BUCKET.s3-website-us-east-1.amazonaws.com",
        "CustomOriginConfig": {
          "HTTPPort": 80,
          "HTTPSPort": 443,
          "OriginProtocolPolicy": "http-only"
        }
      }
    ]
  },
  "Enabled": true,
  "PriceClass": "PriceClass_100",
  "ViewerCertificate": {
    "ACMCertificateArn": "$CERT_ARN_CLOUDFRONT",
    "SSLSupportMethod": "sni-only",
    "MinimumProtocolVersion": "TLSv1.2_2021"
  }
}
EOF

echo ""
echo "🎉 SSL Infrastructure Setup Summary"
echo "=================================="
echo "✅ CloudFront SSL Certificate: $CERT_ARN_CLOUDFRONT"
echo "✅ ALB SSL Certificate: $CERT_ARN_ALB"
echo "✅ Application Load Balancer: $ALB_DNS"
echo "✅ Target Group configured and registered"
echo "✅ HTTP to HTTPS redirect configured"
echo ""
echo "📋 Next Steps:"
echo "1. Validate SSL certificates via DNS validation"
echo "2. Run the HTTPS listener command shown above"
echo "3. Create CloudFront distribution using cloudfront-config.json"
echo "4. Update application configuration with new HTTPS endpoints"
echo ""
echo "🔗 New Endpoints (after setup):"
echo "  Frontend: https://[cloudfront-domain]"
echo "  Backend:  https://$ALB_DNS"