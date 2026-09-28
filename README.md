# TypeScript POO Studio — Séance 8 : Classes Abstraites & Interfaces

> **Cours de Programmation Orientée Objet** — Bachelier en Informatique (EAFC Colfontaine).  
> **Thème :** Contrats purs, typage structurel (*Duck Typing*), effacement de type (*Type Erasure*) et architecture découplée (OCP).

---

## 🎯 Objectif Pédagogique

Cette application web interactive a été conçue pour aider les étudiants qui maîtrisent l'encapsulation et l'héritage simple, mais qui :
1. Peinent à modéliser des abstractions strictes sans code mort.
2. Confondent souvent `interface` et `abstract class`.
3. Commettent des erreurs classiques comme `x instanceof MonInterface` (TS2693).
4. Doivent comprendre la différence fondamentale entre le **comportement du compilateur TypeScript** et **l'exécution en mémoire JavaScript**.

---

## 🚀 Démarrage Rapide

### Prérequis
* **Node.js** : v20+ ou v22+
* **npm** : v10+

### Commandes
```bash
# Se positionner dans le dossier du projet
cd "/home/cchiodo/EAFC/POO/Séance 8/angular-seance8"

# Installer les dépendances (déjà disponibles dans le cache local)
npm install

# Lancer le serveur de développement en local
npm start
# -> Accessible sur http://localhost:4200

# Lancer la suite de tests automatisée (Vitest)
npm test

# Compiler pour la production
npm run build
```

---

## 🏗️ Architecture Technique

* **Framework** : Angular v22 (100% Standalone Components).
* **Gestion d'état** : Angular Signals (`signal`, `computed`, `effect`).
* **Templates** : Nouveau control flow natif (`@if`, `@for`, `@switch`).
* **Éditeur de code** : **Monaco Editor** (`@monaco-editor/loader` + `monaco-editor`) avec worker TypeScript officiel configuré en local (`assets/monaco/vs`) et repli CDN jsDelivr.
* **Sandbox d'évaluation** : `TypescriptTranspilerService` exécutant le code TypeScript 100% côté client en mémoire (`new Function`) avec interception de la console (`log`, `warn`, `error`, `info`).
* **Suite de tests & Validation** : Analyse statique de code et assertions fonctionnelles sur les 21 exercices avec sauvegarde automatique de la progression dans `localStorage`.

---

## 📚 Les 7 Modules Théoriques Interactifs

1. **Pourquoi l'Abstraction ? (Fin des objets fantômes et du code bouchon)**
   * *Simulateur d'objets fantômes* : Démonstrateur visuel de l'aberration `new Forme()` et interdiction immédiate par `abstract` (`TS2511`).
   * *Comparateur Code Bouchon vs Signature Pure* : Le piège de `return 0;` (bogue silencieux tardif) vs `abstract calculer(): number;` (obligation stricte dès la frappe).
   * *Visualiseur du problème du diamant* : Pourquoi l'héritage multiple de classes est bloqué en TypeScript et comment l'interface le résout sans collision.

2. **L'Anatomie d'une Classe Abstraite (`abstract class`)**
   * *Inspecteur de structure (3 Piliers)* : Constructeur et factorisation d'état (`super()`), méthodes concrètes partagées (DRY) et signatures abstraites.
   * *Laboratoire des modificateurs d'accès* : Matrice `public abstract` vs `protected abstract`, et animation expliquant le paradoxe logique de `private abstract` (`TS18010`).
   * *Explorateur d'abstractions en cascade* : Arbre dynamique `Animal` (racine) -> `Mammifere` (intermédiaire) -> `Vache` (feuille soldant toutes les obligations).

3. **L'Interface (`interface`) : Le Contrat Pur**
   * *Métaphore de la Prise Murale* : Objets hétérogènes (`GrillePain`, `PCGamer`, `Tesla`) se branchant sur la même prise contractuelle `Alimentable230V`.
   * *Démonstrateur de Multi-implémentation* : `class Canard implements Volant, Nageant, Marchant` sans aucune collision de code.
   * *Composeur d'Interfaces (`extends` multiple)* : Assemblage dynamique de micro-contrats (`EntiteNommee` + `Horodatee` + `Auditable`).

4. **Le Typage Structurel (*Duck Typing*) & Zéro Coût Runtime**
   * *Le Banc d'Essai Duck Typing* : Test d'objets littéraux anonymes, tolérance des surplus et mécanisme d'Excess Property Check direct.
   * *Split-Screen TS vs JS Transpilé (Type Erasure)* : Démonstration que l'interface pèse **0 octet** en JavaScript, tandis que la classe abstraite génère un constructeur prototype réel.

5. **L'Arbre de Décision : « Est-un » vs « Capable-de »**
   * *Sélecteur d'Architecture Interactif* : Questionnaire dynamique en 4 critères orientant vers `abstract class`, `interface` ou le pattern hybride pro.
   * *Démonstrateur du Pattern Hybride Pro* : Décomposition de l'architecture industrielle : Interface pour l'API publique + Classe abstraite pour le boilerplate.

6. **Laboratoire des Pièges & Anti-Patterns**
   * *Le Crash Test `instanceof` sur une Interface* : Explication de l'erreur `TS2693` et écriture d'un *User-defined Type Guard* (`cible is Soigneur`).
   * *Visualiseur ISP (Interface Segregation Principle)* : Comparaison entre une interface obèse tyrannique et des micro-interfaces ciblées et combinables.

7. **Le Simulateur Live : L'Arène des Héros RPG**
   * Scène de combat interactive avec `Personnage` (abstrait), `Soigneur` (contrat d'aptitude), `Guerrier` et `Mage`.
   * Déclenchement polymorphe sans aucun `if (type === ...)` ni `switch`.
   * Démonstration OCP : recrutement à chaud d'un `Archer` sans modifier 1 seule ligne du contrôleur de combat.

---

## 💻 Les 5 Laboratoires Pratiques Monaco Editor (21 Exercices)

Chaque exercice propose : énoncé clair, code initial avec amorce guidée, éditeur Monaco avec typage en direct, terminal virtuel sandbox, indices progressifs, explication pas-à-pas et bouton d'injection de solution officielle.

* **Labo 1 — Classes Abstraites & Signatures Pures** (5 exercices) :
  * `1.1` : Déclaration & Interdiction de `new` (`abstract class Vehicule`).
  * `1.2` : Méthode abstraite obligatoire (`abstract demarrer(): string;`, classe `Moto`).
  * `1.3` : Factorisation & `super(marque)` avec sous-classe `Voiture`.
  * `1.4` : Protection de visibilité (`protected abstract calculerTaxe(): number`).
  * `1.5` : Chaîne d'abstraction en cascade (`VehiculeElectrique` -> `Tesla`).

* **Labo 2 — Interfaces & Multi-implémentation** (4 exercices) :
  * `2.1` : Contrat pur (`interface Connectable { connecter(ip: string): boolean; }`).
  * `2.2` : Multi-implémentation (`ImprimanteMultifonction implements Imprimable, Scannable`).
  * `2.3` : Extension multiple d'interfaces (`CompteAdmin extends CompteSimple, Journalisable`).
  * `2.4` : Propriété `readonly` de contrat (`readonly uuid: string`).

* **Labo 3 — Duck Typing & DTOs** (4 exercices) :
  * `3.1` : Conformité par la forme (`Point2D` et objet anonyme sans classe).
  * `3.2` : Tolérance des propriétés excédentaires (`Identifiable`).
  * `3.3` : Typage d'un DTO API générique (`ReponseServeur<T>`).
  * `3.4` : Strict Duck Typing & Excess property check (passage par variable).

* **Labo 4 — Déjouer les Pièges & Type Guards** (4 exercices) :
  * `4.1` : Diagnostic du piège `instanceof` sur interface (`TS2693`).
  * `4.2` : Création d'un User-Defined Type Guard (`isSoigneur(cible: any): cible is Soigneur`).
  * `4.3` : Utilisation sécurisée et Type Narrowing sans cast `as`.
  * `4.4` : Refactorisation ISP (découpage d'interface monolithique en micro-contrats).

* **Labo 5 — Architecture Hybride & Découplage** (4 exercices) :
  * `5.1` : Le squelette abstrait (`Exportable` + `DocumentBase`).
  * `5.2` : Concrétisation des formats (`DocumentPDF` et `DocumentMarkdown`).
  * `5.3` : Collection polymorphe agnostique (`exporterTous(documents: Exportable[])`).
  * `5.4` : Extensibilité sans régression OCP (`FactureXML` sans toucher à `exporterTous`).

---

## 📁 Arborescence du Projet

```
angular-seance8/
├── angular.json
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.spec.json
├── .prettierrc
├── .editorconfig
├── public/
│   └── favicon.ico
├── src/
│   ├── index.html
│   ├── main.ts
│   ├── styles.scss
│   └── app/
│       ├── app.ts
│       ├── app.html
│       ├── app.scss
│       ├── app.routes.ts
│       ├── app.config.ts
│       ├── core/
│       │   ├── models/
│       │   │   └── app.models.ts
│       │   └── services/
│       │       ├── theme.service.ts
│       │       ├── navigation.service.ts
│       │       ├── monaco-loader.service.ts
│       │       ├── typescript-transpiler.service.ts
│       │       ├── exercise.service.ts
│       │       └── exercise.service.spec.ts
│       ├── shared/
│       │   └── components/
│       │       ├── navbar/navbar.component.ts
│       │       ├── sidebar/sidebar.component.ts
│       │       ├── monaco-editor/monaco-editor.component.ts
│       │       └── lab-runner/lab-runner.component.ts
│       └── features/
│           ├── why-abstraction/why-abstraction.component.ts
│           ├── abstract-class-anatomy/abstract-class-anatomy.component.ts
│           ├── interface-pure-contract/interface-pure-contract.component.ts
│           ├── duck-typing-runtime-cost/duck-typing-runtime-cost.component.ts
│           ├── decision-tree-hybrid/decision-tree-hybrid.component.ts
│           ├── pitfalls-type-guards/pitfalls-type-guards.component.ts
│           ├── rpg-arena-simulator/rpg-arena-simulator.component.ts
│           └── workshops-lab/workshops-lab.component.ts
└── README.md
```
