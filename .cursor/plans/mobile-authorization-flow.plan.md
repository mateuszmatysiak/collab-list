# Implementation plan for login/registration UI and authorization flow

## 1. Installation and configuration of dependencies

### Dependencies to install:

- `expo-router` - file-based routing
- `expo-secure-store` - secure token storage
- `react-native-safe-area-context` - SafeAreaView
- `react-hook-form` + `@hookform/resolvers` (zod resolver) - form management
- `@react-native-reusables/cli` - CLI for adding components
- `nativewind` + `tailwindcss` - styling (required by React Native Reusables)

### Configuration:

- Setup NativeWind in `tailwind.config.js` and `global.css`
- Configure expo-router in `app.json` (scheme, plugins)
- Setup `tsconfig.json` paths for `@/` alias

## 2. Directory structure

```
apps/mobile/
├── app/
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (tabs)/
│   │   └── index.tsx (placeholder - main screen after login)
│   ├── _layout.tsx (root layout with SafeAreaProvider)
│   └── index.tsx (redirect logic - checks auth state)
├── src/
│   ├── api/ (already exists)
│   ├── components/
│   │   └── ui/ (React Native Reusables components)
│   ├── contexts/
│   │   └── auth.context.tsx
│   ├── lib/
│   │   ├── storage.ts (expo-secure-store wrapper)
│   │   └── auth.ts (auth utilities)
│   └── hooks/
│       └── use-auth.ts
```

## 3. Storage service (`src/lib/storage.ts`)

Token management functions:

- `getAccessToken()` - get access token
- `getRefreshToken()` - get refresh token
- `setTokens(accessToken, refreshToken)` - save both tokens
- `clearTokens()` - remove tokens (logout)
- `getStoredTokens()` - get both tokens at once

Uses `expo-secure-store` with keys: `'accessToken'` and `'refreshToken'`.

## 4. API client update (`src/api/client.ts`)

### Request interceptor:

- Retrieves access token from storage
- Adds `Authorization: Bearer <token>` to headers

### Response interceptor:

- Handles 401 (unauthorized)
- Automatically refreshes token using refresh token
- Retries original request with new access token
- On failed refresh - clears tokens and redirects to login

Uses functions from `src/lib/storage.ts` and `useRefresh` hook from `auth.api.ts`.

## 5. Auth Context (`src/contexts/auth.context.tsx`)

Context provider with:

- `user: User | null` - logged in user data
- `isLoading: boolean` - loading state (checking tokens on startup)
- `isAuthenticated: boolean` - computed from `user !== null`
- `login(email, password)` - login function
- `register(name, email, password)` - registration function
- `logout()` - logout function
- `checkAuth()` - checks if user is logged in (uses `/api/auth/me`)

Uses:

- `useLogin`, `useRegister`, `useLogout`, `useMe` from `auth.api.ts`
- `storage.ts` for saving/clearing tokens
- Checks tokens on app startup

## 6. React Native Reusables setup

Adding components via CLI:

- `Button`
- `Input`
- `Label`
- `Text` (typography variants)
- `Card` (optionally, for layout)

Configuration in `components/ui/` with NativeWind styling.

## 7. Login screen (`app/(auth)/login.tsx`)

### UI:

- Form with fields: email, password
- "Log in" button
- Link to registration ("Don't have an account? Sign up")
- SafeAreaView wrapper
- Loading state during login
- Error handling (displaying API errors)

### Functionality:

- Validation via `react-hook-form` + zod (`loginSchema` from `@ls/shared/validators`)
- Calls `login()` from AuthContext
- On success: redirect to `/(tabs)` (or main screen)
- Error messages from backend (e.g. "Invalid email or password")

## 8. Registration screen (`app/(auth)/register.tsx`)

### UI:

- Form with fields: name, email, password
- "Sign up" button
- Link to login ("Already have an account? Log in")
- SafeAreaView wrapper
- Loading state
- Error handling

### Functionality:

- Validation via `react-hook-form` + zod (`registerSchema`)
- Calls `register()` from AuthContext
- On success: redirect to `/(tabs)`
- Error messages (e.g. "Email already exists" - 409)

## 9. Root layout (`app/_layout.tsx`)

- `SafeAreaProvider` wrapper
- `AuthProvider` (AuthContext)
- `QueryClientProvider` (already exists in `App.tsx`, move here)
- `Slot` from expo-router for routing

## 10. Index redirect (`app/index.tsx`)

Redirect logic:

- Checks `isAuthenticated` from AuthContext
- If `true` → redirect to `/(tabs)`
- If `false` → redirect to `/(auth)/login`
- During `isLoading` → displays loading screen

## 11. Main screen placeholder (`app/(tabs)/index.tsx`)

Temporary screen after login:

- Displays user data
- "Log out" button (calls `logout()` from AuthContext)
- On logout redirects to login

## 12. `App.tsx` update

- Remove `QueryClientProvider` (moved to `_layout.tsx`)
- Leave only minimal wrapper or remove if expo-router takes control

## 13. Error handling

- Global error handling in AuthContext
- Displaying validation errors in forms
- Network error handling
- Toast/Alert for errors (optionally, can use React Native Reusables Toast)

## 14. TypeScript types

- Types for User (from backend response)
- Types for AuthContext
- Export from `@ls/shared/types` if needed

## Implementation notes

- All components use React Native Reusables according to guidelines
- SafeAreaView for all screens
- Client-side validation (zod) + backend validation
- Tokens stored securely in expo-secure-store
- Automatic token refresh via interceptor
- Loading states during async operations
- Error messages in Polish (according to backend)
- Use latest package versions with strict mode