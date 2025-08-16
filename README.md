# News Hub - News Aggregation Platform

A modern news aggregation platform that collects news from multiple sources and provides a personalized reading experience for users.

## 📖 Overview

News Hub is a comprehensive news aggregation system consisting of:
- **Backend API** built with Laravel 12 for collecting and processing news
- **Frontend Web App** built with React and TypeScript for displaying news

The system aggregates news from multiple sources like Guardian, New York Times, and NewsOrg, providing a clean API interface with a modern user experience.

## 🏗️ Project Structure

```
innoscripta/
├── backend/          # Laravel API Backend
├── frontend/         # React Frontend Application
└── docker-compose.yml   # Docker configuration
```

## 🚀 Main Components

### 🔧 Backend (Laravel API)
- **Framework**: Laravel 12 with PHP 8.2+
- **Database**: MySQL 8 with Redis caching
- **Authentication**: JWT with Laravel Sanctum
- **APIs**: Integration with Guardian, NY Times, and NewsOrg
- **Documentation**: Swagger API docs

**For more details**: [Backend README](backend/README.md)

### ⚛️ Frontend (React App)
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS for responsive design
- **State Management**: React Query for state and caching
- **Multi-language**: Support for English and German
- **PWA**: Offline support capabilities

**For more details**: [Frontend README](frontend/README.md)

## 🐳 Running with Docker
No installation steps are required, such as creating the database or running migrations.

Simply add the secret keys for the news provider services in the [backend/.env](backend/.env).
```bash
# Run the complete system
docker-compose up -d

# Access applications
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# MySQL: localhost:3306
```

## 📚 Detailed Documentation

### Backend Documentation
- [Installation Guide](backend/docs/INSTALLATION.md)
- [System Architecture](backend/docs/ARCHITECTURE.md)
- [API Documentation](backend/docs/API.md)
- [Testing Guide](backend/docs/TESTING.md)
- [Deployment Guide](backend/docs/DEPLOYMENT.md)

### Frontend Documentation
- [Architecture Guide](frontend/ARCHITECTURE.md)
- [Installation Guide](frontend/INSTALLATION.md)
- [Style Guide](frontend/STYLEGUIDE.md)
- [Testing Guide](frontend/TESTING.md)
- [Deployment Guide](frontend/DEPLOYMENT.md)

## 🔑 Key Features

- ✨ **Smart News Aggregation** from multiple sources
- 🔐 **Secure Authentication** with user management
- 🔍 **Advanced Search** with multiple filters
- 📱 **Responsive Design** works on all devices
- 🌍 **Multi-language Support** (English/German)
- ⚡ **High Performance** with intelligent caching
- 📊 **Admin Dashboard** for content and user management

## 🛠️ System Requirements

- **Docker** and Docker Compose
- **Node.js** 18+ (for development)
- **PHP** 8.2+ (for development)
- **MySQL** 8+ 
- **Redis** (for caching)
