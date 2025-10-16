pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'booklib-frontend'
        DOCKER_TAG = "${BUILD_NUMBER}"
        TEST_SERVER = '192.168.1.175'
        CONTAINER_NAME = 'booklib-frontend-app'
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
                    sh """
                        # Run container briefly to test
                        docker run -d --name test-${DOCKER_IMAGE}-${BUILD_NUMBER} -p 8080:80 ${DOCKER_IMAGE}:${DOCKER_TAG}
                        sleep 10
                        
                        # Check if container is running
                        if docker ps | grep test-${DOCKER_IMAGE}-${BUILD_NUMBER}; then
                            echo "Container test passed"
                        else
                            echo "Container test failed"
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
                    echo "Deploying to test server: ${TEST_SERVER}"
                    
                    sshagent(['test-server-key']) {
                        // Copy image to test server
                        sh """
                            scp ${DOCKER_IMAGE}-${DOCKER_TAG}.tar jenkins@${TEST_SERVER}:/tmp/
                        """
                        
                        // Deploy on test server
                        sh """
                            ssh jenkins@${TEST_SERVER} "
                                # Load the Docker image
                                docker load < /tmp/${DOCKER_IMAGE}-${DOCKER_TAG}.tar
                                
                                # Stop and remove existing container if it exists
                                docker stop ${CONTAINER_NAME} || true
                                docker rm ${CONTAINER_NAME} || true
                                
                                # Run new container
                                docker run -d \\
                                    --name ${CONTAINER_NAME} \\
                                    -p ${CONTAINER_PORT}:80 \\
                                    --restart unless-stopped \\
                                    ${DOCKER_IMAGE}:${DOCKER_TAG}
                                
                                # Cleanup old images (keep last 3 builds)
                                docker images ${DOCKER_IMAGE} --format '{{.Tag}}' | grep -E '^[0-9]+\$' | sort -nr | tail -n +4 | xargs -r docker rmi ${DOCKER_IMAGE}: || true
                                
                                # Clean up tar file
                                rm -f /tmp/${DOCKER_IMAGE}-${DOCKER_TAG}.tar
                                
                                # Verify deployment
                                echo 'Verifying deployment...'
                                sleep 5
                                if docker ps | grep ${CONTAINER_NAME}; then
                                    echo '✅ Deployment successful! Application is running on http://${TEST_SERVER}:${CONTAINER_PORT}'
                                else
                                    echo '❌ Deployment failed!'
                                    exit 1
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
            echo "📱 Application deployed to: http://${TEST_SERVER}:${CONTAINER_PORT}"
            
            // You can add notifications here (Slack, email, etc.)
        }
        
        failure {
            echo "❌ Pipeline failed!"
            // You can add failure notifications here
        }
    }
}