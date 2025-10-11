# Beer Service Frontend

This is the React frontend for the Spring Boot Beer Service application. It provides a user interface for managing beers, beer orders, and customers.

## Technology Stack

- **React v19.1.0** - UI library
- **TypeScript 5.8.3** - Typed superset of JavaScript
- **Vite 6.3.5** - Build tool and development server
- **Shadcn 2.6.3** - Reusable components built on Radix UI
- **Tailwind CSS 4.1.10** - Utility-first CSS framework
- **Axios 1.10.0** - Promise-based HTTP client

## Development Workflow

### Prerequisites

- Node.js v22.16.0 or higher
- npm 11.4.0 or higher

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev

# Start both frontend and backend concurrently
npm run dev:concurrent

# Generate API client from OpenAPI spec
npm run generate-api

# Watch for changes in OpenAPI spec and regenerate API client
npm run watch-api
```

### Building

```bash
# Build for development
npm run build

# Build for production
npm run build:prod

# Preview the build
npm run preview
```

### Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Cleaning

```bash
# Clean build artifacts and node_modules
npm run clean
```

## Project Structure

```
src/
├── api/            # Generated API client from OpenAPI spec
├── assets/         # Static assets like images, fonts, etc.
├── components/     # Reusable UI components
│   ├── dialogs/    # Dialog components
│   ├── forms/      # Form components
│   ├── navigation/ # Navigation components
│   ├── tables/     # Table components
│   └── ui/         # Base UI components from Shadcn
├── hooks/          # Custom React hooks
├── layouts/        # Layout components
├── lib/            # Utility libraries
├── pages/          # Page components
├── services/       # API service modules
├── styles/         # Global styles
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

## Maven Integration

The frontend build is integrated with Maven using the frontend-maven-plugin. This allows the frontend to be built as part of the Maven build process.

To build the entire application (backend and frontend) using Maven:

```bash
./mvnw clean package
```

This will:
1. Clean the project
2. Install Node.js and npm
3. Install frontend dependencies
4. Build the frontend
5. Package the application with the frontend assets included

## Environment Variables

The application uses environment variables for configuration. These are defined in the following files:

- `.env` - Default environment variables
- `.env.development` - Development environment variables
- `.env.test` - Test environment variables
- `.env.production` - Production environment variables

## API Integration

The frontend integrates with the backend API using generated TypeScript clients from the OpenAPI specification. The API client is automatically generated during the build process.
