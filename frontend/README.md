# News Hub Frontend

A modern React application for browsing and managing news articles with personalized feeds and advanced filtering.

## Features

- **Personalized News Feed** based on user preferences
- **Advanced Filtering** by categories, sources, authors, and dates
- **Real-time Search** with autocomplete suggestions
- **Multi-language Support** (English/German) with i18next
- **Responsive Design** with Tailwind CSS
- **User Authentication** and preference management
- **Performance Optimized** with React Query caching
- **Accessibility** WCAG compliant with proper ARIA labels

## Quick Start

```bash
# Clone and install
git clone <repository-url>
cd frontend
npm install

# Set up environment
cp .env.example .env

# Start development server
npm run dev
```

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query for server state
- **Routing**: React Router
- **Internationalization**: i18next
- **Build Tool**: Vite
- **Testing**: Jest + React Testing Library

## Environment Configuration

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_APP_NAME=News Hub
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests
- `npm run lint` - Lint code

## Documentation

- [Installation Guide](INSTALLATION.md) - Detailed setup instructions
- [Architecture](ARCHITECTURE.md) - Project structure and patterns
- [Style Guide](STYLEGUIDE.md) - Coding standards and conventions
- [Testing Guide](TESTING.md) - Testing strategies and examples
- [Deployment Guide](DEPLOYMENT.md) - Production deployment options

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Route components
├── hooks/         # Custom React hooks
├── services/      # API service functions
├── context/       # React Context providers
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

5. **Open your browser**
   Navigate to `http://localhost:5173` to see the application.

### Build for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000
VITE_API_VERSION=v1

# Authentication
VITE_JWT_SECRET_KEY=your-secret-key-here

# External APIs
VITE_NEWS_API_KEY=your-news-api-key
VITE_GUARDIAN_API_KEY=your-guardian-api-key
VITE_NYT_API_KEY=your-nyt-api-key

# Analytics (Optional)
VITE_GOOGLE_ANALYTICS_ID=GA-XXXXX-X
VITE_SENTRY_DSN=your-sentry-dsn

# Feature Flags
VITE_ENABLE_DEVTOOLS=true
VITE_ENABLE_ANALYTICS=false

# Application Settings
VITE_DEFAULT_LANGUAGE=en
VITE_DEFAULT_THEME=light
VITE_ARTICLES_PER_PAGE=12
```

### Build Configuration

The application uses Vite as the build tool with the following key configurations:

- **TypeScript**: Full TypeScript support with strict mode
- **React**: React 18 with automatic JSX transform
- **Tailwind CSS**: Utility-first CSS framework
- **ESLint**: Code linting with TypeScript rules
- **Prettier**: Code formatting (configured in .prettierrc)

## 🤝 Contribution Guide

We welcome contributions to the News Hub project! Please follow these guidelines:

### Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Create a feature branch** from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```

### Development Guidelines

#### Code Style

- Follow the existing TypeScript and React patterns
- Use functional components with hooks
- Implement proper TypeScript typing
- Follow the established folder structure
- Write meaningful commit messages

#### Naming Conventions

- **Components**: PascalCase (e.g., `NewsCard.tsx`)
- **Files**: camelCase for utilities, PascalCase for components
- **Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **CSS Classes**: Follow Tailwind conventions

#### Before Submitting

1. **Run tests**: `npm run test`
2. **Run linting**: `npm run lint`
3. **Build successfully**: `npm run build`
4. **Update documentation** if needed
5. **Add tests** for new features

### Pull Request Process

1. **Update the README.md** with details of changes if applicable
2. **Update tests** and ensure all tests pass
3. **Update type definitions** if you've changed interfaces
4. **Request review** from maintainers
5. **Address feedback** promptly

### Reporting Issues

When reporting bugs or requesting features:

1. **Use the issue templates** provided
2. **Include clear reproduction steps** for bugs
3. **Provide context** for feature requests
4. **Check existing issues** to avoid duplicates

### Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and grow

## 📚 Additional Documentation

- [Installation Guide](./INSTALLATION.md) - Detailed setup instructions
- [Architecture Overview](./ARCHITECTURE.md) - Project structure and design patterns
- [Style Guide](./STYLEGUIDE.md) - Coding standards and conventions
- [Testing Guide](./TESTING.md) - Testing strategies and examples
- [Deployment Guide](./DEPLOYMENT.md) - Production deployment instructions

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Kill process on port 5173
   npx kill-port 5173
   ```

2. **Node modules issues**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **TypeScript errors**
   ```bash
   # Restart TypeScript service in VS Code
   Ctrl+Shift+P -> "TypeScript: Restart TS Server"
   ```

## 👨‍💻 Maintainers

- **mrkindy** - *Initial work* - [@mrkindy](https://github.com/mrkindy)

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/) and [React](https://reactjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide React](https://lucide.dev/)
- Testing with [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
