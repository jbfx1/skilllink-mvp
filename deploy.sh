#!/bin/bash

# SkillLink Deployment Script
# This script automates the deployment of the SkillLink MVP to production

set -e

echo "🚀 Starting SkillLink Deployment..."

# Configuration
PROJECT_NAME="skilllink"
FRONTEND_DIR="./web"
BACKEND_DIR="./backend"
BUILD_DIR="./dist"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed. Please install Node.js 18+ and try again."
        exit 1
    fi
    
    # Check if pnpm is installed
    if ! command -v pnpm &> /dev/null; then
        log_error "pnpm is not installed. Please install pnpm and try again."
        exit 1
    fi
    
    # Check if Supabase CLI is installed
    if ! command -v supabase &> /dev/null; then
        log_warning "Supabase CLI is not installed. Database deployment will be skipped."
    fi
    
    log_success "Prerequisites check completed"
}

# Install dependencies
install_dependencies() {
    log_info "Installing dependencies..."
    
    # Install root dependencies
    pnpm install
    
    # Install frontend dependencies
    cd $FRONTEND_DIR
    pnpm install
    cd ..
    
    log_success "Dependencies installed"
}

# Build frontend
build_frontend() {
    log_info "Building frontend application..."
    
    cd $FRONTEND_DIR
    
    # Create production environment file if it doesn't exist
    if [ ! -f .env.production ]; then
        log_warning "No .env.production file found. Creating from .env.example..."
        cp .env.example .env.production
    fi
    
    # Build the application
    pnpm run build
    
    cd ..
    
    log_success "Frontend build completed"
}

# Deploy to Vercel (if available)
deploy_to_vercel() {
    if command -v vercel &> /dev/null; then
        log_info "Deploying to Vercel..."
        
        cd $FRONTEND_DIR
        vercel --prod
        cd ..
        
        log_success "Deployed to Vercel"
    else
        log_warning "Vercel CLI not found. Skipping Vercel deployment."
        log_info "To deploy to Vercel:"
        log_info "1. Install Vercel CLI: npm i -g vercel"
        log_info "2. Run: cd web && vercel --prod"
    fi
}

# Deploy database (if Supabase CLI is available)
deploy_database() {
    if command -v supabase &> /dev/null; then
        log_info "Deploying database migrations..."
        
        cd $BACKEND_DIR
        
        # Check if Supabase project is linked
        if [ -f .supabase/config.toml ]; then
            supabase db push
            log_success "Database migrations deployed"
        else
            log_warning "Supabase project not linked. Please run 'supabase link' first."
        fi
        
        cd ..
    else
        log_warning "Supabase CLI not found. Skipping database deployment."
    fi
}

# Generate deployment documentation
generate_docs() {
    log_info "Generating deployment documentation..."
    
    cat > DEPLOYMENT.md << 'EOF'
# SkillLink Deployment Guide

## Overview
This document provides instructions for deploying the SkillLink MVP to production.

## Prerequisites
- Node.js 18+
- pnpm package manager
- Supabase CLI (for database)
- Vercel CLI (for frontend deployment)

## Quick Deployment

### 1. Automated Deployment
Run the deployment script:
```bash
chmod +x deploy.sh
./deploy.sh
```

### 2. Manual Deployment

#### Frontend (Vercel)
```bash
cd web
pnpm install
pnpm run build
vercel --prod
```

#### Database (Supabase)
```bash
cd backend
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

## Environment Variables

### Frontend (.env.production)
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_URL=your_production_url
```

### Backend
Configure in Supabase dashboard:
- Authentication providers
- Database connection
- Storage buckets

## Post-Deployment Checklist

- [ ] Verify frontend is accessible
- [ ] Test user authentication
- [ ] Check database connectivity
- [ ] Validate all features work
- [ ] Monitor error logs
- [ ] Set up analytics (optional)

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (18+)
   - Clear node_modules and reinstall
   - Verify environment variables

2. **Database Connection Issues**
   - Verify Supabase project settings
   - Check connection strings
   - Ensure migrations are applied

3. **Authentication Problems**
   - Verify Supabase auth configuration
   - Check redirect URLs
   - Validate JWT settings

## Monitoring

### Health Checks
- Frontend: Check main page loads
- API: Verify database queries work
- Auth: Test login/signup flow

### Performance
- Monitor Core Web Vitals
- Check API response times
- Monitor database query performance

## Scaling Considerations

### Frontend
- Enable CDN caching
- Optimize images and assets
- Implement code splitting

### Backend
- Monitor database performance
- Set up connection pooling
- Consider read replicas for scale

## Support
For deployment issues, check:
1. Application logs
2. Supabase dashboard
3. Vercel deployment logs
4. Browser developer console
EOF

    log_success "Deployment documentation generated"
}

# Create production environment template
create_env_template() {
    log_info "Creating production environment template..."
    
    cat > $FRONTEND_DIR/.env.production.example << 'EOF'
# Production Environment Variables
# Copy this file to .env.production and fill in your values

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# App Configuration
VITE_APP_URL=https://your-domain.com
VITE_API_URL=https://your-domain.com/api

# Feature Flags
VITE_ENABLE_MONETIZATION=true
VITE_ENABLE_LIVE_CLASSES=true
VITE_ENABLE_ANALYTICS=true

# Analytics (Optional)
VITE_GA_TRACKING_ID=GA-XXXXXXXXX
VITE_HOTJAR_ID=your-hotjar-id

# External Services (Optional)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
VITE_AGORA_APP_ID=your-agora-app-id
EOF

    log_success "Production environment template created"
}

# Main deployment function
main() {
    echo "🎯 SkillLink MVP Deployment"
    echo "=========================="
    
    check_prerequisites
    install_dependencies
    create_env_template
    build_frontend
    generate_docs
    
    echo ""
    echo "🎉 Deployment preparation completed!"
    echo ""
    echo "Next steps:"
    echo "1. Configure your production environment variables"
    echo "2. Set up your Supabase project"
    echo "3. Deploy to your preferred hosting platform"
    echo ""
    echo "Available deployment options:"
    echo "- Vercel (recommended for frontend)"
    echo "- Netlify"
    echo "- AWS Amplify"
    echo "- Traditional hosting with static files"
    echo ""
    
    # Optional: Deploy to Vercel if CLI is available
    read -p "Deploy to Vercel now? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        deploy_to_vercel
    fi
    
    # Optional: Deploy database if Supabase CLI is available
    read -p "Deploy database migrations? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        deploy_database
    fi
    
    log_success "SkillLink deployment completed! 🚀"
}

# Run main function
main "$@"
