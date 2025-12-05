#!/bin/bash

# HireHub Docker Setup Test Script

echo "🧪 Testing HireHub Docker Setup..."
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if a URL is accessible
check_url() {
    local url=$1
    local name=$2
    
    echo -n "Testing $name... "
    
    if curl -s -f -o /dev/null "$url"; then
        echo -e "${GREEN}✓ OK${NC}"
        return 0
    else
        echo -e "${RED}✗ FAILED${NC}"
        return 1
    fi
}

# Function to check if container is running
check_container() {
    local container=$1
    
    echo -n "Checking $container container... "
    
    if docker ps --format '{{.Names}}' | grep -q "^${container}$"; then
        echo -e "${GREEN}✓ Running${NC}"
        return 0
    else
        echo -e "${RED}✗ Not running${NC}"
        return 1
    fi
}

echo "1. Checking Docker is running..."
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}✗ Docker is not running${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker is running${NC}"
echo ""

echo "2. Checking containers..."
check_container "hirehub-backend"
check_container "hirehub-frontend"
check_container "hirehub-nginx"
echo ""

echo "3. Checking service health..."
check_url "http://localhost/health" "Nginx health endpoint"
check_url "http://localhost/api/health" "Backend API health"
check_url "http://localhost/" "Frontend"
echo ""

echo "4. Checking container logs for errors..."
echo ""
echo "Backend logs (last 10 lines):"
docker-compose logs --tail=10 backend
echo ""
echo "Frontend logs (last 10 lines):"
docker-compose logs --tail=10 frontend
echo ""
echo "Nginx logs (last 10 lines):"
docker-compose logs --tail=10 nginx
echo ""

echo "5. Container resource usage:"
docker stats --no-stream hirehub-backend hirehub-frontend hirehub-nginx
echo ""

echo "✅ Test complete!"
echo ""
echo "Next steps:"
echo "  - View live logs: docker-compose logs -f"
echo "  - Access frontend: http://localhost"
echo "  - Access backend API: http://localhost/api"
