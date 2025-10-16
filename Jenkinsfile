pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'booklib-frontend'
        DOCKER_TAG = "${BUILD_NUMBER}"
        DEPLOY_SERVER = '192.168.1.175'
        DEPLOY_USER = 'deploy'
        DEPLOY_PATH = '/opt/booklib/frontend'
        CONTAINER_NAME = 'booklib-frontend'
        CONTAINER_PORT = '3000'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo "Checked out code from ${env.GIT_BRANCH}"
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    echo "Building Docker image: ${DOCKER_IMAGE}:${DOCKER_TAG}"
                    def image = docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}")
                    
                    // Tag as latest as well
                    sh "docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_IMAGE}:latest"
                }
            }
        }
        
        stage('Test Container') {
            steps {
                script {
                    echo "Testing the Docker container locally"
                    def testPort = 8000 + env.BUILD_NUMBER.toInteger()
                    sh """
                        # Run container briefly to test (using dynamic port to avoid conflicts)
                        docker run -d --name test-${DOCKER_IMAGE}-${BUILD_NUMBER} -p ${testPort}:80 ${DOCKER_IMAGE}:${DOCKER_TAG}
                        sleep 5
                        
                        # Check if container is running
                        if docker ps | grep test-${DOCKER_IMAGE}-${BUILD_NUMBER}; then
                            echo "✅ Container test passed - listening on port ${testPort}"
                        else
                            echo "❌ Container test failed"
                            exit 1
                        fi
                        
                        # Cleanup test container
                        docker stop test-${DOCKER_IMAGE}-${BUILD_NUMBER}
                        docker rm test-${DOCKER_IMAGE}-${BUILD_NUMBER}
                    """
                }
            }
        }
        
        stage('Save Docker Image') {
            steps {
                script {
                    echo "Saving Docker image to tar file"
                    sh "docker save ${DOCKER_IMAGE}:${DOCKER_TAG} > ${DOCKER_IMAGE}-${DOCKER_TAG}.tar"
                }
            }
        }
        
        stage('Deploy to Test Server') {
            steps {
                script {
                    echo "Deploying to test server: ${DEPLOY_SERVER}"
                    
                    sshagent(['deploy-key']) {
                        // Ensure deploy directory exists first
                        sh """
                            ssh -o StrictHostKeyChecking=no ${DEPLOY_USER}@${DEPLOY_SERVER} "mkdir -p ${DEPLOY_PATH}"
                        """
                        
                        // Copy image and compose files to test server
                        sh """
                            scp -o StrictHostKeyChecking=no ${DOCKER_IMAGE}-${DOCKER_TAG}.tar ${DEPLOY_USER}@${DEPLOY_SERVER}:/tmp/
                            scp -o StrictHostKeyChecking=no docker-compose.yml ${DEPLOY_USER}@${DEPLOY_SERVER}:${DEPLOY_PATH}/
                        """
                        
                        // Deploy frontend service independently
                        sh """
                            ssh -o StrictHostKeyChecking=no ${DEPLOY_USER}@${DEPLOY_SERVER} "
                                # Change to deploy directory
                                cd ${DEPLOY_PATH}
                                
                                # Create external network if it doesn't exist
                                docker network inspect booklib-net >/dev/null 2>&1 || docker network create booklib-net
                                
                                # Load the new frontend image
                                docker load < /tmp/${DOCKER_IMAGE}-${DOCKER_TAG}.tar
                                
                                # Tag as latest
                                docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_IMAGE}:latest
                                
                                # Stop existing frontend service
                                docker compose down || true
                                
                                # Start frontend service
                                docker compose up -d
                                
                                # Cleanup old images (keep last 3 builds)
                                docker images ${DOCKER_IMAGE} --format '{{.Tag}}' | grep -E '^[0-9]+\$' | sort -nr | tail -n +4 | xargs -r docker rmi ${DOCKER_IMAGE}: || true
                                
                                # Clean up temporary files
                                rm -f /tmp/${DOCKER_IMAGE}-${DOCKER_TAG}.tar
                                
                                # Verify deployment
                                echo 'Verifying deployment...'
                                sleep 10
                                
                                # Show service status
                                docker compose ps || true
                                
                                # Verify frontend deployment
                                if docker ps | grep ${CONTAINER_NAME}; then
                                    echo '✅ Frontend deployed successfully!'
                                    echo '🌐 Frontend available at: http://${DEPLOY_SERVER}:${CONTAINER_PORT}'
                                    
                                    # Check if other BookLib services are running (informational)
                                    echo ''
                                    echo '📊 BookLib Services Status:'
                                    docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}' | grep booklib || echo 'No other BookLib services detected'
                                else
                                    echo '❌ Frontend deployment failed!'
                                    docker compose logs || true
                                    exit 0
                                fi
                            "
                        """
                    }
                }
            }
        }
    }
    
    post {
        always {
            // Cleanup local files
            sh """
                rm -f ${DOCKER_IMAGE}-${DOCKER_TAG}.tar || true
                docker rmi ${DOCKER_IMAGE}:${DOCKER_TAG} || true
            """
            cleanWs()
        }
        
        success {
            echo "🎉 Pipeline completed successfully!"
            echo "📱 Application deployed to: http://${DEPLOY_SERVER}:${CONTAINER_PORT}"
            
            // You can add notifications here (Slack, email, etc.)
        }
        
        failure {
            echo "❌ Pipeline failed!"
            // You can add failure notifications here
        }
    }
}