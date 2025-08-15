# Deployment Guide

Production deployment instructions for the News Hub Frontend application.

## Deployment Options

- **Vercel** (Recommended) - Zero-config deployment
- **Netlify** - Static site hosting with forms
- **GitHub Pages** - Free hosting for open source
- **Docker** - Containerized deployment
- **Traditional Servers** - Apache/Nginx hosting

## Build Process

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview build locally
npm run preview
```

Build creates a `dist/` directory with optimized assets:
- Code splitting and tree shaking
- Minified JavaScript and CSS
- Optimized images and static assets

## Vercel Deployment

### Automatic Deployment
1. Push code to GitHub
2. Import project in Vercel dashboard
3. Configure environment variables
4. Deploy automatically on every push

### Environment Variables
```env
VITE_API_BASE_URL=https://your-api.com/api/v1
VITE_APP_NAME=News Hub
VITE_NEWS_API_KEY=your-api-key
```

### Manual Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

## Netlify Deployment

```bash
# Build and deploy
npm run build
npx netlify deploy --prod --dir=dist
```

### netlify.toml Configuration
```toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Docker Deployment

### Dockerfile
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Build and Run
```bash
# Build image
docker build -t news-hub-frontend .

# Run container
docker run -p 3000:80 news-hub-frontend
```

## Traditional Server Deployment

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/news-hub/dist;
    index index.html;

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
}
```

### Apache Configuration
```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /var/www/news-hub/dist
    
    # Handle client-side routing
    <Directory "/var/www/news-hub/dist">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
        
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
</VirtualHost>
```

## Environment Configuration

### Production Environment Variables
```env
VITE_API_BASE_URL=https://api.your-domain.com/api/v1
VITE_APP_NAME=News Hub
VITE_ENV=production

# Analytics (optional)
VITE_GA_TRACKING_ID=GA-XXXXXXXXX

# Feature flags
VITE_ENABLE_PWA=true
VITE_ENABLE_ANALYTICS=true
```

## Performance Optimization

### Build Optimization
- Enable gzip compression
- Configure CDN for static assets
- Implement proper caching headers
- Use modern image formats (WebP)

### Runtime Optimization
- Lazy load routes and components
- Implement virtual scrolling for large lists
- Use React Query for efficient data fetching
- Optimize bundle size with tree shaking

## CI/CD Pipeline

### GitHub Actions
```yaml
name: Deploy Frontend
on:
  push:
    branches: [main]
    
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm test
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## Monitoring and Analytics

### Performance Monitoring
- Configure Lighthouse CI
- Set up Core Web Vitals monitoring
- Implement error tracking (Sentry)

### Analytics
- Google Analytics integration
- Custom event tracking
- User behavior analysis

## SSL and Security

### SSL Certificate
- Use Let's Encrypt for free SSL
- Configure HTTPS redirects
- Implement security headers

### Security Best Practices
- Sanitize user inputs
- Implement Content Security Policy
- Use environment variables for sensitive data
- Regular dependency updates

For platform-specific deployment guides, refer to their official documentation.
