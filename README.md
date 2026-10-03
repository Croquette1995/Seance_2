# Séance 10 — Gestion des Exceptions & Robustesse en POO (Angular & TypeScript)

Application web interactive servant de **support de cours vivant** et de **banc d'entraînement** pour le cours : **Séance 10 — Gestion des Exceptions & Robustesse en POO** (formation EAFC en informatique de gestion / programmation orientée objet).

L'application guide les étudiants depuis les réflexes procéduraux fragiles (codes sentinelles `-1`, `null`, `false`, `catch (error: any)`, catch silencieux) vers les meilleures pratiques de génie logiciel en POO moderne :
- **Inviolabilité des invariants d'objets** et rejet immédiat des états corrompus.
- **Visualisation animée pas-à-pas du déroulement de la pile d'appels (*Stack Unwinding*)**.
- **Nettoyage déterministe de ressources avec `try / catch / finally`**.
- **Typage strict et défensif avec `unknown` et *Type Narrowing*** (zéro `any`).
- **Création d'une taxonomie d'exceptions métier hiérarchisée (`extends Error`)**.
- **Filtrage polymorphique précis avec `instanceof` et relance (*rethrow*)**.
- **Stratégie d'enveloppement d'exceptions (*Error Wrapping* & `Error.cause`)** à travers une architecture multicouche (API / Service / UI).
- **Simulateur de Distributeur Automatique de Billets (DAB / ATM)** réactif avec Angular Signals.
- **Laboratoire complet de 26 micro-exercices** avec éditeur Monaco intégré, terminal virtuel et moteur d'évaluation automatisé multi-critères.

---

## 🚀 Démarrage Rapide

### Prérequis
- **Node.js** >= 18.x ou 20.x
- **npm** >= 9.x

### Installation et Lancement

```bash
# Se placer dans le répertoire du projet
cd "/home/cchiodo/EAFC/POO/Séance 10/angular-seance10"

# Lancer le serveur de développement Angular
npm start
# ou
ng serve --open
```

L'application sera accessible sur `http://localhost:4200/`.

### Validation et Tests Automatisés

Le banc de test vérifie automatiquement les **26 micro-exercices** selon 3 axes :
1. Présence et intégrité des 26 exercices sur les 6 ateliers pratiques.
2. Détection de faux positifs (aucun exercice ne doit être validé avec son code initial).
3. Validation à 100% de tous les critères avec la solution officielle.

```bash
# Lancer les tests unitaires
npm test
# ou avec Vitest
./node_modules/vitest/vitest.mjs run src/app/core/services/exercise-solutions.spec.ts
```

### Compilation de Production

```bash
npm run build
```

Les bundles optimisés sont générés dans `dist/angular-seance10-exceptions-robustesse-poo`.

---

## 🏛 Architecture & Technologies

- **Framework** : Angular 22 (Standalone Components, Signals réactifs, Control Flow `@if`, `@for`).
- **Éditeur de Code** : Monaco Editor (moteur de VS Code) chargé localement avec colorisation TypeScript, autocomplétion, minimap et suggestions.
- **Transpileur Sandboxé** : Transpilateur TypeScript-vers-JavaScript in-memory sans serveur avec analyseur d'accolades équilibrées et capture du `console.log`.
- **Système de Feedback** : Particules de confettis en Canvas natif (zéro dépendance externe) lors de la validation des ateliers.
- **Thème** : Support dynamique Dark Mode / Light Mode avec persistance `localStorage`.
- **Banc de Test** : Vitest avec vérification automatisée de conformité.

---

## 📚 Les 8 Modules Pédagogiques Interactifs

1. **Codes Sentinelles vs Exceptions & Invariants d'Objets** :
   - Comparateur interactif côte-à-côte avec compte bancaire sous surveillance.
   - Démonstration de corruption d'invariant avec `-1` et protection absolue par exception.

2. **Dépilement de la Pile d'Appels (*Stack Unwinding*)** :
   - Visualisateur dynamique de la pile d'appels (UI -> Service -> Repository -> Base de données).
   - Animation du retournement de trame et propagation de l'erreur jusqu'au gestionnaire compétent.

3. **Le Triptyque `try / catch / finally` & Libération Garantie** :
   - Cycle de vie d'une ressource (connexion réseau / descripteur de fichier).
   - Garantie absolue d'exécution du bloc `finally`, même en cas de `throw` ou de `return` prématuré.

4. **L'Objet `Error` & Typage Strict (`unknown` vs `any`)** :
   - Anatomie de `Error` (`name`, `message`, `stack`, `cause`).
   - Pourquoi TypeScript 4.0+ type les exceptions capturées en `unknown`.
   - Utilisation de fonctions de garde (*Type Guards*) pour sécuriser l'accès aux propriétés.

5. **Exceptions Domaine Personnalisées (`extends Error`)** :
   - Construction d'une hiérarchie objet : `AppError` -> `BanqueError` -> `SoldeInsuffisantError`.
   - Préservation de la chaîne de prototypes avec `Object.setPrototypeOf`.
   - Attributs métier contextuels riches (`montantManquant`, `soldeActuel`).

6. **Filtrage d'Exceptions, `instanceof` & Relance (*Rethrow*)** :
   - Ordre crucial des clauses `if (err instanceof ...)` : de l'enfant le plus spécifique vers le parent le plus général.
   - Danger de l'anti-pattern *Catch-and-Swallow* et importance de relancer (`throw err`) les exceptions inconnues.

7. **Stratégies d'Architecture & Enveloppement (*Error Wrapping*)** :
   - Découplage des couches : Couche d'infrastructure (HTTP / SQL) traduite en erreurs métier du Domaine.
   - Rétention du diagnostic profond grâce à `{ cause: originalError }`.

8. **Simulateur Distributeur Automatique de Billets (DAB / ATM)** :
   - Simulation bancaire complète et réactive avec clavier numérique, insertion de carte, retrait et consultation.
   - Gestion polymorphique d'erreurs réelles : `CarteBloqueeError`, `CodePinInvalideError`, `SoldeInsuffisantError`, `PlafondDepasseError`, `DistributeurVideError`.

---

## 🛠 Les 6 Ateliers Pratiques (26 Micro-Exercices)

L'onglet **Ateliers Pratiques** regroupe les 26 micro-exercices classés par palier d'apprentissage :

| Laboratoire | Nombre d'exercices | Notions Clés |
|---|---|---|
| **Lab 1 : Sentinelles vs Invariants** | 4 exercices | Invariant `solde >= 0`, `throw new Error`, interdiction des codes sentinelles, transition procédural -> POO |
| **Lab 2 : Stack Unwinding & Propagation** | 4 exercices | Traversée de pile, propagation naturelle sans catch intermédiaire, capture centralisée |
| **Lab 3 : Nettoyage avec `finally`** | 5 exercices | `try/catch/finally`, fermeture de flux, gestion des erreurs dans le finally, retour prioritaire |
| **Lab 4 : Typage Strict `unknown` & Narrowing** | 4 exercices | `catch (err: unknown)`, fonction de garde `isError(err)`, extraction sécurisée du message |
| **Lab 5 : Taxonomie d'Exceptions Métier** | 4 exercices | `abstract class AppError`, constructeurs enrichis, `setPrototypeOf`, `instanceof` |
| **Lab 6 : Error Wrapping & Architecture ATM** | 5 exercices | `Error.cause`, conversion HTTP 409, relance défensive, contrôleur DAB complet |

Chaque exercice dispose de :
- Une consigne claire avec conseils pédagogiques et indices progressifs.
- Un code de départ contenant des points d'ancrage `// TODO`.
- Une vérification syntaxique en temps réel (expressions régulières ciblées).
- Des tests unitaires sandboxés évaluant le comportement réel du code exécuté.
- Une solution commentée avec explication détaillée du rationnel de génie logiciel.
- Un bouton de réinitialisation vers le code de départ.

---

## 👥 Public Cible & Pédagogie

Ce cours s'adresse aux étudiants en informatique ayant déjà suivi les séances 5 à 9 (Classes, Héritage, Polymorphisme, Interfaces, Injection de Dépendances). Il a été conçu pour éliminer définitivement les pratiques fragiles et ancrer des réflexes de programmation défensive et robuste indispensables en entreprise.
