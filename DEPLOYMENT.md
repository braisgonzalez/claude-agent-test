# AWS Deployment Setup

This document explains how to set up automated deployment to AWS using GitHub Actions.

## Prerequisites

Before the deployment pipeline can work, you need to set up the following GitHub secrets:

### Required GitHub Secrets

Set these secrets in your GitHub repository settings (`Settings` → `Secrets and variables` → `Actions`):

1. **AWS_ACCESS_KEY_ID** - Your AWS access key ID
2. **AWS_SECRET_ACCESS_KEY** - Your AWS secret access key  
3. **EC2_SSH_PRIVATE_KEY** - Private SSH key for EC2 access (content of `brais-key-pair.pem`)
4. **RDS_PASSWORD** - Database password: `AQze2GCGJRu64lW9dsUJ`

### Setting Secrets via GitHub CLI

```bash
# Set AWS credentials
gh secret set AWS_ACCESS_KEY_ID
gh secret set AWS_SECRET_ACCESS_KEY

# Set EC2 SSH key (paste the private key content)
gh secret set EC2_SSH_PRIVATE_KEY

# Set RDS password
gh secret set RDS_PASSWORD --body "AQze2GCGJRu64lW9dsUJ"
```

## AWS Infrastructure

The deployment uses the following AWS resources:

- **Region**: us-east-1
- **S3 Bucket**: brais-claude-code (for frontend)
- **EC2 Instance**: i-0c5c631508a9d1e93 (172.31.45.188)
- **RDS Database**: claude-agent-test.ch2aksogwa9r.us-east-1.rds.amazonaws.com
- **Security Group**: sg-015054163da20eeea

## Deployment Pipeline

The GitHub Actions workflow automatically:

1. **Tests** both frontend and backend code
2. **Builds** the React frontend and Spring Boot backend
3. **Deploys frontend** to S3 bucket with static website hosting
4. **Deploys backend** to EC2 instance with zero-downtime deployment
5. **Verifies** deployment by checking health endpoints

## Manual Deployment Steps

If you need to deploy manually:

### Frontend Deployment
```bash
cd frontend
npm install
npm run build
aws s3 sync dist/ s3://brais-claude-code --delete
```

### Backend Deployment
```bash
cd backend
./mvnw clean package -DskipTests
scp target/*.jar ec2-user@172.31.45.188:/home/ec2-user/app/app.jar
ssh ec2-user@172.31.45.188 'cd /home/ec2-user/app && ./start-app.sh'
```

## Access URLs

After deployment:

- **Frontend**: http://brais-claude-code.s3-website-us-east-1.amazonaws.com/
- **Backend API**: http://172.31.45.188:8080
- **Health Check**: http://172.31.45.188:8080/actuator/health
- **API Documentation**: http://172.31.45.188:8080/swagger-ui.html

## Configuration

### Frontend Environment
The frontend is configured to connect to the backend at:
```
VITE_API_BASE_URL=http://172.31.45.188:8080
```

### Backend Environment
The backend uses these production settings:
- Database: PostgreSQL on RDS
- Profile: `prod`
- Logging: File-based logging in `/home/ec2-user/app/application.log`
- Health checks: Enabled at `/actuator/health`

## Troubleshooting

### Common Issues

1. **Deployment fails with SSH connection error**
   - Verify EC2_SSH_PRIVATE_KEY secret is set correctly
   - Ensure EC2 security group allows SSH (port 22) from GitHub Actions IPs

2. **Backend health check fails**
   - Check application logs: `ssh ec2-user@172.31.45.188 'tail -f /home/ec2-user/app/application.log'`
   - Verify database connectivity
   - Check if port 8080 is open in security group

3. **Frontend not accessible**
   - Verify S3 bucket has static website hosting enabled
   - Check S3 bucket policy allows public read access

### Debug Commands

```bash
# Check backend status
curl http://172.31.45.188:8080/actuator/health

# Check application logs
ssh ec2-user@172.31.45.188 'tail -100 /home/ec2-user/app/application.log'

# Check running processes
ssh ec2-user@172.31.45.188 'ps aux | grep java'

# Test API endpoints
curl -u admin:admin123 http://172.31.45.188:8080/api/v1/customers
```

## Security Notes

- Database password is stored in GitHub secrets
- EC2 access uses SSH key authentication
- API endpoints use HTTP Basic Authentication (admin:admin123)
- S3 bucket configured for public read access for static hosting

## Cost Optimization

Current setup uses:
- EC2 t3.micro (free tier eligible)
- RDS db.t3.micro (free tier eligible)  
- S3 standard storage (minimal cost for static files)

Estimated monthly cost: ~$15-20 (mostly RDS when out of free tier)