# HireHub - Docker Setup Guide

This guide will help you run the HireHub application using Docker and Docker Compose.

## Architecture

```
Internet/Browser
       ↓
   Nginx (Port 80)
       ↓
       ├─→ /api/* → Flask Backend (Port 5001)
       └─→ /* → React Frontend (Port 80)
```

## Prerequisites

- Docker Desktop installed ([Download here](https://www.docker.com/products/docker-desktop))
- Docker Compose (included with Docker Desktop)
- Git

## Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd hirehub
```

### 2. Set Up Environment Variables

Copy the example environment file and fill in your credentials:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your actual values:
- Database credentials (RDS endpoint, password)
- AWS S3 credentials
- OAuth client IDs and secrets
- API keys

### 3. Build and Start Services

```bash
# Build all Docker images
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

### 4. Access the Application

- **Frontend (React)**: http://localhost
- **Backend API**: http://localhost/api
- **Health Check**: http://localhost/health
- **Direct Backend** (dev only): http://localhost:5001

## Docker Commands Cheat Sheet

### Start/Stop Services

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Restart a specific service
docker-compose restart backend
docker-compose restart frontend
docker-compose restart nginx
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f nginx

# Last 100 lines
docker-compose logs --tail=100 backend
```

### Check Service Status

```bash
# List running containers
docker-compose ps

# Check resource usage
docker stats
```

### Rebuild After Code Changes

```bash
# Rebuild specific service
docker-compose build backend
docker-compose up -d backend

# Rebuild all services
docker-compose build
docker-compose up -d
```

### Database Operations

```bash
# Run migrations
docker-compose exec backend python -m flask db upgrade

# Access Flask shell
docker-compose exec backend python

# Create tables
docker-compose exec backend python create_tables.py
```

### Debugging

```bash
# Enter a running container
docker-compose exec backend bash
docker-compose exec frontend sh

# View container details
docker inspect hirehub-backend

# Remove all containers and volumes (CAREFUL!)
docker-compose down -v
```

## Project Structure

```
hirehub/
├── backend/
│   ├── app/                 # Flask application code
│   ├── Dockerfile           # Backend Docker image
│   ├── requirements.txt     # Python dependencies
│   ├── .env                 # Environment variables (not in git)
│   └── .env.example         # Example environment file
├── frontend/
│   └── frontend/
│       └── my-react-router-app/
│           ├── Dockerfile   # Frontend Docker image
│           └── package.json # Node dependencies
├── nginx/
│   ├── Dockerfile           # Nginx Docker image
│   └── nginx.conf           # Nginx configuration
└── docker-compose.yml       # Orchestration file
```

## Service Details

### Backend (Flask)
- **Container Name**: `hirehub-backend`
- **Port**: 5001 (internal), exposed for development
- **Health Check**: http://localhost:5001/api/health
- **Dependencies**: PostgreSQL (RDS), S3

### Frontend (React)
- **Container Name**: `hirehub-frontend`
- **Port**: 80 (internal)
- **Built with**: Vite + React Router

### Nginx
- **Container Name**: `hirehub-nginx`
- **Port**: 80 (external)
- **Purpose**: Reverse proxy, routes traffic to backend/frontend

## Networking

All services run on the `hirehub-network` Docker network. They can communicate using service names:
- Backend accessible at: `http://backend:5001`
- Frontend accessible at: `http://frontend:80`

## Volumes

- `backend-uploads`: Persistent storage for uploaded files
- `nginx-logs`: Nginx access and error logs

## Environment Variables

The backend requires these environment variables (see `.env.example`):

### Required
- `DATABASE_URL`: PostgreSQL connection string
- `AWS_S3_BUCKET`: S3 bucket name
- `AWS_REGION`: AWS region
- `AWS_ACCESS_KEY_ID`: AWS credentials
- `AWS_SECRET_ACCESS_KEY`: AWS credentials

### OAuth (Optional)
- GitHub, Google, LinkedIn client IDs and secrets

### API Keys (Optional)
- Findwork, Adzuna, Groq, OpenAI API keys

## Troubleshooting

### Container Exits Immediately
```bash
# Check logs
docker-compose logs backend

# Common issues:
# - Missing environment variables
# - Database connection failed
# - Port already in use
```

### Can't Connect to Database
```bash
# Test from container
docker-compose exec backend bash
apt update && apt install -y postgresql-client
psql $DATABASE_URL

# Check security group allows EC2/container IP
```

### Port Already in Use
```bash
# Find what's using port 80
sudo lsof -i :80

# Stop conflicting service
sudo systemctl stop apache2  # or nginx
```

### Changes Not Reflecting
```bash
# Rebuild the service
docker-compose build backend
docker-compose up -d backend

# Clear cache and rebuild
docker-compose build --no-cache backend
```

### Permission Issues
```bash
# Fix ownership (if needed)
sudo chown -R $USER:$USER backend/uploads
```

## Production Deployment

For production deployment to AWS EC2, see the separate deployment guide.

Key differences for production:
- Use `docker-compose.prod.yml`
- Enable SSL/HTTPS in nginx
- Remove exposed ports (only nginx on 80/443)
- Set `FLASK_ENV=production`
- Use secrets management (AWS Secrets Manager)
- Enable CloudWatch logging
- Set up automated backups

## Support

If you encounter issues:
1. Check the logs: `docker-compose logs -f`
2. Verify environment variables: `cat backend/.env`
3. Check service status: `docker-compose ps`
4. Restart services: `docker-compose restart`

For more help, open an issue on GitHub.
