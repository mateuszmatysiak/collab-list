# Aplikacja do współdzielnia list

Aplikacja mobilna do zarządzania wspólnymi listami. Pozwala tworzyć listy, dodawać elementy oraz udostępniać je innym użytkownikom w czasie rzeczywistym.

## Funkcjonalności

- Tworzenie i zarządzanie wieloma listami
- Dodawanie elementów z nazwą, ilością i kategorią
- Udostępnianie list innym użytkownikom
- Synchronizacja zmian między użytkownikami
- Oznaczanie elementów jako kupione
- System kont użytkowników z bezpiecznym logowaniem

## Struktura projektu

Projekt zbudowany jako monorepo składa się z trzech głównych komponentów:

- **Backend API** - serwer zarządzający danymi i autoryzacją
- **Aplikacja mobilna** - interfejs użytkownika na iOS i Android
- **Wspólne komponenty** - współdzielona logika biznesowa i walidacja
