# LS - Lista Zakupów (Monorepo)

Aplikacja do zarządzania listami zakupów z backendem (Hono.js) i aplikacją mobilną (React Native/Expo).

## Struktura projektu

```
/
├── apps/
│   ├── backend/           # Backend API (Hono.js + Drizzle ORM + PostgreSQL)
│   └── mobile/            # Aplikacja mobilna (React Native + Expo)
├── packages/
│   └── shared/            # Współdzielone typy TypeScript i walidatory Zod
├── package.json           # Root workspace config
├── pnpm-workspace.yaml    # PNPM workspaces config
├── tsconfig.base.json     # Bazowa konfiguracja TypeScript
└── biome.json             # Globalna konfiguracja BiomeJS
```

## Wymagania

- Node.js 22.16.0
- pnpm 9.15.0
- Docker (dla PostgreSQL)

## Setup

### 1. Instalacja zależności

```bash
pnpm install
```

### 2. Konfiguracja backendu

Utwórz plik `.env` w `apps/backend/` na podstawie `.env.example`:

```bash
cp apps/backend/.env.example apps/backend/.env
```

### 3. Uruchomienie bazy danych

```bash
cd apps/backend
docker compose up -d
```

### 4. Migracje bazy danych

```bash
pnpm db:migrate
pnpm db:seed  # Opcjonalnie - dodanie przykładowych danych
```

## Development

### Uruchomienie backendu

```bash
pnpm dev:backend
```

Backend będzie dostępny pod adresem `http://localhost:3000`

### Uruchomienie aplikacji mobilnej

```bash
pnpm dev:mobile
```

Lub bezpośrednio:

```bash
cd apps/mobile
pnpm start
```

### Uruchomienie wszystkiego jednocześnie

```bash
pnpm dev
```

## Dostępne skrypty

### Root (całe monorepo)

- `pnpm dev` - Uruchomienie backendu i mobile jednocześnie
- `pnpm dev:backend` - Uruchomienie tylko backendu
- `pnpm dev:mobile` - Uruchomienie tylko aplikacji mobilnej
- `pnpm build` - Build wszystkich projektów
- `pnpm build:backend` - Build tylko backendu
- `pnpm lint` - Sprawdzenie i formatowanie kodu (BiomeJS)
- `pnpm db:generate` - Generowanie migracji Drizzle
- `pnpm db:migrate` - Uruchomienie migracji
- `pnpm db:seed` - Seed bazy danych
- `pnpm db:studio` - Uruchomienie Drizzle Studio

### Backend (`apps/backend`)

- `pnpm dev` - Dev server z hot reload
- `pnpm build` - Build do produkcji
- `pnpm start` - Uruchomienie production build
- `pnpm db:*` - Komendy Drizzle

### Mobile (`apps/mobile`)

- `pnpm start` - Uruchomienie Expo dev server
- `pnpm android` - Uruchomienie na Androidzie
- `pnpm ios` - Uruchomienie na iOS
- `pnpm web` - Uruchomienie w przeglądarce

## Zmienne środowiskowe

### Backend (`apps/backend/.env`)

```
DATABASE_URL=postgresql://user:password@localhost:5432/ls
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
PORT=3000
```

### Mobile (`apps/mobile/.env`)

```
EXPO_PUBLIC_API_URL=http://localhost:3000
```

## Architektura

### Shared Package (`@ls/shared`)

Pakiet zawiera współdzielone:
- **Typy TypeScript** - interfejsy dla User, List, ListItem, AuthTokens, itp.
- **Walidatory Zod** - schematy walidacji dla auth, lists, items, shares

Backend i mobile importują z `@ls/shared`:

```typescript
import { loginSchema, type LoginRequest } from "@ls/shared/validators";
import type { User, List } from "@ls/shared/types";
```

### Backend

Stack technologiczny:
- **Hono.js** - Szybki web framework
- **Drizzle ORM** - Type-safe ORM dla PostgreSQL
- **PostgreSQL** - Baza danych
- **JWT** - Autentykacja (access + refresh tokens)
- **Zod** - Walidacja requestów

### Mobile

Stack technologiczny:
- **React Native** - Framework mobilny
- **Expo** - Narzędzia developmentu
- **TanStack Query** - State management i cache
- **Axios** - HTTP client
- **Shared validators** - Walidacja formularzy

API hooks dostępne w `src/api/`:
- `auth.api.ts` - useLogin, useRegister, useLogout, useRefresh
- `lists.api.ts` - useLists, useCreateList, useUpdateList, useDeleteList
- `items.api.ts` - useItems, useCreateItem, useUpdateItem, useDeleteItem
- `shares.api.ts` - useShares, useShareList, useRemoveShare

## TypeScript

Projekt używa wspólnej konfiguracji TypeScript (`tsconfig.base.json`) dziedziczonej przez wszystkie workspaces.

### Path mapping

Backend i mobile mają skonfigurowane ścieżki:

```json
{
  "paths": {
    "@ls/shared/*": ["../../packages/shared/src/*"]
  }
}
```

Mobile dodatkowo:

```json
{
  "paths": {
    "@/*": ["./src/*"]
  }
}
```

## Linting i formatowanie

Projekt używa **BiomeJS** z globalną konfiguracją w `biome.json`:

- **Formatowanie**: tabs, double quotes
- **Linter**: recommended rules
- **VCS**: integracja z Git

```bash
pnpm lint       # Check i autofix
pnpm format     # Tylko formatowanie
```

## Baza danych

### Drizzle Studio

```bash
pnpm db:studio
```

Dostępne pod `https://local.drizzle.studio`

### Migracje

Generowanie nowej migracji po zmianach w schema:

```bash
pnpm db:generate
```

Uruchomienie migracji:

```bash
pnpm db:migrate
```

## API Documentation

Dokumentacja API dostępna w `docs/auth/AUTH_API_DOCS.md`

Główne endpointy:
- `POST /api/auth/register` - Rejestracja
- `POST /api/auth/login` - Logowanie
- `POST /api/auth/refresh` - Odświeżenie tokena
- `POST /api/auth/logout` - Wylogowanie
- `GET /api/auth/me` - Pobranie aktualnego użytkownika
- `GET /api/lists` - Listy użytkownika
- `POST /api/lists` - Utworzenie listy
- `GET /api/lists/:id/items` - Elementy listy
- `POST /api/lists/:id/items` - Dodanie elementu
- `POST /api/lists/:id/shares` - Udostępnienie listy

## Troubleshooting

### Backend nie startuje

1. Sprawdź czy PostgreSQL działa: `docker ps`
2. Sprawdź konfigurację `.env`
3. Uruchom migracje: `pnpm db:migrate`

### Mobile nie łączy się z backendem

1. Sprawdź `EXPO_PUBLIC_API_URL` w `.env`
2. Użyj IP komputera zamiast `localhost` dla fizycznych urządzeń
3. Upewnij się że backend działa na porcie 3000

### TypeScript errors

```bash
# Rebuild wszystkich projektów
pnpm build

# Sprawdź czy shared package się kompiluje
cd packages/shared
pnpm exec tsc --noEmit
```

## License

MIT
