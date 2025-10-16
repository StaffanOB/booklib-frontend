#!/bin/bash

# BookLib Network Setup Script
# Run this script on the deployment server to set up the Docker network

echo "🔧 Setting up BookLib Docker network..."

# Create the external network that both frontend and API will use
docker network create booklib-net 2>/dev/null || echo "Network 'booklib-net' already exists"

# Verify network exists
if docker network ls | grep -q booklib-net; then
    echo "✅ Network 'booklib-net' is ready"
    docker network inspect booklib-net --format='{{range .IPAM.Config}}{{.Subnet}}{{end}}' | xargs -I {} echo "📡 Network subnet: {}"
else
    echo "❌ Failed to create network 'booklib-net'"
    exit 1
fi

echo "🎉 Network setup complete!"
echo ""
echo "Next steps:"
echo "1. Deploy booklib-api first: cd /opt/booklib-api && docker-compose up -d"
echo "2. Deploy booklib-frontend: cd /opt/booklib && docker-compose up -d"
echo "3. Verify services: docker ps | grep booklib"