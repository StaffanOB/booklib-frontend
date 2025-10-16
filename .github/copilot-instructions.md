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

### API Base URL

- **Container-to-container**: `http://booklib-api:5000` (production)
- **Local development**: `http://192.168.1.175:5000` (test server)
- **All endpoints**: Prefix with base URL

### Authentication

- **Type**: JWT Bearer Token
- **Header**: `Authorization: Bearer <token>`
- **Login**: `POST /users/login` returns JWT token
- **Protected routes**: Require `Authorization` header

#### Auth Endpoints

```typescript
// POST /users/register
{
  username: string;
  email: string;
  password: string;
}
// Response: 201 Created | 400 Missing fields | 409 User exists

// POST /users/login
{
  username: string;
  password: string;
}
// Response: 200 { token: string } | 401 Invalid credentials
```

### Book Endpoints

```typescript
// GET /books - List all books
// Response: { books: Book[] }

// GET /books/{id} - Get single book
// Response: Book object

// GET /books/{id}/full - Get book with ratings, comments, reviews
// Response: {
//   id: number;
//   title: string;
//   author: string;
//   description: string;
//   publish_year: number | null;
//   series: string | null;
//   cover_url: string | null;
//   average_rating: number | null;
//   ratings: Rating[];
//   comments: Comment[];
//   reviews: Review[];
// }

// POST /books - Add book (requires auth)
{
  title: string; // required
  isbn?: string;
  description?: string;
  publish_year?: number | string | null;
  series?: string | null;
  tags?: string[];
  plugin?: "GoogleBooksPlugin" | "OpenLibraryPlugin";
}
// Response: 201 Created

// PUT /books/{id} - Update book (requires auth)
// DELETE /books/{id} - Delete book (requires auth)

// POST /books/{id}/recheck - Recheck book info with plugin (requires auth)
{
  plugin?: "GoogleBooksPlugin" | "OpenLibraryPlugin";
}
```

### Reviews, Ratings & Comments

```typescript
// Review object structure
interface Review {
  id: number;
  book_id: number;
  user_id: number;
  username: string;
  review_text: string;
  reading_format: "paperback" | "audiobook" | "ebook";
  created_at: string; // ISO 8601 datetime
  updated_at: string;
}

// GET /reviews - All reviews
// GET /reviews/{review_id} - Single review
// GET /reviews/book/{book_id} - Reviews for a book
// GET /reviews/user/{user_id} - Reviews by a user

// POST /reviews (requires auth)
{
  book_id: number;
  review_text: string;
  reading_format: "paperback" | "audiobook" | "ebook";
}
// Response: 201 Created | 400 Invalid/already reviewed | 404 Book not found

// PUT /reviews/{review_id} (requires auth, own reviews only)
{
  review_text?: string;
  reading_format?: "paperback" | "audiobook" | "ebook";
}

// DELETE /reviews/{review_id} (requires auth, own reviews only)

// GET /books/{id}/ratings - Average rating for book
// Response: { average: number | null }

// POST /books/{id}/ratings (requires auth, one per user per book)
{ rating: number }
// Response: 201 Created | 409 Already rated

// PUT /books/{id}/ratings/{rating_id} (requires auth)
{ rating: number }

// DELETE /books/{id}/ratings/{rating_id} (requires auth)

// GET /books/{id}/comments - Comments for book
// POST /books/{id}/comments (requires auth)
{ text: string }

// PUT /books/{id}/comments/{comment_id} (requires auth)
{ text: string }

// DELETE /books/{id}/comments/{comment_id} (requires auth)
```

### Tags & Plugins

```typescript
// GET /tags - All tags
// Response: { id: number; name: string }[]

// POST /tags (requires auth)
{ name: string }

// PUT /tags/{id} (requires auth)
{ name: string }

// DELETE /tags/{id} (requires auth)

// GET /plugins - List available plugins
// POST /plugins/load - Load plugin
// POST /plugins/unload - Unload plugin
// POST /plugins/{plugin_name}/run - Execute plugin
```

### User Management

```typescript
// GET /users (requires auth) - All users
// GET /users/{user_id} (requires auth) - Single user
// DELETE /users/{user_id} (requires auth) - Delete user

// User object: { id: number; username: string; email: string }
```

### TypeScript Interfaces

```typescript
interface Book {
  id: number;
  title: string;
  author?: string;
  description?: string;
  isbn?: string;
  publish_year?: number | null;
  series?: string | null;
  cover_url?: string | null;
  tags?: string[];
}

interface Rating {
  id: number;
  user_id: number;
  rating: number;
}

interface Comment {
  id: number;
  user_id: number;
  text: string;
}

interface AuthResponse {
  token: string;
}

interface User {
  id: number;
  username: string;
  email: string;
}
```

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

## Next Steps for Frontend Integration

### API Service Layer (To Implement)

Create `src/services/api.ts`:
```typescript
import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'http://booklib-api:5000'  // Container network
  : 'http://192.168.1.175:5000'; // Local development

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### State Management

- **Authentication State**: User login status, JWT token storage
- **Book Search State**: Search results, filters, pagination
- **UI State**: Loading indicators, error messages

### Search Integration

Map emoji dropdown to API calls:
- 🔍 Free Search → Query all fields (implement custom endpoint or client-side filtering)
- 📚 Book Title → Filter by title field
- 👤 Author Name → Filter by author field

### Current Status

- ✅ UI components built and styled
- ✅ API documentation complete
- ✅ TypeScript interfaces defined
- ⏳ API service layer (next task)
- ⏳ Authentication flow (next task)
- ⏳ Search functionality (next task)

## Testing Strategy

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
