# BookLib Frontend - AI Coding Instructions

## Project Overview

React 18 + TypeScript + Vite frontend for the BookLib book search application. Part of a 3-service microservices architecture deployed independently via Docker containers on server 192.168.1.175, with shared `booklib-net` network communication.

## Architecture & System Integration

### 3-Service Microservice Architecture

- **booklib-db**: PostgreSQL database service (independent repository/deployment)
- **booklib-api**: Flask REST API backend service (independent repository/deployment)  
- **booklib-frontend**: React SPA frontend service (this repository)
- **Network**: All services communicate via shared `booklib-net` Docker network
- **Server**: All deployed to 192.168.1.175 with independent Jenkins pipelines
- **Standalone Capable**: Each service can run independently and gracefully handle missing dependencies

### Component Hierarchy

- **`TopBar.tsx`**: Fixed navigation with BookLib brand and Login dialog
- **`App.tsx`**: Main container with centered logo and search bar
- **`BookSearchBar.tsx`**: Search interface with emoji icon dropdown (🔍 Free Search, 📚 Book Title, 👤 Author Name)
- **`BookSearchResultItem.tsx`**: Individual book display cards with author, year, title, description
- **`LoginDialog.tsx`**: Modal authentication form
- **`ListGroup.tsx`**: Generic reusable list component with selection state

### Key Development Patterns

- **Prop Interfaces**: All components use TypeScript interfaces (e.g., `BookSearchResultItemProps`)
- **Component Co-location**: CSS files alongside TSX components (`BookSearchBar.css` with `BookSearchBar.tsx`)
- **Bootstrap + MUI Hybrid**: Bootstrap classes for layout, Material-UI for icons only
- **Centered Layout**: Logo and search bar positioned above center with 40px top bar

## Development Workflow

### Essential Commands

```bash
npm run dev      # Start development server (Vite on port 5173)
npm run build    # TypeScript compile + Vite build for production
npm run preview  # Preview production build locally
```

### File Organization

- `/src/components/` - All React components with co-located CSS
- `/src/assets/` - Static assets (logo.png in /public/)
- Global styles imported in `main.tsx` (`bootstrap/dist/css/bootstrap.css`)

## Current UI Implementation

### Layout Structure

```
┌─────────────────────────────────┐
│ TopBar: BookLib [Login] (40px)  │
├─────────────────────────────────┤
│                                 │
│          🖼️ Logo               │ ← Positioned above center
│                                 │
│   🔍 📚 👤 [Search Field] 🔍   │ ← Centered with icon dropdown
│                                 │
└─────────────────────────────────┘
```

### Data Flow (Static → API Ready)

Currently uses hardcoded book data in `App.tsx`. Book items structure:

```typescript
{ title: string, author: string, description: string, year: number }
```

## Docker & Deployment Architecture

### Container Strategy

- **Multi-stage build**: Node.js build → Nginx serving
- **Independent Deployment**: Each service has its own Docker Compose file and Jenkins pipeline
- **Shared Network**: `booklib-net` (external) enables service communication
- **Container Names**: `booklib-frontend`, `booklib-api`, `booklib-db`

### Service Communication

- **External Access**: http://192.168.1.175:3000 (frontend), :5000 (API), :5432 (database)
- **Internal API calls**: `http://booklib-api:5000` (container-to-container)
- **Database Access**: `postgresql://booklib_user:password@booklib-db:5432/booklib_test`
- **Environment**: `REACT_APP_API_URL=http://booklib-api:5000`

### Jenkins Pipeline Flow

1. **Build**: Creates Docker image with build number tag
2. **Test**: Verifies container starts and responds
3. **Deploy**: Uses Docker Compose on test server (192.168.1.175)
4. **Network Setup**: Ensures `booklib-net` exists for service communication
5. **Health Checks**: Waits for API health endpoint before starting frontend
6. **Verification**: Confirms both services are running

## Integration with booklib-api

### Network Configuration

```yaml
networks:
  booklib-net:
    external: true # Shared between frontend and API repos
```

### Environment Alignment

- **Database**: PostgreSQL `postgresql://booklib_user:test_password@booklib-db:5432/booklib_test`
- **API Container**: `booklib-api` (matches API repo configuration)
- **Secrets**: JWT_SECRET_KEY, SECRET_KEY (shared configuration)

### Deployment Dependencies

- API must be deployed first (health check dependency)
- Frontend waits for API `/health` endpoint
- Both services share the same external network

## Future Development

### Planned Integrations

- **API Connection**: Replace static data with REST API calls to booklib-api
- **Authentication**: JWT tokens from login dialog → API authorization
- **State Management**: Redux for API state, user sessions
- **Search Functionality**: Dropdown types map to API endpoints (/search/free, /search/title, /search/author)

### Testing Strategy

- **Unit Tests**: Component testing (framework TBD)
- **Integration**: API communication testing
- **GUI Tests**: Robot Framework (separate repository)

## Critical Development Notes

- **API URL**: Always use `http://booklib-api:5000` for container-to-container communication
- **Network**: All services must use `booklib-net` external network
- **Container Names**: Must match across repositories (`booklib-frontend`, `booklib-api`)
- **Health Checks**: API must expose `/health` endpoint for deployment verification
- **Build Process**: TypeScript compilation happens before Vite build (`tsc && vite build`)
- **Static Assets**: Logo and favicon served from `/public/` directory
