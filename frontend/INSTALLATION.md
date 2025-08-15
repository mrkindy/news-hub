# Installation Guide

Setup instructions for the News Hub Frontend application.

## Prerequisites

- **Node.js**: 18.0.0 or higher
- **npm**: 8.0.0 or higher
- **Git**: Latest version
- **Modern Browser**: Chrome 90+, Firefox 88+, Safari 14+

## Quick Installation

```bash
# Clone repository
git clone <repository-url>
cd frontend

# Install dependencies
npm install

# Set up environment
cp .env.example .env

# Start development server
npm run dev
```

## Environment Configuration

Edit `.env` file with your settings:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_APP_NAME=News Hub

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_PWA=true

# Development
VITE_DEBUG_MODE=true
```

## Development Tools Setup

### VS Code Extensions (Recommended)
- TypeScript and JavaScript Language Features
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- ESLint
- Prettier - Code formatter

### Browser Extensions
- React Developer Tools
- Redux DevTools (if using Redux)

## Package Scripts

```bash
# Development
npm run dev              # Start development server
npm run dev:host         # Serve on network

# Building
npm run build            # Build for production
npm run preview          # Preview production build

# Testing
npm test                 # Run tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage

# Code Quality
npm run lint             # Lint code
npm run lint:fix         # Fix linting issues
npm run format           # Format code with Prettier
```

## Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Change port in vite.config.ts or kill process
lsof -ti:3000 | xargs kill -9
```

**Module resolution errors:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Build errors:**
```bash
# Check TypeScript errors
npm run type-check
```

## Production Build

```bash
# Build for production
npm run build

# Test production build locally
npm run preview

# Analyze bundle size
npm run build:analyze
```

For deployment instructions, see [Deployment Guide](DEPLOYMENT.md).
notepad .env
```

**Required Environment Variables:**

```env
# Minimum required configuration
VITE_API_BASE_URL=http://localhost:8000
VITE_API_VERSION=v1
VITE_DEFAULT_LANGUAGE=en
VITE_DEFAULT_THEME=light
```

### 6. Start Development Server

```bash
# Start the development server
npm run dev

# Alternative commands
npm start  # if available
yarn dev   # if using Yarn
pnpm dev   # if using pnpm
```

The application will be available at `http://localhost:5173`

## 🔧 Package Manager Options

### npm (Default)

```bash
# Install dependencies
npm install

# Start development
npm run dev

# Build for production
npm run build

# Run tests
npm run test
```

### Yarn

```bash
# Install Yarn globally
npm install -g yarn

# Install dependencies
yarn install

# Start development
yarn dev

# Build for production
yarn build

# Run tests
yarn test
```

### pnpm (Fastest)

```bash
# Install pnpm globally
npm install -g pnpm

# Install dependencies
pnpm install

# Start development
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test
```

## 🏗️ Build Tools Setup

### TypeScript Configuration

The project uses TypeScript with the following configurations:

- `tsconfig.json` - Main TypeScript configuration
- `tsconfig.app.json` - Application-specific settings
- `tsconfig.node.json` - Node.js specific settings
- `tsconfig.test.json` - Test-specific settings

### Vite Configuration

Vite is configured in `vite.config.ts` with:

- React plugin for JSX support
- Environment variable plugin
- Optimized dependencies
- Path aliases (if configured)

### Tailwind CSS Setup

Tailwind is configured in `tailwind.config.js`:

```javascript
// Content paths for purging unused styles
content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}']
```

## 🧪 Development Server Configuration

### Port Configuration

Default port is `5173`. To change:

```bash
# Use a different port
npm run dev -- --port 3000

# Or set in vite.config.ts
export default defineConfig({
  server: {
    port: 3000
  }
})
```

### Host Configuration

To access from other devices on the network:

```bash
# Make server accessible on network
npm run dev -- --host 0.0.0.0

# Or in vite.config.ts
export default defineConfig({
  server: {
    host: '0.0.0.0'
  }
})
```

## 🐳 Docker Setup (Optional)

### Using Docker

```bash
# Build the Docker image
docker build -t news-hub-frontend .

# Run the container
docker run -p 80:80 news-hub-frontend
```

### Using Docker Compose

Create a `docker-compose.yml`:

```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "3000:80"
    environment:
      - VITE_API_BASE_URL=http://localhost:8000
```

Then run:

```bash
docker-compose up -d
```

## ⚠️ Troubleshooting

### Common Installation Issues

#### 1. Permission Errors (Linux/macOS)

```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules
```

#### 2. Node Version Conflicts

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 3. Port Already in Use

```bash
# Find and kill process using port 5173
# On macOS/Linux:
lsof -ti :5173 | xargs kill -9

# On Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

#### 4. Memory Issues

```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run dev
```

#### 5. Dependency Conflicts

```bash
# Install with legacy peer deps
npm install --legacy-peer-deps

# Or use exact versions
npm install --save-exact
```

### Getting Help

If you encounter issues:

1. Check the [troubleshooting section](./README.md#troubleshooting) in README
2. Search existing [GitHub issues](https://github.com/mrkindy/news-hub/issues)
3. Create a new issue with:
   - Your operating system
   - Node.js and npm versions
   - Complete error message
   - Steps to reproduce

## 🎯 Next Steps

After successful installation:

1. Read the [Architecture Guide](./ARCHITECTURE.md)
2. Review the [Style Guide](./STYLEGUIDE.md)
3. Check the [Testing Guide](./TESTING.md)
4. Start contributing with the [Contribution Guide](./README.md#contribution-guide)
