# Jenkins Setup Guide for BookLib Frontend Deployment

## Prerequisites

### 1. Jenkins Server Setup

- Jenkins should have Docker installed and accessible
- Jenkins user should be in the docker group: `sudo usermod -aG docker jenkins`
- Install required Jenkins plugins:
  - Docker Pipeline Plugin
  - SSH Agent Plugin
  - Git Plugin

### 2. Test Server Setup (192.168.1.175)

- Docker installed and running
- Docker Compose installed
- SSH access configured for Jenkins
- User 'jenkins' with Docker permissions
- Directory `/opt/booklib` created with proper permissions

## Jenkins Configuration Steps

### 1. SSH Key Setup

1. Generate SSH key pair on Jenkins server:

   ```bash
   ssh-keygen -t rsa -b 4096 -f ~/.ssh/booklib_deploy_key
   ```

2. Copy public key to test server:

   ```bash
   ssh-copy-id -i ~/.ssh/booklib_deploy_key.pub jenkins@192.168.1.175
   ```

3. Add private key to Jenkins:
   - Go to Jenkins → Manage Jenkins → Credentials
   - Add new SSH Username with private key
   - ID: `test-server-key`
   - Username: `jenkins`
   - Private Key: paste content of `~/.ssh/booklib_deploy_key`

### 2. Create Jenkins Pipeline Job

1. New Item → Pipeline
2. Pipeline → Definition → Pipeline script from SCM
3. SCM: Git
4. Repository URL: your repository URL
5. Branch: `*/dev` (or your target branch)
6. Script Path: `Jenkinsfile`

### 3. Test Server Docker Setup

On 192.168.1.175, ensure:

```bash
# Install Docker if not installed
sudo apt update
sudo apt install docker.io
sudo systemctl enable docker
sudo systemctl start docker

# Create jenkins user and add to docker group
sudo useradd -m jenkins
sudo usermod -aG docker jenkins

# Test Docker access
sudo -u jenkins docker ps
```

## Automated Deployment with Docker Compose

Deployment is fully automated through Jenkins pipeline:

1. Push code to repository
2. Jenkins automatically triggers build
3. Builds and tests Docker container
4. Deploys using Docker Compose (orchestrates both frontend and API)
5. Verifies both services are running
6. Provides full-stack application access

### Architecture

- **Frontend**: React app served by Nginx (port 3000)
- **Backend**: Flask API (port 5000)
- **Network**: Custom Docker network for service communication
- **Data**: Persistent volume for database storage

5. Verifies deployment success

## Environment Variables

The Jenkinsfile uses these environment variables:

- `DOCKER_IMAGE`: booklib-frontend
- `TEST_SERVER`: 192.168.1.175
- `CONTAINER_NAME`: booklib-frontend-app
- `CONTAINER_PORT`: 3000

## Accessing the Application

After successful deployment:

- URL: http://192.168.1.175:3000
- Container logs: `docker logs booklib-frontend-app`
- Container status: `docker ps | grep booklib-frontend-app`

## Troubleshooting

### Common Issues:

1. **SSH Connection Failed**

   - Verify SSH key is correctly added to Jenkins credentials
   - Test SSH connection manually: `ssh jenkins@192.168.1.175`

2. **Docker Permission Denied**

   - Ensure jenkins user is in docker group on both servers
   - Restart Jenkins service after group changes

3. **Port Already in Use**

   - Check if port 3000 is available: `netstat -tlnp | grep :3000`
   - Stop existing container: `docker stop booklib-frontend-app`

4. **Container Won't Start**
   - Check Docker logs: `docker logs booklib-frontend-app`
   - Verify image was built correctly: `docker images | grep booklib-frontend`

## Security Notes

- SSH keys should be properly secured
- Consider using Docker secrets for sensitive data
- Regularly update base images for security patches
- Use specific version tags instead of 'latest' in production
