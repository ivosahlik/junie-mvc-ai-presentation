# React Frontend Integration Guide for Spring Boot Beer Management Application

This guide provides detailed, step-by-step instructions for implementing a modern React frontend for the existing Spring Boot Beer Management API. It is designed for Java developers who want to add a responsive, user-friendly interface to their Spring Boot application.

## Project Overview and Architecture

### Backend API Summary

The existing Spring Boot application provides a REST API for managing:

- Beers: CRUD operations with filtering by name and style
- Customers: CRUD operations with search by name
- Beer Orders: Order management with customer associations
- Shipments: Tracking order shipments

The API follows RESTful principles with proper HTTP status codes, validation, and JSON responses. All endpoints are located under `/api/v1/` base path.

### Architecture Overview

The final integrated application will have the following architecture:

```
Spring Boot Application
├── Backend Components
│   ├── Controllers (REST APIs)
│   ├── Services
│   ├── Repositories
│   └── Entity models
├── Frontend Components (React)
│   ├── Components
│   ├── Services (API calls)
│   ├── Hooks (State management)
│   └── Routes
└── Static Resources (bundled frontend)
```

### Project Structure

```
junie-mvc-ai-presentation/
├── src/
│   ├── main/
│   │   ├── java/            # Backend code
│   │   ├── resources/
│   │   │   ├── static/      # Production build output for frontend
│   │   │   └── ...
│   │   └── frontend/        # React source code
│   │       ├── src/
│   │       ├── public/
│   │       ├── package.json
│   │       └── vite.config.ts
│   └── test/                # Backend tests
├── openapi/                 # OpenAPI specifications
├── pom.xml                  # Maven build configuration
└── ...
```

## Part 1: Foundation and Setup

### 1. Setting Up the React Project

Create a new React project using Vite:

```bash
# Navigate to the Spring Boot project root
cd junie-mvc-ai-presentation

# Create the frontend directory
mkdir -p src/main/frontend

# Initialize React project with Vite
cd src/main/frontend
npm create vite@latest . -- --template react-ts
```

### 2. Installing Dependencies

Install all required dependencies:

```bash
# Core dependencies
npm install react@19.1.0 react-dom@19.1.0 react-router-dom@7.6.36 axios@1.10.0

# UI components and styling
npm install @radix-ui/react@3.2.1 clsx@2.1.1 tailwindcss@4.1.10 tailwind-merge@3.3.1 
npm install tw-animate-css@1.3.4 class-variance-authority@0.7.1 lucide-react@0.515.0

# Development dependencies
npm install -D typescript@5.8.3 @types/react@19.1.0 @types/react-dom@19.1.0 @types/node@24.0.1
npm install -D vite@6.3.5 @vitejs/plugin-react@4.5.2 postcss@8.5.5 autoprefixer@10.4.20
npm install -D jest@30.0.0 @types/jest@29.5.14 @testing-library/react@16.3.0 @testing-library/jest-dom@6.6.3
```

### 3. Setting Up Shadcn UI

Initialize Shadcn UI for pre-built component templates:

```bash
npx shadcn-ui@latest init
```

When prompted, select the following options:
- Styling: Tailwind CSS
- Color mode: Dark & Light
- Base color: Slate
- Location: src/components/ui
- TypeScript: Yes
- Import alias: @/

### 4. Configuring Tailwind CSS

Create a Tailwind configuration file:

```bash
npx tailwindcss init -p
```

Update `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tw-animate-css")],
}
```

Add the Tailwind directives to `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

## Part 2: Build Integration and Configuration

### 1. Vite Configuration

Create or update `vite.config.ts` to handle development proxy and production build output:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    proxy: {
      // Proxy API requests to Spring Boot during development
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    // Output to Spring Boot's static resources directory
    outDir: '../resources/static',
    emptyOutDir: true,
    sourcemap: true,
  },
})
```

### 2. Maven Integration with frontend-maven-plugin

Add the following configuration to your `pom.xml` file in the `<build>` section:

```xml
<plugin>
  <groupId>com.github.eirslett</groupId>
  <artifactId>frontend-maven-plugin</artifactId>
  <version>1.15.1</version>
  <configuration>
    <nodeVersion>v22.16.0</nodeVersion>
    <npmVersion>11.4.0</npmVersion>
    <workingDirectory>src/main/frontend</workingDirectory>
    <installDirectory>target</installDirectory>
  </configuration>
  <executions>
    <!-- Install Node and NPM -->
    <execution>
      <id>install-node-npm</id>
      <goals>
        <goal>install-node-and-npm</goal>
      </goals>
      <phase>generate-resources</phase>
    </execution>
    <!-- Install dependencies -->
    <execution>
      <id>npm-install</id>
      <goals>
        <goal>npm</goal>
      </goals>
      <phase>generate-resources</phase>
      <configuration>
        <arguments>install</arguments>
      </configuration>
    </execution>
    <!-- Build frontend -->
    <execution>
      <id>npm-build</id>
      <goals>
        <goal>npm</goal>
      </goals>
      <phase>generate-resources</phase>
      <configuration>
        <arguments>run build</arguments>
      </configuration>
    </execution>
    <!-- Run tests (optional) -->
    <execution>
      <id>npm-test</id>
      <goals>
        <goal>npm</goal>
      </goals>
      <phase>test</phase>
      <configuration>
        <arguments>test</arguments>
        <skip>${skipTests}</skip>
      </configuration>
    </execution>
  </executions>
</plugin>
```

Also update the Maven Clean plugin to clean the frontend build output:

```xml
<plugin>
  <artifactId>maven-clean-plugin</artifactId>
  <configuration>
    <filesets>
      <fileset>
        <directory>src/main/resources/static</directory>
      </fileset>
      <fileset>
        <directory>src/main/frontend/dist</directory>
      </fileset>
      <fileset>
        <directory>src/main/frontend/node_modules</directory>
      </fileset>
    </filesets>
  </configuration>
</plugin>
```

### 3. Configure package.json Scripts

Update your `package.json` file with the following scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "test": "jest",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\"",
    "generate-api-types": "openapi-typescript-codegen --input ../../../openapi/openapi/openapi.yaml --output ./src/api"
  }
}
```

## Part 3: Building the Frontend Application

### 1. Generate TypeScript Types from OpenAPI

Install the OpenAPI TypeScript code generator:

```bash
npm install -D openapi-typescript-codegen
```

Generate the API types:

```bash
npm run generate-api-types
```

### 2. Create API Service Layer

Create a reusable Axios instance for API calls:

```typescript
// src/api/axiosConfig.ts
import axios from 'axios';

// Create Axios instance with common configuration
const apiClient = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a response interceptor for error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    const { response } = error;
    
    // Centralized error handling
    if (response) {
      // Server responded with a status code outside the 2xx range
      console.error('API Error:', response.status, response.data);
    } else if (error.request) {
      // Request was made but no response was received
      console.error('Network Error:', error.message);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
```

### 3. Implement Service Modules for API Entities

Create service modules for each API entity:

```typescript
// src/api/services/beerService.ts
import apiClient from '../axiosConfig';
import { BeerDto } from '../models';

export const beerService = {
  // Get a paginated list of beers
  getBeers: async (page = 0, size = 10, beerName?: string, beerStyle?: string) => {
    const params = { page, size, beerName, beerStyle };
    const response = await apiClient.get('/beers', { params });
    return response.data;
  },
  
  // Get a single beer by ID
  getBeerById: async (id: number) => {
    const response = await apiClient.get(`/beers/${id}`);
    return response.data;
  },
  
  // Create a new beer
  createBeer: async (beer: Omit<BeerDto, 'id'>) => {
    const response = await apiClient.post('/beers', beer);
    return response.data;
  },
  
  // Update a beer
  updateBeer: async (id: number, beer: BeerDto) => {
    const response = await apiClient.put(`/beers/${id}`, beer);
    return response.data;
  },
  
  // Patch a beer (partial update)
  patchBeer: async (id: number, beer: Partial<BeerDto>) => {
    const response = await apiClient.patch(`/beers/${id}`, beer);
    return response.data;
  },
  
  // Delete a beer
  deleteBeer: async (id: number) => {
    return apiClient.delete(`/beers/${id}`);
  }
};
```

Create similar service modules for customers, beer orders, and shipments.

### 4. Implement Custom React Hooks

Create custom React hooks to manage state and API interactions:

```typescript
// src/hooks/useBeers.ts
import { useState, useEffect, useCallback } from 'react';
import { beerService } from '../api/services/beerService';
import { BeerDto } from '../api/models';

export function useBeers(initialPage = 0, initialSize = 10) {
  const [beers, setBeers] = useState<BeerDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialSize);
  const [filters, setFilters] = useState({
    beerName: '',
    beerStyle: '',
  });

  const fetchBeers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await beerService.getBeers(
        currentPage,
        pageSize,
        filters.beerName || undefined,
        filters.beerStyle || undefined
      );
      setBeers(result.content);
      setTotalPages(result.totalPages);
    } catch (err) {
      setError('Failed to fetch beers. Please try again later.');
      console.error('Error fetching beers:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, filters]);

  useEffect(() => {
    fetchBeers();
  }, [fetchBeers]);

  const updateFilters = useCallback((newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(0); // Reset to first page when filters change
  }, []);

  return {
    beers,
    loading,
    error,
    totalPages,
    currentPage,
    pageSize,
    filters,
    setCurrentPage,
    setPageSize,
    updateFilters,
    refresh: fetchBeers,
  };
}
```

### 5. Create React Components

#### App Component and Router Setup

```jsx
// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { BeerList } from './pages/BeerList';
import { BeerDetail } from './pages/BeerDetail';
import { CreateBeer } from './pages/CreateBeer';
import { EditBeer } from './pages/EditBeer';
import { CustomerList } from './pages/CustomerList';
import { CustomerDetail } from './pages/CustomerDetail';
import { OrderList } from './pages/OrderList';
import { OrderDetail } from './pages/OrderDetail';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<BeerList />} />
          <Route path="/beers" element={<BeerList />} />
          <Route path="/beers/:id" element={<BeerDetail />} />
          <Route path="/beers/create" element={<CreateBeer />} />
          <Route path="/beers/:id/edit" element={<EditBeer />} />
          <Route path="/customers" element={<CustomerList />} />
          <Route path="/customers/:id" element={<CustomerDetail />} />
          <Route path="/orders" element={<OrderList />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
```

#### Layout Component

```jsx
// src/components/Layout.tsx
import React from 'react';
import { Link } from 'react-router-dom';

export function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-primary-foreground py-4 shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">Beer Management System</h1>
          <nav className="mt-2">
            <ul className="flex space-x-4">
              <li><Link to="/beers" className="hover:underline">Beers</Link></li>
              <li><Link to="/customers" className="hover:underline">Customers</Link></li>
              <li><Link to="/orders" className="hover:underline">Orders</Link></li>
            </ul>
          </nav>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        {children}
      </main>
      
      <footer className="bg-muted py-4">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          Beer Management System &copy; 2025
        </div>
      </footer>
    </div>
  );
}
```

#### Beer List Component

```jsx
// src/pages/BeerList.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBeers } from '../hooks/useBeers';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Pagination } from '../components/Pagination';

export function BeerList() {
  const [nameFilter, setNameFilter] = useState('');
  const [styleFilter, setStyleFilter] = useState('');
  const { 
    beers, 
    loading, 
    error, 
    totalPages, 
    currentPage, 
    setCurrentPage,
    updateFilters 
  } = useBeers();

  const handleSearch = () => {
    updateFilters({
      beerName: nameFilter,
      beerStyle: styleFilter
    });
  };

  const handleReset = () => {
    setNameFilter('');
    setStyleFilter('');
    updateFilters({
      beerName: '',
      beerStyle: ''
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Beer List</h2>
        <Link to="/beers/create">
          <Button>Create New Beer</Button>
        </Link>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filter Beers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium mb-1">Beer Name</label>
              <Input
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                placeholder="Search by name..."
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium mb-1">Beer Style</label>
              <Input
                value={styleFilter}
                onChange={(e) => setStyleFilter(e.target.value)}
                placeholder="Search by style..."
              />
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={handleSearch}>Search</Button>
              <Button variant="outline" onClick={handleReset}>Reset</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {loading ? (
        <div className="text-center py-12">Loading beers...</div>
      ) : error ? (
        <div className="text-center py-12 text-destructive">{error}</div>
      ) : (
        <>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Style</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {beers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        No beers found. Try adjusting your filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    beers.map((beer) => (
                      <TableRow key={beer.id}>
                        <TableCell>{beer.beerName}</TableCell>
                        <TableCell>{beer.beerStyle}</TableCell>
                        <TableCell>${beer.price?.toFixed(2)}</TableCell>
                        <TableCell>{beer.quantityOnHand}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Link to={`/beers/${beer.id}`}>
                              <Button variant="outline" size="sm">View</Button>
                            </Link>
                            <Link to={`/beers/${beer.id}/edit`}>
                              <Button variant="outline" size="sm">Edit</Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
```

#### Pagination Component

```jsx
// src/components/Pagination.tsx
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i);
  
  // Logic to show limited page buttons with ellipsis for large page counts
  const getVisiblePages = () => {
    if (totalPages <= 7) return pages;
    
    if (currentPage < 3) {
      return [...pages.slice(0, 5), -1, totalPages - 1];
    }
    
    if (currentPage > totalPages - 4) {
      return [0, -1, ...pages.slice(totalPages - 5)];
    }
    
    return [0, -1, ...pages.slice(currentPage - 1, currentPage + 2), -1, totalPages - 1];
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(Math.max(0, currentPage - 1))}
        disabled={currentPage === 0}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      {getVisiblePages().map((pageIndex, i) => 
        pageIndex === -1 ? (
          <div key={`ellipsis-${i}`} className="px-3 py-1">...</div>
        ) : (
          <Button
            key={pageIndex}
            variant={pageIndex === currentPage ? "default" : "outline"}
            className="h-9 w-9"
            onClick={() => onPageChange(pageIndex)}
          >
            {pageIndex + 1}
          </Button>
        )
      )}
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
        disabled={currentPage === totalPages - 1}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
```

Create similar components for all the other pages: BeerDetail, CreateBeer, EditBeer, CustomerList, etc.

## Part 4: Testing and Deployment

### 1. Setting Up Jest for Testing

Create a `jest.config.js` file:

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
    }],
  },
};
```

Create a `setupTests.ts` file:

```typescript
// src/setupTests.ts
import '@testing-library/jest-dom';
```

### 2. Sample Component Test

```jsx
// src/components/__tests__/BeerList.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { BeerList } from '../../pages/BeerList';
import { useBeers } from '../../hooks/useBeers';

// Mock the custom hook
jest.mock('../../hooks/useBeers');

describe('BeerList Component', () => {
  beforeEach(() => {
    // Setup mock return value
    useBeers.mockReturnValue({
      beers: [
        {
          id: 1,
          beerName: 'Test Beer',
          beerStyle: 'IPA',
          price: 5.99,
          quantityOnHand: 50,
          upc: '123456',
        },
      ],
      loading: false,
      error: null,
      totalPages: 1,
      currentPage: 0,
      pageSize: 10,
      filters: { beerName: '', beerStyle: '' },
      setCurrentPage: jest.fn(),
      setPageSize: jest.fn(),
      updateFilters: jest.fn(),
      refresh: jest.fn(),
    });
  });

  test('renders beer list correctly', async () => {
    render(
      <BrowserRouter>
        <BeerList />
      </BrowserRouter>
    );

    expect(screen.getByText('Beer List')).toBeInTheDocument();
    expect(screen.getByText('Test Beer')).toBeInTheDocument();
    expect(screen.getByText('IPA')).toBeInTheDocument();
    expect(screen.getByText('$5.99')).toBeInTheDocument();
  });

  test('handles search functionality', async () => {
    const mockUpdateFilters = jest.fn();
    useBeers.mockReturnValue({
      beers: [],
      loading: false,
      error: null,
      totalPages: 0,
      currentPage: 0,
      pageSize: 10,
      filters: { beerName: '', beerStyle: '' },
      setCurrentPage: jest.fn(),
      setPageSize: jest.fn(),
      updateFilters: mockUpdateFilters,
      refresh: jest.fn(),
    });

    render(
      <BrowserRouter>
        <BeerList />
      </BrowserRouter>
    );

    // Get the name input and type a search term
    const nameInput = screen.getByPlaceholderText('Search by name...');
    fireEvent.change(nameInput, { target: { value: 'IPA' } });

    // Click the search button
    const searchButton = screen.getByText('Search');
    fireEvent.click(searchButton);

    // Check that the filter update was called with the correct value
    expect(mockUpdateFilters).toHaveBeenCalledWith({
      beerName: 'IPA',
      beerStyle: '',
    });
  });
});
```

### 3. Running the Development Environment

To run the application in development mode:

1. Start the Spring Boot application:
   ```bash
   # From the project root directory
   ./mvnw spring-boot:run
   ```

2. In a separate terminal, start the React development server:
   ```bash
   # Navigate to frontend directory
   cd src/main/frontend
   
   # Start Vite dev server
   npm run dev
   ```

The React app will be available at `http://localhost:5173` and will proxy API calls to the Spring Boot server running at `http://localhost:8080`.

### 4. Building for Production

To build the entire application including frontend:

```bash
# From the project root directory
./mvnw clean package
```

This will:
1. Clean the project
2. Install Node.js and npm if needed
3. Install frontend dependencies
4. Build the React application
5. Copy the build output to `src/main/resources/static`
6. Package everything into a single executable JAR

Run the packaged application:

```bash
java -jar target/junie-mvc-ai-presentation-0.0.1-SNAPSHOT.jar
```

The application will be available at `http://localhost:8080` with both backend and frontend served from the same origin.

## Updated Guidelines for Project

Add these guidelines to your `.junie/guidelines.md` file:

```markdown
## Frontend Development Guidelines

### Project Structure
The project now includes a React frontend located in `src/main/frontend`. The frontend is built using:
- React 19.x with TypeScript
- Vite for bundling
- Tailwind CSS for styling
- Shadcn UI for component library
- React Router for navigation
- Axios for API calls
- Jest for testing

### Commands

#### Development
- Start Spring Boot backend: `./mvnw spring-boot:run`
- Start React dev server: `cd src/main/frontend && npm run dev`
- Run frontend tests: `cd src/main/frontend && npm test`
- Format frontend code: `cd src/main/frontend && npm run format`
- Lint frontend code: `cd src/main/frontend && npm run lint`
- Generate API types from OpenAPI: `cd src/main/frontend && npm run generate-api-types`

#### Production Build
- Build entire application: `./mvnw clean package`
- Run built application: `java -jar target/junie-mvc-ai-presentation-0.0.1-SNAPSHOT.jar`

### Development Workflow
1. Make backend changes following existing Spring Boot guidelines
2. When API contracts change, regenerate frontend types: `cd src/main/frontend && npm run generate-api-types`
3. Develop frontend features using the Vite dev server for hot-reloading
4. Write tests for both backend and frontend components
5. Build the complete application with Maven for deployment
```

## Conclusion

This guide has provided a comprehensive approach to integrate a modern React frontend with your existing Spring Boot application. By following these steps, you've:

1. Set up a React application with TypeScript and modern tooling
2. Configured the build pipeline to integrate with Maven
3. Created type-safe API integrations using OpenAPI codegen
4. Implemented reusable components and hooks for state management
5. Added tests and deployment procedures

The frontend now provides a responsive, user-friendly interface to your Beer Management System, with proper separation of concerns and maintainable code structure. The application can be built as a single deployable unit using Maven, making it easy to deploy to any environment that supports Java.
