# Docker + Nginx Setup Complete! 🎉

## What Was Created

### 1. Docker Configuration Files

#### `docker-compose.yml`
- Orchestrates all services (Flask, React, Nginx)
- Defines networking and volumes
- Includes health checks for all services

#### `backend/Dockerfile`
- Multi-stage Python build
- Installs dependencies
- Runs Flask on port 5001
- Includes health check

#### `nginx/Dockerfile` & `nginx/nginx.conf`
- Reverse proxy configuration
- Routes `/api/*` → Flask backend
- Routes `/*` → React frontend
- Handles file uploads (50MB limit)

#### `frontend/frontend/my-react-router-app/Dockerfile.nginx` (Optional)
- Alternative Dockerfile using Nginx to serve React
- More efficient than Node.js server
- Better for production

### 2. Configuration Files

- `backend/.env.example` - Template for environment variables
- `backend/.dockerignore` - Excludes unnecessary files from Docker build
- `.dockerignore` - Root-level Docker ignore
- Updated `.gitignore` - Prevents committing Docker artifacts

### 3. Helper Scripts

- `start-dev.sh` - One-command startup script
- `README.Docker.md` - Comprehensive Docker guide

### 4. Health Endpoint

- Added `/api/health` endpoint in `backend/app/routes/home.py`
- Used by Docker health checks
- Verifies database connectivity

## Quick Start

### Step 1: Start the Application

```bash
# Make the script executable (first time only)
chmod +x start-dev.sh

# Start everything
./start-dev.sh
```

Or manually:

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f
```

### Step 2: Access Your Application

- **Frontend**: http://localhost
- **Backend API**: http://localhost/api
- **Health Check**: http://localhost/health
- **Direct Backend** (dev): http://localhost:5001/api/health

### Step 3: Verify Everything Works

```bash
# Check service status
docker-compose ps

# Test health endpoint
curl http://localhost/api/health

# View backend logs
docker-compose logs -f backend

# View all logs
docker-compose logs -f
```

## Architecture

```
┌─────────────────────────────────────────┐
│           Browser/Client                │
└──────────────┬──────────────────────────┘
               │
               ↓ Port 80
┌──────────────────────────────────────────┐
│         Nginx (Reverse Proxy)            │
│  - SSL/HTTPS (when configured)           │
│  - Route traffic                         │
│  - Compression                           │
└──────────┬───────────────────────────────┘
           │
           ├─→ /api/* ─────→ ┌────────────────────┐
           │                 │  Flask Backend     │
           │                 │  Port: 5001        │
           │                 │  - API routes      │
           │                 │  - Database        │
           │                 │  - S3 uploads      │
           │                 └────────────────────┘
           │
           └─→ /* ─────────→ ┌────────────────────┐
                             │  React Frontend    │
                             │  Port: 80          │
                             │  - SPA routing     │
                             │  - Static assets   │
                             └────────────────────┘
```

## Common Commands

### Starting & Stopping

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Restart a service
docker-compose restart backend
docker-compose restart frontend
docker-compose restart nginx
```

### Viewing Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f nginx

# Last 50 lines
docker-compose logs --tail=50 backend
```

### Rebuilding After Changes

```bash
# Rebuild specific service
docker-compose build backend
docker-compose up -d backend

# Rebuild everything
docker-compose build
docker-compose up -d

# Force rebuild (no cache)
docker-compose build --no-cache
```

### Database Operations

```bash
# Run Flask migrations
docker-compose exec backend flask db upgrade

# Access Python shell in container
docker-compose exec backend python

# Create database tables
docker-compose exec backend python create_tables.py
```

### Debugging

```bash
# Enter a running container
docker-compose exec backend bash
docker-compose exec frontend sh

# Check container resource usage
docker stats

# Inspect container
docker inspect hirehub-backend

# Check networks
docker network ls
docker network inspect hirehub_hirehub-network
```

## Important Notes

### CORS Configuration

The backend's CORS is currently set to:
```python
CORS(app, origins=["http://localhost:5173"])
```

You may need to update this in `backend/app/__init__.py` to:
```python
CORS(app, origins=["http://localhost", "http://localhost:80", "http://localhost:5173"])
```

### Environment Variables

Make sure your `backend/.env` file has:
- Database credentials (RDS)
- AWS S3 credentials
- OAuth client IDs/secrets
- API keys

See `backend/.env.example` for the full list.

### Ports

- **80** - Nginx (external access)
- **443** - Nginx HTTPS (when SSL configured)
- **5001** - Flask backend (exposed for dev, should be removed in production)

## Next Steps

### 1. Test the Current Setup

```bash
# Start services
docker-compose up -d

# Check logs
docker-compose logs -f

# Test endpoints
curl http://localhost/api/health
curl http://localhost
```

### 2. For Production

- Remove the exposed port `5001:5001` from backend service in `docker-compose.yml`
- Create `docker-compose.prod.yml` with production settings
- Set up SSL/HTTPS with Let's Encrypt
- Configure proper secrets management
- Set up CloudWatch logging
- Enable auto-restart policies

### 3. Optional Improvements

- Use the `Dockerfile.nginx` for React frontend (more efficient)
- Add rate limiting in nginx
- Set up monitoring with Prometheus/Grafana
- Configure CDN (CloudFront) for static assets
- Add Redis for session management
- Set up automated backups

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker-compose logs backend

# Common issues:
# - Missing .env file
# - Database connection failed
# - Port already in use
```

### Port 80 Already in Use

```bash
# Find what's using port 80
sudo lsof -i :80

# Stop conflicting service
sudo systemctl stop apache2
# or
sudo systemctl stop nginx
```

### Database Connection Failed

```bash
# Check from container
docker-compose exec backend bash
apt update && apt install -y postgresql-client
psql $DATABASE_URL

# Verify RDS security group allows your IP
```

### Changes Not Reflecting

```bash
# Rebuild the service
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## Support

For detailed documentation, see:
- `README.Docker.md` - Comprehensive Docker guide
- Docker documentation: https://docs.docker.com
- Docker Compose: https://docs.docker.com/compose

Need help? Check the logs first:
```bash
docker-compose logs -f
```
