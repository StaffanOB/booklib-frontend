# BookLib Frontend - AI Coding Instructions


    ## Project Overview

    tools {React 18 + TypeScript + Vite frontend for a book search application. Uses Bootstrap 5 for styling with Material-UI icons, currently displaying static book data but architected for future API integration.

        nodejs 'nodejs'

    }## Architecture & Component Structure

    

    stages {### Component Hierarchy

        stage('Checkout') {- `App.tsx` - Main container with hardcoded book data and search bar

            steps {- `BookSearchBar.tsx` - Search interface with dropdown (Free Search/Title/Author) 

                checkout scm- `BookSearchResultItem.tsx` - Individual book display cards with author, year, title, description

            }- `ListGroup.tsx` - Generic reusable list component with selection state

        }

        ### Key Patterns

        stage('Install Dependencies') {- **Prop Interfaces**: All components use TypeScript interfaces (e.g., `BookSearchResultItemProps`)

            steps {- **Component Co-location**: CSS files live alongside TSX components (`BookSearchBar.css` with `BookSearchBar.tsx`)

                sh 'npm ci'- **Bootstrap + MUI Hybrid**: Bootstrap classes for layout (`form-control`, `btn btn-primary`), MUI for icons (`SearchIcon`)

            }

        }## Development Workflow

        

        stage('Build') {### Essential Commands

            steps {```bash

                sh 'npm run build'npm run dev      # Start development server (Vite)

            }npm run build    # TypeScript compile + Vite build

        }npm run preview  # Preview production build

        ```

        stage('Test') {

            steps {### File Organization

                // Unit tests when configured- `/src/components/` - All React components with co-located CSS

                echo 'Unit tests not configured yet'- Global styles imported in `main.tsx` (`bootstrap/dist/css/bootstrap.css`)

            }- Assets in `/src/assets/` (following Vite conventions)

        }

        ## Current Implementation Details

        stage('Build Docker Image') {

            steps {### Data Flow (Static)

                script {Currently uses hardcoded book arrays in `App.tsx`. Book items have structure:

                    def image = docker.build("booklib-frontend:${env.BUILD_NUMBER}")```typescript

                }{ title: string, author: string, description: string, year: number }

            }```

        }

        ### Styling Approach

        stage('Deploy') {- Bootstrap 5 for responsive layout and form controls

            steps {- Component-specific CSS for custom styling (see `BookSearchBar.css` width overrides)

                script {- Material-UI icons imported individually to minimize bundle size

                    // Deploy Docker container

                    echo 'Deploy to target environment'### TypeScript Configuration

                }- Strict mode enabled with `"strict": true`

            }- JSX mode: `"react-jsx"` (new transform)

        }- ES modules only (`"type": "module"` in package.json)

    }

    ## Integration Points

    post {

        always {### External Dependencies

            cleanWs()- **Bootstrap 5.2.3**: Form controls, layout utilities, responsive grid

        }- **Material-UI 7.3.4**: Icon components only (`@mui/icons-material`)

        failure {- **Emotion**: Comes with MUI but currently unused for custom styling

            echo 'Pipeline failed!'

        }### Backend Integration

        success {- **API**: Will connect to `bookend-api` (Flask backend)

            echo 'Pipeline succeeded!'- **Search Types**: Dropdown options (Free Search, Book Title, Author Name) map to planned API endpoints

        }- **State Management**: Redux planned for future API state management

    }

}## Testing Strategy
- **Unit Tests**: Planned for component testing
- **GUI Tests**: Robot Framework tests will be maintained in separate repository
- **Current Status**: No testing framework configured yet

## Deployment & CI/CD
- **Jenkins**: Requires `Jenkinsfile` for CI/CD pipeline
- **Containerization**: Builds into Docker container for deployment
- **Architecture**: Single page application (no routing planned)

## Development Notes

- Vite dev server runs on default port (usually 5173)
- TypeScript compilation happens before build (`tsc && vite build`)
- Build output optimized for Docker containerization