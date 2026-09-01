# TypeScript Fondements - Démonstrateur Pédagogique

Application web interactive Angular servant de support pédagogique pour une introduction aux fondements de TypeScript (Séance 2).

## Fonctionnalités

*   **Architecture 100% Standalone Components** (Angular 22+)
*   **Gestion d'état avec Signals** (`signal`, `computed`)
*   **Nouveau control flow** (`@if`, `@for`, `@switch`)
*   Interface moderne type dashboard/playground avec **Thème Sombre/Clair**.
*   Aucune dépendance backend.

## Installation

1.  Assurez-vous d'avoir Node.js installé (version compatible avec Angular 22).
2.  Installez les dépendances :
    ```bash
    npm install
    ```

## Lancement

Pour lancer le serveur de développement :

```bash
npm start
```
Ou :
```bash
ng serve
```

Naviguez ensuite vers `http://localhost:4200/`. L'application se rechargera automatiquement si vous modifiez un des fichiers sources.

## Structure du Projet (7 Sections)

1.  **Transpilation & Inférence** : Concept de type erasure et inférence.
2.  **Types Primitifs, Unions & Enums** : Narrowing, enums vs unions.
3.  **Opérateurs Modernes & Contrôle** : `===`, `??`, `?.`.
4.  **Fonctions Typées** : Paramètres optionnels/par défaut, arrow functions.
5.  **Collections & Méthodes Fonctionnelles** : Array (`map`, `filter`, `reduce`), Tuples, Set, Map.
6.  **Modélisation d'Objets** : Interfaces, mutabilité, `Record`.
7.  **Exercices Pratiques** : Labo interactif.
