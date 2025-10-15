# BookLib Frontend

A React 18 + TypeScript + Vite frontend application for searching and displaying books. Currently displays static book data with plans for future integration with the `bookend-api` Flask backend.

## Prerequisites

- **Node.js**: Version 16 or higher
- **npm**: Comes with Node.js (or use yarn/pnpm as alternative)

## Local Development Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd booklib-frontend
```

### 2. Install Dependencies

```bash
npm install
```

This will install all dependencies including:

- React 18.2.0 with TypeScript support
- Vite for fast development and building
- Bootstrap 5.2.3 for styling
- Material-UI icons for UI elements

### 3. Start Development Server

```bash
npm run dev
```

The application will start on `http://localhost:5173` (default Vite port). The development server includes:

- Hot module replacement (HMR)
- TypeScript compilation
- Automatic browser refresh on file changes

### 4. Build for Production

```bash
npm run build
```

This command:

1. Runs TypeScript compiler (`tsc`) to check for type errors
2. Creates optimized production build in `dist/` directory
3. Bundles and minifies all assets

### 5. Preview Production Build

```bash
npm run preview
```

Serves the production build locally for testing before deployment.

## Project Structure

```
booklib-frontend/
├── src/
│   ├── components/          # React components with co-located CSS
│   │   ├── BookSearchBar.tsx
│   │   ├── BookSearchBar.css
│   │   ├── BookSearchResultItem.tsx
│   │   └── ListGroup.tsx
│   ├── assets/             # Static assets
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   └── vite-env.d.ts       # Vite type definitions
├── public/                 # Static public assets
├── dist/                   # Production build output (generated)
└── node_modules/           # Dependencies (generated)
```

## Available Scripts

| Command           | Description                       |
| ----------------- | --------------------------------- |
| `npm run dev`     | Start development server with HMR |
| `npm run build`   | Build for production              |
| `npm run preview` | Preview production build locally  |

## Configuration

### TypeScript Configuration

- **Strict mode**: Enabled for better type safety
- **JSX**: Uses new React JSX transform (`react-jsx`)
- **Target**: ESNext with modern browser support

### Styling

- **Bootstrap 5.2.3**: Global styles imported in `main.tsx`
- **Component CSS**: Co-located with components (e.g., `BookSearchBar.css`)
- **Material-UI**: Icons only (`@mui/icons-material`)

### Development Features

- **Hot Module Replacement**: Instant updates during development
- **TypeScript**: Full type checking and IntelliSense
- **ES Modules**: Modern JavaScript module system
- **Vite**: Fast build tool with optimized dev server

## Current Implementation

The application currently displays static book data with:

- **Search Bar**: Dropdown for search types (Free Search, Book Title, Author Name)
- **Book Cards**: Display author, year, title, and description
- **Responsive Design**: Bootstrap-based responsive layout

## Future Integration

- **API Connection**: Will connect to `bookend-api` Flask backend
- **State Management**: Redux planned for API state management
- **Testing**: Unit tests and Robot Framework GUI tests (separate repository)
- **Deployment**: Jenkins CI/CD pipeline with Docker containerization

## Troubleshooting

### Common Issues

**Port already in use:**

```bash
# Kill process on port 5173
npx kill-port 5173
# Or use different port
npm run dev -- --port 3000
```

**TypeScript errors:**

```bash
# Check TypeScript configuration
npx tsc --noEmit
```

**Build issues:**

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Development Tips

- Use browser dev tools for debugging React components
- Install React Developer Tools browser extension
- VS Code with TypeScript and React extensions recommended
- ESLint and Prettier configuration can be added for code consistency

## Contributing

1. Follow existing component structure patterns
2. Use TypeScript interfaces for all props
3. Co-locate CSS files with components
4. Maintain Bootstrap + Material-UI styling approach
5. Test locally before committing changes

## License

[Add your license information here]
