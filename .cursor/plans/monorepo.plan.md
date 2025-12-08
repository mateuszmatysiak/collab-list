# PNPM Monorepo Migration Plan

## 1. Monorepo Structure

Creating a PNPM workspaces structure with three packages:

```
/
├── apps/
│   ├── backend/           # Current backend code
│   └── mobile/            # New React Native (Expo) application
├── packages/
│   └── shared/            # TS types + Zod validators
├── package.json           # Root workspace config
├── pnpm-workspace.yaml    # PNPM workspaces config
├── tsconfig.base.json     # Base TypeScript configuration
├── biome.json             # Global BiomeJS configuration
└── .gitignore             # Updated
```

## 2. Root Workspace Configuration

Creating `package.json` in root with:

- Workspace definitions
- Scripts for the entire monorepo (dev, build, lint)
- Common devDependencies (TypeScript, Biome) - **globally for all workspaces**

Creating `pnpm-workspace.yaml`:

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

Root `package.json` devDependencies (inherited by workspaces):

```json
{
  "devDependencies": {
    "@biomejs/biome": "2.3.8",
    "typescript": "5.9.3"
  }
}
```

**Global BiomeJS Configuration**:

- `biome.json` remains in the project root
- **Workspaces do NOT have their own `biome.json`** - everyone uses the global configuration
- BiomeJS automatically applies root configuration to all files in workspaces
- Common formatting rules (tabs, double quotes) for the entire monorepo

**Base TypeScript Configuration**:

- `tsconfig.base.json` in root with common settings (target, module, strict, paths)
- Workspaces have their own `tsconfig.json` extending the base via `"extends": "../../tsconfig.base.json"`
- Each workspace can override specific options (outDir, rootDir, include)

**Workspaces do NOT contain BiomeJS or TypeScript in their package.json** - they inherit from root.

## 3. Backend Migration to apps/backend

Moving the entire current project to `apps/backend/`:

- Source code from `src/`
- Configurations: `tsconfig.json`, `drizzle.config.ts` (NOT `biome.json` - stays in root)
- `docker-compose.yml`
- `package.json` with name `@ls/backend`

Updating `apps/backend/package.json`:

- Change name to `@ls/backend`
- Add dependency on `@ls/shared`
- Keep all scripts (dev, build, db:*)
- **NO** BiomeJS and TypeScript in dependencies

## 4. Shared Package (@ls/shared)

Creating `packages/shared/` with:

**package.json**:

```json
{
  "name": "@ls/shared",
  "version": "1.0.0",
  "type": "module",
  "main": "./src/index.ts",
  "exports": {
    "./types": "./src/types/index.ts",
    "./validators": "./src/validators/index.ts"
  }
}
```

**Contents**:

- `src/types/index.ts` - export types from backend (User, List, ListItem, Auth DTOs)
- `src/validators/index.ts` - export Zod validators from backend
- `tsconfig.json` - configuration for the library

Moving from backend:

- `src/validators/auth.validator.ts`
- `src/validators/lists.validator.ts`
- `src/validators/items.validator.ts`
- `src/validators/shares.validator.ts`
- Types from `src/types/index.ts`

Backend will import from `@ls/shared` instead of local files.

## 5. Mobile Application (apps/mobile)

Expo initialization:

```bash
cd apps
npx create-expo-app@latest mobile --template blank-typescript
```

**package.json Configuration**:

```json
{
  "name": "@ls/mobile",
  "dependencies": {
    "@ls/shared": "workspace:*",
    "axios": "1.13.2",
    "@tanstack/react-query": "5.90.12",
    "expo": "54.0.25",
    "react-native": "0.82.1"
  }
}
```

**apps/mobile/src/ Structure**:

```
src/
├── api/                   # Axios + TanStack Query
│   ├── client.ts          # Axios instance + baseURL
│   ├── auth.api.ts        # useLogin, useRegister, useRefresh
│   ├── lists.api.ts       # useLists, useCreateList, useUpdateList
│   ├── items.api.ts       # useItems, useCreateItem, useToggleItem
│   └── shares.api.ts      # useShares, useShareList
├── components/
├── screens/
├── navigation/
└── App.tsx
```

**API Client Setup**:

`src/api/client.ts`:

```typescript
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

// Interceptor for JWT token
apiClient.interceptors.request.use((config) => {
  // Adding Authorization header
  return config;
});
```

`src/api/auth.api.ts`:

```typescript
import { useMutation } from '@tanstack/react-query';
import { apiClient } from './client';
import type { LoginRequest, RegisterRequest } from '@ls/shared/validators';

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginRequest) => 
      apiClient.post('/api/auth/login', data)
  });
};
```

**TanStack Query Setup**:

In `App.tsx`:

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 2, staleTime: 5 * 60 * 1000 }
  }
});
```

**Environment Variables**:

`.env.example`:

```
EXPO_PUBLIC_API_URL=http://localhost:3000
```

## 6. Types and Validators Integration

Backend exports from `@ls/shared`:

- All Request/Response types from API
- Zod validators (reused in mobile for form validation)

Mobile imports:

```typescript
import { loginSchema, type LoginRequest } from '@ls/shared/validators';
import { useLogin } from '@/api/auth.api';
```

## 7. Root package.json Scripts

```json
{
  "scripts": {
    "dev": "pnpm --parallel --filter @ls/backend --filter @ls/mobile dev",
    "dev:backend": "pnpm --filter @ls/backend dev",
    "dev:mobile": "pnpm --filter @ls/mobile start",
    "build": "pnpm --recursive run build",
    "build:backend": "pnpm --filter @ls/backend build",
    "lint": "biome check --write .",
    "db:generate": "pnpm --filter @ls/backend db:generate",
    "db:migrate": "pnpm --filter @ls/backend db:migrate",
    "db:seed": "pnpm --filter @ls/backend db:seed",
    "db:studio": "pnpm --filter @ls/backend db:studio"
  }
}
```

The `biome check --write .` command run in root will automatically process all workspaces.

## 8. .gitignore Update

Adding:

```
node_modules/
dist/
.env
.env.local

# Backend specific
apps/backend/dist/

# Mobile specific
apps/mobile/.expo/
apps/mobile/dist/
apps/mobile/node_modules/
apps/mobile/ios/
apps/mobile/android/
```

## 9. Documentation

Creating `README.md` in root:

- Monorepo structure
- Setup instructions (pnpm install)
- Dev workflow (running backend + mobile)
- Environment variables

Updating `docs/PLAN.md` with information about the new structure.

## Implementation Details

### Shared Validators Export

In `packages/shared/src/validators/index.ts`:

```typescript
export * from './auth.validator';
export * from './lists.validator';
export * from './items.validator';
export * from './shares.validator';
```

### Axios Interceptors

Implementing refresh token flow in `apps/mobile/src/api/client.ts`:

- Interceptor for 401 errors
- Automatic token refresh from `/api/auth/refresh`
- Retry failed request with new token

### TanStack Query Keys

Query keys structure in mobile:

```typescript
export const queryKeys = {
  auth: ['auth'] as const,
  lists: {
    all: ['lists'] as const,
    detail: (id: string) => ['lists', id] as const,
    items: (listId: string) => ['lists', listId, 'items'] as const
  }
};
```

### TypeScript Paths

Backend `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@ls/shared/*": ["../../packages/shared/src/*"]
    }
  }
}
```

Mobile `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@ls/shared/*": ["../../packages/shared/src/*"]
    }
  }
}
```

## Execution Order

1. Creating folder structure + root configs (biome.json stays in root)
2. Shared package - types and validators
3. Backend migration to apps/backend (without biome.json)
4. Updating imports in backend (@ls/shared)
5. Expo mobile app initialization
6. Axios + TanStack Query setup
7. API hooks implementation
8. Testing backend ↔ mobile communication
9. Documentation + cleanup