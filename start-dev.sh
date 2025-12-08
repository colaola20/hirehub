#!/bin/bash

# HireHub Development Start Script

echo "🚀 Starting HireHub with Docker..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

# Check if .env file exists
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Warning: backend/.env file not found!"
    echo "📝 Creating from .env.example..."
    cp backend/.env.example backend/.env
    echo ""
    echo "✏️  Please edit backend/.env with your actual credentials before continuing."
    echo "   Then run this script again."
    exit 1
fi

echo "📦 Building Docker images..."
docker-compose build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

echo ""
echo "🏃 Starting services..."
docker-compose up -d

if [ $? -ne 0 ]; then
    echo "❌ Failed to start services. Please check the errors above."
    exit 1
fi

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 5

echo ""
echo "📊 Service Status:"
docker-compose ps

echo ""
echo "✅ HireHub is running!"
echo ""
echo "🌐 Access the application:"
echo "   Frontend:     http://localhost"
echo "   Backend API:  http://localhost/api"
echo "   Health Check: http://localhost/health"
echo "   Direct Backend (dev): http://localhost:5001"
echo ""
echo "📝 View logs:"
echo "   All services: docker-compose logs -f"
echo "   Backend:      docker-compose logs -f backend"
echo "   Frontend:     docker-compose logs -f frontend"
echo "   Nginx:        docker-compose logs -f nginx"
echo ""
echo "🛑 Stop services:"
echo "   docker-compose down"
echo ""
