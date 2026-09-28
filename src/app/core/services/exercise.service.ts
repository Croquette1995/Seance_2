import { Injectable, signal, computed, inject } from '@angular/core';
import { Exercise, ValidationCriterion, ConsoleLogEntry, TabId } from '../models/app.models';
import { TypescriptTranspilerService } from './typescript-transpiler.service';

@Injectable({
  providedIn: 'root',
})
export class ExerciseService {
  private readonly STORAGE_KEY = 'ts_seance8_exercises_v1';
  private readonly transpiler = inject(TypescriptTranspilerService);

  readonly activeExerciseIndex = signal<number>(0);
  readonly filterLab = signal<number | null>(null);

  readonly exercises = signal<Exercise[]>([
    // =========================================================================
    // LABO 1 : Classes Abstraites & Signatures Pures (5 ex)
    // =========================================================================
    {
      id: 'ex-1-1',
      labNumber: 1,
      number: '1.1',
      title: 'Déclaration & Interdiction de new',
      subtitle: "Interdire l'instanciation d'un concept incomplet au compilateur",
      sectionId: 'why-abstraction',
      estimatedTime: '4 min',
      difficulty: 'Débutant',
      statement:
        'Déclarez une classe abstraite `Vehicule` avec un constructeur factorisant la propriété `public marque: string`. Tentez de l\'instancier avec `new Vehicule("Generique")` et constatez l\'erreur de compilation (TS2511). Ensuite, commentez cette tentative et observez que le code compile proprement.',
      hint: 'Utilisez la syntaxe `abstract class Vehicule { constructor(public marque: string) {} }`.',
      initialCode: `// 1. Déclarez la classe abstraite Vehicule avec son constructeur factorisant la marque :\n\n\n// 2. La ligne suivante doit déclencher une erreur si décommentée :\n// const v = new Vehicule("Generique");\n\nconsole.log("Classe abstraite déclarée avec succès !");\n`,
      solutionCode: `abstract class Vehicule {\n  constructor(public marque: string) {}\n}\n\n// const v = new Vehicule("Generique"); // TS2511: Cannot create an instance of an abstract class.\n\nconsole.log("Classe abstraite déclarée avec succès !");\n`,
      currentCode: `// 1. Déclarez la classe abstraite Vehicule avec son constructeur factorisant la marque :\n\n\n// 2. La ligne suivante doit déclencher une erreur si décommentée :\n// const v = new Vehicule("Generique");\n\nconsole.log("Classe abstraite déclarée avec succès !");\n`,
      isCompleted: false,
      solutionExplanation: [
        'Le mot-clé `abstract` devant `class` indique à TypeScript que cette classe ne peut pas être instanciée directement.',
        'Toute tentative de faire `new Vehicule()` est rejetée à la compilation avec l\'erreur `TS2511`.',
        'La classe sert uniquement de modèle et de contrat de base pour ses sous-classes.'
      ],
      criteria: [
        {
          id: 'c1-abstract-class',
          label: 'Classe abstraite Vehicule déclarée',
          description: 'Vehicule doit être précédée du mot-clé abstract.',
          passed: false,
          hint: 'abstract class Vehicule { ... }'
        },
        {
          id: 'c1-constructor',
          label: 'Constructeur avec paramètre marque',
          description: 'Le constructeur doit recevoir ou initialiser une propriété marque (string).',
          passed: false,
          hint: 'constructor(public marque: string) {}'
        },
        {
          id: 'c1-no-new-vehicule',
          label: 'Pas d\'instanciation active de new Vehicule',
          description: 'L\'instanciation directe doit être commentée ou absente du code exécuté.',
          passed: false,
          hint: 'Commentez la ligne de création new Vehicule(...)'
        }
      ]
    },
    {
      id: 'ex-1-2',
      labNumber: 1,
      number: '1.2',
      title: 'Méthode Abstraite Obligatoire',
      subtitle: 'Forcer la signature sans corps et la redéfinition dans la sous-classe',
      sectionId: 'abstract-class-anatomy',
      estimatedTime: '5 min',
      difficulty: 'Facile',
      statement:
        'Dans la classe abstraite `Vehicule`, ajoutez la méthode abstraite `abstract demarrer(): string;` (sans corps `{}`). Créez ensuite une classe concrète `Moto` héritant de `Vehicule` qui implémente cette méthode en retournant `"Vroum vroum"`. Instanciez une moto et affichez le résultat de `demarrer()`.',
      hint: 'La signature abstraite se termine par un point-virgule `;`. Dans la classe `Moto`, implémentez `demarrer(): string { return "Vroum vroum"; }`.',
      initialCode: `abstract class Vehicule {\n  constructor(public marque: string) {}\n  // 1. Ajoutez la signature abstraite demarrer(): string;\n}\n\n// 2. Créez la sous-classe concrète Moto qui hérite de Vehicule\n\n\n// 3. Instanciez une moto Yamaha et affichez son démarrage :\n`,
      solutionCode: `abstract class Vehicule {\n  constructor(public marque: string) {}\n  abstract demarrer(): string;\n}\n\nclass Moto extends Vehicule {\n  demarrer(): string {\n    return "Vroum vroum";\n  }\n}\n\nconst maMoto = new Moto("Yamaha");\nconsole.log(maMoto.demarrer());\n`,
      currentCode: `abstract class Vehicule {\n  constructor(public marque: string) {}\n  // 1. Ajoutez la signature abstraite demarrer(): string;\n}\n\n// 2. Créez la sous-classe concrète Moto qui hérite de Vehicule\n\n\n// 3. Instanciez une moto Yamaha et affichez son démarrage :\n`,
      isCompleted: false,
      solutionExplanation: [
        'Une méthode abstraite `abstract demarrer(): string;` n\'a aucun corps de code dans la classe mère.',
        'Elle constitue une obligation stricte : toute sous-classe concrète qui oublie de l\'implémenter provoque l\'erreur `TS2515`.',
        'Dans `Moto`, on implémente la méthode concrète sans le mot-clé `abstract`.'
      ],
      criteria: [
        {
          id: 'c2-abstract-method',
          label: 'Signature abstraite demarrer()',
          description: 'Vehicule doit déclarer abstract demarrer(): string;',
          passed: false,
          hint: 'abstract demarrer(): string;'
        },
        {
          id: 'c2-concrete-moto',
          label: 'Classe Moto implémentant demarrer',
          description: 'Moto doit hériter de Vehicule et implémenter demarrer().',
          passed: false,
          hint: 'class Moto extends Vehicule { demarrer(): string { return "Vroum vroum"; } }'
        },
        {
          id: 'c2-execution',
          label: 'Affichage du démarrage en console',
          description: 'La console doit afficher le texte retourné par demarrer() (ex: Vroum vroum).',
          passed: false,
          hint: 'console.log(maMoto.demarrer());'
        }
      ]
    },
    {
      id: 'ex-1-3',
      labNumber: 1,
      number: '1.3',
      title: 'Factorisation & super()',
      subtitle: "Déléguer l'état partagé au constructeur de la classe mère",
      sectionId: 'abstract-class-anatomy',
      estimatedTime: '5 min',
      difficulty: 'Facile',
      statement:
        'Créez une classe `Voiture` qui hérite de `Vehicule`. Son constructeur doit recevoir `marque: string` et `nombrePortes: number`. Vous devez obligatoirement appeler `super(marque)` pour initialiser la propriété héritée. Implémentez également `demarrer()` qui retourne `"Vrombissement de la " + this.marque`.',
      hint: 'N\'oubliez pas que `super(...)` doit être la première instruction du constructeur d\'une classe dérivée avant d\'utiliser `this`.',
      initialCode: `abstract class Vehicule {\n  constructor(public marque: string) {}\n  abstract demarrer(): string;\n}\n\n// 1. Créez la sous-classe Voiture extends Vehicule avec nombrePortes et super(marque)\n\n\n// 2. Testez votre code (décommentez une fois la classe créée) :\n// const v = new Voiture("Peugeot", 5);\n// console.log(v.demarrer(), "- Portes:", v.nombrePortes);\n`,
      solutionCode: `abstract class Vehicule {\n  constructor(public marque: string) {}\n  abstract demarrer(): string;\n}\n\nclass Voiture extends Vehicule {\n  constructor(marque: string, public nombrePortes: number) {\n    super(marque);\n  }\n\n  demarrer(): string {\n    return "Vrombissement de la " + this.marque;\n  }\n}\n\nconst v = new Voiture("Peugeot", 5);\nconsole.log(v.demarrer(), "- Portes:", v.nombrePortes);\n`,
      currentCode: `abstract class Vehicule {\n  constructor(public marque: string) {}\n  abstract demarrer(): string;\n}\n\n// 1. Créez la sous-classe Voiture extends Vehicule avec nombrePortes et super(marque)\n\n\n// 2. Testez votre code (décommentez une fois la classe créée) :\n// const v = new Voiture("Peugeot", 5);\n// console.log(v.demarrer(), "- Portes:", v.nombrePortes);\n`,
      isCompleted: false,
      solutionExplanation: [
        'La classe abstraite factorise l\'état (la propriété `marque`).',
        'Même si la classe abstraite ne peut pas être instanciée directement avec `new`, son constructeur s\'exécute lors de l\'instanciation des classes filles via `super()`.',
        'La sous-classe étend cet état en ajoutant ses propres propriétés spécifiques (`nombrePortes`).'
      ],
      criteria: [
        {
          id: 'c3-super-call',
          label: 'Appel obligatoire à super(marque)',
          description: 'Le constructeur de Voiture doit appeler super(marque).',
          passed: false,
          hint: 'constructor(marque: string, ...) { super(marque); ... }'
        },
        {
          id: 'c3-prop-portes',
          label: 'Propriété nombrePortes présente',
          description: 'Voiture doit posséder la propriété nombrePortes.',
          passed: false,
          hint: 'public nombrePortes: number'
        },
        {
          id: 'c3-log-output',
          label: 'Exécution correcte du démarrage',
          description: 'La console doit afficher le vrombissement et le nombre de portes (5).',
          passed: false,
          hint: 'Vérifiez la sortie console de v.demarrer().'
        }
      ]
    },
    {
      id: 'ex-1-4',
      labNumber: 1,
      number: '1.4',
      title: 'Protection de Visibilité (protected abstract)',
      subtitle: 'Forcer une implémentation réservée à l\'usage interne de la classe',
      sectionId: 'abstract-class-anatomy',
      estimatedTime: '6 min',
      difficulty: 'Intermédiaire',
      statement:
        'Dans `Vehicule`, ajoutez la méthode `protected abstract calculerTaxe(): number;`. Ajoutez également une méthode concrète publique `afficherPrixTTC(prixBase: number): number` qui renvoie `prixBase + this.calculerTaxe()`. Dans la classe `Voiture`, implémentez `calculerTaxe()` pour qu\'elle renvoie `150`. Testez l\'appel de `afficherPrixTTC(20000)`.',
      hint: 'La visibilité `protected` permet aux sous-classes de redéfinir la méthode tout en empêchant le code extérieur de l\'appeler directement.',
      initialCode: `abstract class Vehicule {\n  constructor(public marque: string) {}\n  abstract demarrer(): string;\n\n  // 1. Ajoutez protected abstract calculerTaxe(): number;\n\n  // 2. Ajoutez afficherPrixTTC(prixBase: number): number qui retourne prixBase + this.calculerTaxe()\n}\n\nclass Voiture extends Vehicule {\n  demarrer(): string { return "Vroum"; }\n\n  // 3. Implémentez la taxe spécifique à la voiture (ex: return 150;)\n}\n\n// 4. Testez votre code (décommentez une fois les méthodes ajoutées) :\n// const auto = new Voiture("Renault");\n// console.log("Prix TTC :", auto.afficherPrixTTC(20000));\n`,
      solutionCode: `abstract class Vehicule {\n  constructor(public marque: string) {}\n  abstract demarrer(): string;\n\n  protected abstract calculerTaxe(): number;\n\n  afficherPrixTTC(prixBase: number): number {\n    return prixBase + this.calculerTaxe();\n  }\n}\n\nclass Voiture extends Vehicule {\n  demarrer(): string { return "Vroum"; }\n\n  protected calculerTaxe(): number {\n    return 150;\n  }\n}\n\nconst auto = new Voiture("Renault");\nconsole.log("Prix TTC :", auto.afficherPrixTTC(20000));\n`,
      currentCode: `abstract class Vehicule {\n  constructor(public marque: string) {}\n  abstract demarrer(): string;\n\n  // 1. Ajoutez protected abstract calculerTaxe(): number;\n\n  // 2. Ajoutez afficherPrixTTC(prixBase: number): number qui retourne prixBase + this.calculerTaxe()\n}\n\nclass Voiture extends Vehicule {\n  demarrer(): string { return "Vroum"; }\n\n  // 3. Implémentez la taxe spécifique à la voiture (ex: return 150;)\n}\n\n// 4. Testez votre code (décommentez une fois les méthodes ajoutées) :\n// const auto = new Voiture("Renault");\n// console.log("Prix TTC :", auto.afficherPrixTTC(20000));\n`,
      isCompleted: false,
      solutionExplanation: [
        'Le modificateur `protected abstract` garantit que la méthode ne fait pas partie de l\'API publique externe.',
        'La méthode mère `afficherPrixTTC` applique le pattern "Template Method" : elle orchestre le flux global en déléguant le calcul précis à la sous-classe.',
        '`private abstract` est strictement interdit par TypeScript (erreur TS18010) car une classe fille ne pourrait pas voir la méthode qu\'elle est obligée de redéfinir.'
      ],
      criteria: [
        {
          id: 'c4-prot-abstract',
          label: 'protected abstract calculerTaxe()',
          description: 'La méthode doit être déclarée en protected abstract.',
          passed: false,
          hint: 'protected abstract calculerTaxe(): number;'
        },
        {
          id: 'c4-template-method',
          label: 'Méthode concrète afficherPrixTTC',
          description: 'afficherPrixTTC appelle this.calculerTaxe() et additionne le prix.',
          passed: false,
          hint: 'afficherPrixTTC(prixBase: number): number { return prixBase + this.calculerTaxe(); }'
        },
        {
          id: 'c4-correct-calc',
          label: 'Calcul exact du prix TTC (20150)',
          description: 'La console doit afficher 20150.',
          passed: false,
          hint: 'Vérifiez la valeur affichée en console.'
        }
      ]
    },
    {
      id: 'ex-1-5',
      labNumber: 1,
      number: '1.5',
      title: "Chaîne d'Abstraction en Cascade",
      subtitle: "Intercaler une classe abstraite intermédiaire enrichissant le contrat",
      sectionId: 'abstract-class-anatomy',
      estimatedTime: '6 min',
      difficulty: 'Intermédiaire',
      statement:
        'Intercalez une classe abstraite intermédiaire `VehiculeElectrique extends Vehicule`. Elle doit ajouter la propriété `public capaciteBatterie: number` dans son constructeur (avec `super(marque)`) et déclarer une nouvelle méthode abstraite `abstract recharger(): string;`. Créez enfin la classe concrète `Tesla extends VehiculeElectrique` qui solde TOUTES les obligations (`demarrer` et `recharger`).',
      hint: 'Une classe abstraite qui hérite d\'une autre classe abstraite n\'est PAS obligée d\'implémenter les méthodes abstraites de son parent ! C\'est la première classe concrète (la feuille de l\'arbre) qui doit tout implémenter.',
      initialCode: `abstract class Vehicule {\n  constructor(public marque: string) {}\n  abstract demarrer(): string;\n}\n\n// 1. Créez la classe abstraite intermédiaire VehiculeElectrique extends Vehicule\n\n\n// 2. Créez la classe concrète Tesla extends VehiculeElectrique qui solde demarrer() et recharger()\n\n\n// 3. Testez votre code (décommentez une fois les classes créées) :\n// const modelS = new Tesla("Tesla", 100);\n// console.log(modelS.demarrer(), "|", modelS.recharger(), "| Batterie:", modelS.capaciteBatterie, "kWh");\n`,
      solutionCode: `abstract class Vehicule {\n  constructor(public marque: string) {}\n  abstract demarrer(): string;\n}\n\nabstract class VehiculeElectrique extends Vehicule {\n  constructor(marque: string, public capaciteBatterie: number) {\n    super(marque);\n  }\n  abstract recharger(): string;\n}\n\nclass Tesla extends VehiculeElectrique {\n  demarrer(): string {\n    return "Démarrage silencieux en électrique";\n  }\n  recharger(): string {\n    return "Recharge Supercharger en cours";\n  }\n}\n\nconst modelS = new Tesla("Tesla", 100);\nconsole.log(modelS.demarrer(), "|", modelS.recharger(), "| Batterie:", modelS.capaciteBatterie, "kWh");\n`,
      currentCode: `abstract class Vehicule {\n  constructor(public marque: string) {}\n  abstract demarrer(): string;\n}\n\n// 1. Créez la classe abstraite intermédiaire VehiculeElectrique extends Vehicule\n\n\n// 2. Créez la classe concrète Tesla extends VehiculeElectrique qui solde demarrer() et recharger()\n\n\n// 3. Testez votre code (décommentez une fois les classes créées) :\n// const modelS = new Tesla("Tesla", 100);\n// console.log(modelS.demarrer(), "|", modelS.recharger(), "| Batterie:", modelS.capaciteBatterie, "kWh");\n`,
      isCompleted: false,
      solutionExplanation: [
        '`VehiculeElectrique` est une abstraction intermédiaire : elle prolonge `Vehicule` sans implémenter `demarrer()`.',
        'Elle enrichit la hiérarchie avec une nouvelle promesse : `recharger()`.',
        'La classe terminale `Tesla` n\'a pas le choix : elle doit obligatoirement implémenter `demarrer()` (hérité de Vehicule) ET `recharger()` (hérité de VehiculeElectrique).'
      ],
      criteria: [
        {
          id: 'c5-intermediate-abstract',
          label: 'abstract class VehiculeElectrique déclarée',
          description: 'VehiculeElectrique doit être abstraite et étendre Vehicule.',
          passed: false,
          hint: 'abstract class VehiculeElectrique extends Vehicule'
        },
        {
          id: 'c5-recharger-abstract',
          label: 'Méthode abstract recharger(): string',
          description: 'VehiculeElectrique doit ajouter abstract recharger(): string;',
          passed: false,
          hint: 'abstract recharger(): string;'
        },
        {
          id: 'c5-concrete-tesla',
          label: 'Classe Tesla implémentant les deux méthodes',
          description: 'Tesla doit concrétiser demarrer() et recharger().',
          passed: false,
          hint: 'Tesla implémente demarrer et recharger.'
        },
        {
          id: 'c5-logs-valid',
          label: 'Affichage complet en console',
          description: 'La console doit afficher les messages de démarrage et de recharge avec 100 kWh.',
          passed: false,
          hint: 'Vérifiez la console.'
        }
      ]
    },

    // =========================================================================
    // LABO 2 : Interfaces & Multi-implémentation (4 ex)
    // =========================================================================
    {
      id: 'ex-2-1',
      labNumber: 2,
      number: '2.1',
      title: 'Le Contrat Pur (interface)',
      subtitle: "Exiger une signature sans aucune ligne d'implémentation",
      sectionId: 'interface-pure-contract',
      estimatedTime: '4 min',
      difficulty: 'Débutant',
      statement:
        'Déclarez une interface `Connectable` exigeant la méthode `connecter(ip: string): boolean;`. Créez ensuite une classe `ServeurWeb` qui implémente cette interface (`implements Connectable`). La méthode `connecter` doit afficher l\'adresse IP reçue et renvoyer `true`.',
      hint: 'Utilisez `interface Connectable { connecter(ip: string): boolean; }` et `class ServeurWeb implements Connectable { ... }`.',
      initialCode: `// 1. Déclarez l'interface Connectable :\n\n\n// 2. Implémentez la classe ServeurWeb :\n\n\n// 3. Testez votre code (décommentez une fois la classe créée) :\n// const serveur = new ServeurWeb();\n// const statut = serveur.connecter("192.168.1.100");\n// console.log("Connecté :", statut);\n`,
      solutionCode: `interface Connectable {\n  connecter(ip: string): boolean;\n}\n\nclass ServeurWeb implements Connectable {\n  connecter(ip: string): boolean {\n    console.log("Connexion établie avec :", ip);\n    return true;\n  }\n}\n\nconst serveur = new ServeurWeb();\nconst statut = serveur.connecter("192.168.1.100");\nconsole.log("Connecté :", statut);\n`,
      currentCode: `// 1. Déclarez l'interface Connectable :\n\n\n// 2. Implémentez la classe ServeurWeb :\n\n\n// 3. Testez votre code (décommentez une fois la classe créée) :\n// const serveur = new ServeurWeb();\n// const statut = serveur.connecter("192.168.1.100");\n// console.log("Connecté :", statut);\n`,
      isCompleted: false,
      solutionExplanation: [
        'Une interface TypeScript ne contient AUCUN corps de méthode, AUCUN constructeur, AUCUN état initialisé.',
        'C\'est un contrat pur à 100% : elle décrit ce qu\'une classe doit savoir faire, sans imposer comment elle le fait.',
        'La clause `implements` impose au compilateur de vérifier scrupuleusement la présence et le type de chaque membre.'
      ],
      criteria: [
        {
          id: 'c21-interface-def',
          label: 'Interface Connectable déclarée',
          description: 'L\'interface doit exiger connecter(ip: string): boolean.',
          passed: false,
          hint: 'interface Connectable { connecter(ip: string): boolean; }'
        },
        {
          id: 'c21-implements-clause',
          label: 'implements Connectable sur ServeurWeb',
          description: 'ServeurWeb doit signer le contrat Connectable.',
          passed: false,
          hint: 'class ServeurWeb implements Connectable'
        },
        {
          id: 'c21-output-ip',
          label: 'Connexion validée et retour true',
          description: 'La console doit confirmer la connexion à l\'adresse IP et afficher true.',
          passed: false,
          hint: 'Vérifiez la console.'
        }
      ]
    },
    {
      id: 'ex-2-2',
      labNumber: 2,
      number: '2.2',
      title: 'Multi-implémentation sans Collision',
      subtitle: 'Signer plusieurs contrats distincts sur une même classe',
      sectionId: 'interface-pure-contract',
      estimatedTime: '5 min',
      difficulty: 'Facile',
      statement:
        'Déclarez deux interfaces : `Imprimable` avec `imprimer(document: string): void;` et `Scannable` avec `scanner(): string;`. Créez la classe `ImprimanteMultifonction` qui implémente SIMULTANÉMENT les deux contrats (`implements Imprimable, Scannable`). Testez les deux méthodes.',
      hint: 'La syntaxe pour multi-implémenter est séparée par une virgule : `class Foo implements A, B`.',
      initialCode: `// 1. Déclarez les interfaces Imprimable et Scannable :\n\n\n// 2. Classe ImprimanteMultifonction implements Imprimable, Scannable :\n\n\n// 3. Testez votre code (décommentez une fois la classe créée) :\n// const machine = new ImprimanteMultifonction();\n// machine.imprimer("Rapport.pdf");\n// console.log("Scan obtenu :", machine.scanner());\n`,
      solutionCode: `interface Imprimable {\n  imprimer(document: string): void;\n}\n\ninterface Scannable {\n  scanner(): string;\n}\n\nclass ImprimanteMultifonction implements Imprimable, Scannable {\n  imprimer(document: string): void {\n    console.log("Impression de :", document);\n  }\n  scanner(): string {\n    return "Numérisation HD terminée";\n  }\n}\n\nconst machine = new ImprimanteMultifonction();\nmachine.imprimer("Rapport.pdf");\nconsole.log("Scan obtenu :", machine.scanner());\n`,
      currentCode: `// 1. Déclarez les interfaces Imprimable et Scannable :\n\n\n// 2. Classe ImprimanteMultifonction implements Imprimable, Scannable :\n\n\n// 3. Testez votre code (décommentez une fois la classe créée) :\n// const machine = new ImprimanteMultifonction();\n// machine.imprimer("Rapport.pdf");\n// console.log("Scan obtenu :", machine.scanner());\n`,
      isCompleted: false,
      solutionExplanation: [
        'En TypeScript, une classe ne peut étendre qu\'une seule classe mère (héritage simple pour éviter le problème du diamant).',
        'En revanche, une classe peut implémenter autant d\'interfaces qu\'elle le souhaite (`implements A, B, C`).',
        'Comme les interfaces n\'ont aucun corps de méthode, aucune collision de code n\'est possible.'
      ],
      criteria: [
        {
          id: 'c22-interfaces',
          label: 'Interfaces Imprimable et Scannable définies',
          description: 'Les deux interfaces doivent comporter leurs signatures respectives.',
          passed: false,
          hint: 'Vérifiez les signatures de imprimer et scanner.'
        },
        {
          id: 'c22-multi-impl',
          label: 'Multi-implémentation sur ImprimanteMultifonction',
          description: 'La classe doit spécifier implements Imprimable, Scannable.',
          passed: false,
          hint: 'implements Imprimable, Scannable'
        },
        {
          id: 'c22-methods-exec',
          label: 'Impression et scan exécutés avec succès',
          description: 'La console doit afficher l\'impression et le retour du scan.',
          passed: false,
          hint: 'Vérifiez les affichages console.'
        }
      ]
    },
    {
      id: 'ex-2-3',
      labNumber: 2,
      number: '2.3',
      title: 'Extension Multiple d\'Interfaces (extends multiple)',
      subtitle: 'Composer des micro-contrats par héritage d\'interfaces',
      sectionId: 'interface-pure-contract',
      estimatedTime: '5 min',
      difficulty: 'Intermédiaire',
      statement:
        'Soit `interface CompteSimple { email: string; }` et `interface Journalisable { journaliser(action: string): void; }`. Créez l\'interface `CompteAdmin` qui étend SIMULTANÉMENT les deux (`extends CompteSimple, Journalisable`) et ajoute `droits: string[];`. Implémentez une classe `SuperAdmin` respectant `CompteAdmin`.',
      hint: 'Une interface peut faire `extends A, B` ! Contrairement aux classes, l\'héritage multiple entre interfaces est 100% légal et encouragé.',
      initialCode: `interface CompteSimple {\n  email: string;\n}\n\ninterface Journalisable {\n  journaliser(action: string): void;\n}\n\n// 1. Déclarez l'interface composée CompteAdmin extends CompteSimple, Journalisable :\n\n\n// 2. Créez la classe SuperAdmin implémentant CompteAdmin :\n\n\n// 3. Testez votre code (décommentez une fois la classe créée) :\n// const root = new SuperAdmin("root@system.local", ["ALL_PRIVILEGES"]);\n// root.journaliser("Démarrage maintenance");\n// console.log(root.email, "- Droits:", root.droits.join(", "));\n`,
      solutionCode: `interface CompteSimple {\n  email: string;\n}\n\ninterface Journalisable {\n  journaliser(action: string): void;\n}\n\ninterface CompteAdmin extends CompteSimple, Journalisable {\n  droits: string[];\n}\n\nclass SuperAdmin implements CompteAdmin {\n  constructor(public email: string, public droits: string[]) {}\n\n  journaliser(action: string): void {\n    console.log("[" + this.email + "] Log : " + action);\n  }\n}\n\nconst root = new SuperAdmin("root@system.local", ["ALL_PRIVILEGES"]);\nroot.journaliser("Démarrage maintenance");\nconsole.log(root.email, "- Droits:", root.droits.join(", "));\n`,
      currentCode: `interface CompteSimple {\n  email: string;\n}\n\ninterface Journalisable {\n  journaliser(action: string): void;\n}\n\n// 1. Déclarez l'interface composée CompteAdmin extends CompteSimple, Journalisable :\n\n\n// 2. Créez la classe SuperAdmin implémentant CompteAdmin :\n\n\n// 3. Testez votre code (décommentez une fois la classe créée) :\n// const root = new SuperAdmin("root@system.local", ["ALL_PRIVILEGES"]);\n// root.journaliser("Démarrage maintenance");\n// console.log(root.email, "- Droits:", root.droits.join(", "));\n`,
      isCompleted: false,
      solutionExplanation: [
        'L\'héritage d\'interfaces permet de combiner des micro-responsabilités modulaires.',
        'TypeScript autorise `interface A extends B, C` sans restriction, car il n\'y a aucune logique à fusionner, juste des signatures.',
        'La classe qui signe l\'interface finale hérite transitivement de l\'obligation de respecter tous les contrats ancêtres.'
      ],
      criteria: [
        {
          id: 'c23-extends-multiple',
          label: 'CompteAdmin étend CompteSimple et Journalisable',
          description: 'CompteAdmin doit utiliser extends CompteSimple, Journalisable.',
          passed: false,
          hint: 'interface CompteAdmin extends CompteSimple, Journalisable'
        },
        {
          id: 'c23-droits-prop',
          label: 'Propriété droits déclarée dans CompteAdmin',
          description: 'CompteAdmin doit exiger droits: string[].',
          passed: false,
          hint: 'droits: string[];'
        },
        {
          id: 'c23-class-impl',
          label: 'SuperAdmin satisfait tous les contrats',
          description: 'SuperAdmin doit avoir email, droits et journaliser().',
          passed: false,
          hint: 'Vérifiez la conformité de SuperAdmin.'
        }
      ]
    },
    {
      id: 'ex-2-4',
      labNumber: 2,
      number: '2.4',
      title: 'Propriété readonly de Contrat',
      subtitle: 'Verrouiller l\'immuabilité contractuelle dès l\'interface',
      sectionId: 'interface-pure-contract',
      estimatedTime: '4 min',
      difficulty: 'Facile',
      statement:
        'Déclarez une interface `EntiteImmuable` contenant la propriété `readonly uuid: string;`. Créez la classe `Fichier` qui l\'implémente avec `constructor(public readonly uuid: string, public nom: string) {}`. Affichez l\'UUID, et vérifiez qu\'une tentative de modification directe `fichier.uuid = "autre"` est interdite par TypeScript.',
      hint: 'Le modificateur `readonly` dans une interface force la classe concrète à ne permettre l\'affectation que lors de l\'initialisation.',
      initialCode: `// 1. Déclarez interface EntiteImmuable avec readonly uuid: string;\n\n\n// 2. Créez la classe Fichier implements EntiteImmuable :\n\n\n// 3. Testez votre code (décommentez une fois la classe créée) :\n// const doc = new Fichier("550e8400-e29b-41d4-a716-446655440000", "notes.txt");\n// console.log("Fichier immuable :", doc.nom, "| UUID :", doc.uuid);\n`,
      solutionCode: `interface EntiteImmuable {\n  readonly uuid: string;\n}\n\nclass Fichier implements EntiteImmuable {\n  constructor(public readonly uuid: string, public nom: string) {}\n}\n\nconst doc = new Fichier("550e8400-e29b-41d4-a716-446655440000", "notes.txt");\n// doc.uuid = "hacked"; // TS2540: Cannot assign to 'uuid' because it is a read-only property.\nconsole.log("Fichier immuable :", doc.nom, "| UUID :", doc.uuid);\n`,
      currentCode: `// 1. Déclarez interface EntiteImmuable avec readonly uuid: string;\n\n\n// 2. Créez la classe Fichier implements EntiteImmuable :\n\n\n// 3. Testez votre code (décommentez une fois la classe créée) :\n// const doc = new Fichier("550e8400-e29b-41d4-a716-446655440000", "notes.txt");\n// console.log("Fichier immuable :", doc.nom, "| UUID :", doc.uuid);\n`,
      isCompleted: false,
      solutionExplanation: [
        'Le modificateur `readonly` dans une interface impose que la valeur ne puisse plus être réassignée après instanciation.',
        'La classe concrète doit respecter ce verrou (en déclarant la propriété `readonly` dans son constructeur ou sa classe).',
        'Toute tentative de mutation ultérieure est bloquée avec l\'erreur `TS2540`.'
      ],
      criteria: [
        {
          id: 'c24-readonly-interface',
          label: 'readonly uuid dans EntiteImmuable',
          description: 'L\'interface doit comporter readonly uuid: string;',
          passed: false,
          hint: 'readonly uuid: string;'
        },
        {
          id: 'c24-class-match',
          label: 'Fichier implémente EntiteImmuable avec readonly',
          description: 'La classe Fichier doit respecter le contrat.',
          passed: false,
          hint: 'constructor(public readonly uuid: string, ...)'
        },
        {
          id: 'c24-log-uuid',
          label: 'Affichage de l\'UUID en console',
          description: 'La console doit afficher le nom et l\'UUID du fichier.',
          passed: false,
          hint: 'Vérifiez la console.'
        }
      ]
    },

    // =========================================================================
    // LABO 3 : Duck Typing & DTOs (4 ex)
    // =========================================================================
    {
      id: 'ex-3-1',
      labNumber: 3,
      number: '3.1',
      title: 'Conformité par la Forme (Duck Typing)',
      subtitle: 'Passer un objet anonyme sans classe à une fonction typée',
      sectionId: 'duck-typing-runtime-cost',
      estimatedTime: '4 min',
      difficulty: 'Débutant',
      statement:
        'Déclarez `interface Point2D { x: number; y: number; }`. Écrivez la fonction `calculerDistanceOrigine(pt: Point2D): number` renvoyant `Math.sqrt(pt.x * pt.x + pt.y * pt.y)`. Créez un simple objet littéral anonyme `const coord = { x: 3, y: 4 };` (sans classe ni constructeur) et passez-le à la fonction.',
      hint: 'TypeScript utilise le typage structurel : si l\'objet a la forme requise (x et y de type number), il est accepté sans qu\'aucune classe ne soit instanciée !',
      initialCode: `// 1. Déclarez l'interface Point2D { x: number; y: number; } :\n\n\n// 2. Déclarez la fonction calculerDistanceOrigine(pt: Point2D): number :\n\n\n// 3. Testez votre code (décommentez une fois l'interface et la fonction créées) :\n// const coord = { x: 3, y: 4 };\n// const distance = calculerDistanceOrigine(coord);\n// console.log("Distance de l'origine :", distance);\n`,
      solutionCode: `interface Point2D {\n  x: number;\n  y: number;\n}\n\nfunction calculerDistanceOrigine(pt: Point2D): number {\n  return Math.sqrt(pt.x * pt.x + pt.y * pt.y);\n}\n\nconst coord = { x: 3, y: 4 };\nconst distance = calculerDistanceOrigine(coord);\nconsole.log("Distance de l'origine :", distance);\n`,
      currentCode: `// 1. Déclarez l'interface Point2D { x: number; y: number; } :\n\n\n// 2. Déclarez la fonction calculerDistanceOrigine(pt: Point2D): number :\n\n\n// 3. Testez votre code (décommentez une fois l'interface et la fonction créées) :\n// const coord = { x: 3, y: 4 };\n// const distance = calculerDistanceOrigine(coord);\n// console.log("Distance de l'origine :", distance);\n`,
      isCompleted: false,
      solutionExplanation: [
        'En Java ou C#, un objet doit explicitement déclarer `implements Point2D` (typage nominal).',
        'En TypeScript, le typage est structurel : "If it walks like a duck and quacks like a duck, it\'s a duck".',
        'L\'objet JSON `{ x: 3, y: 4 }` possède les propriétés `x` et `y` : il est donc immédiatement compatible, sans coût d\'allocation de classe.'
      ],
      criteria: [
        {
          id: 'c31-point2d-def',
          label: 'Interface Point2D avec x et y',
          description: 'Point2D doit comporter x: number et y: number.',
          passed: false,
          hint: 'interface Point2D { x: number; y: number; }'
        },
        {
          id: 'c31-function-param',
          label: 'Fonction acceptant Point2D',
          description: 'calculerDistanceOrigine doit recevoir un argument typé Point2D.',
          passed: false,
          hint: 'calculerDistanceOrigine(pt: Point2D): number'
        },
        {
          id: 'c31-result-5',
          label: 'Distance calculée égale à 5',
          description: 'La racine carrée de 3² + 4² = 25 est 5. La console doit afficher 5.',
          passed: false,
          hint: 'Vérifiez la console.'
        }
      ]
    },
    {
      id: 'ex-3-2',
      labNumber: 3,
      number: '3.2',
      title: 'Tolérance des Propriétés Excédentaires',
      subtitle: 'Comprendre pourquoi TypeScript accepte les objets enrichis',
      sectionId: 'duck-typing-runtime-cost',
      estimatedTime: '5 min',
      difficulty: 'Facile',
      statement:
        'Soit `interface Identifiable { id: string; nom: string; }` et la fonction `saluer(entite: Identifiable): string` renvoyant `"Bonjour " + entite.nom + " (#" + entite.id + ")"`. Créez une variable `const utilisateurComplet = { id: "U1", nom: "Sarah", role: "ADMIN", token: "xyz789", age: 30 };`. Passez cette variable à `saluer()` et vérifiez que TypeScript l\'accepte avec succès.',
      hint: 'Tant que les propriétés requises sont présentes avec le bon type, la présence de propriétés supplémentaires n\'invalide pas le contrat.',
      initialCode: `interface Identifiable {\n  id: string;\n  nom: string;\n}\n\n// 1. Codez la fonction saluer(entite: Identifiable): string :\n\n\n// 2. Testez avec un objet enrichi (décommentez une fois la fonction créée) :\n// const utilisateurComplet = {\n//   id: "U1",\n//   nom: "Sarah",\n//   role: "ADMIN",\n//   token: "xyz789",\n//   age: 30\n// };\n// console.log(saluer(utilisateurComplet));\n`,
      solutionCode: `interface Identifiable {\n  id: string;\n  nom: string;\n}\n\nfunction saluer(entite: Identifiable): string {\n  return "Bonjour " + entite.nom + " (#" + entite.id + ")";\n}\n\nconst utilisateurComplet = {\n  id: "U1",\n  nom: "Sarah",\n  role: "ADMIN",\n  token: "xyz789",\n  age: 30\n};\n\nconsole.log(saluer(utilisateurComplet));\n`,
      currentCode: `interface Identifiable {\n  id: string;\n  nom: string;\n}\n\n// 1. Codez la fonction saluer(entite: Identifiable): string :\n\n\n// 2. Testez avec un objet enrichi (décommentez une fois la fonction créée) :\n// const utilisateurComplet = {\n//   id: "U1",\n//   nom: "Sarah",\n//   role: "ADMIN",\n//   token: "xyz789",\n//   age: 30\n// };\n// console.log(saluer(utilisateurComplet));\n`,
      isCompleted: false,
      solutionExplanation: [
        'En typage structurel, TypeScript vérifie que l\'objet passé contient **au minimum** ce qui est exigé par l\'interface.',
        'La présence de `role`, `token`, `age` ne dérange pas la fonction `saluer` : elle n\'utilisera que ce dont elle a besoin.',
        'Cela permet un découplage massif entre modules et facilite la manipulation de charges utiles API (DTO).'
      ],
      criteria: [
        {
          id: 'c32-saluer-fn',
          label: 'Fonction saluer avec contrat Identifiable',
          description: 'saluer doit accepter entite: Identifiable.',
          passed: false,
          hint: 'function saluer(entite: Identifiable): string'
        },
        {
          id: 'c32-extra-props',
          label: 'Objet avec propriétés excédentaires',
          description: 'utilisateurComplet doit avoir id, nom et des champs en plus.',
          passed: false,
          hint: 'id, nom, role, token'
        },
        {
          id: 'c32-output-greeting',
          label: 'Salutation affichée avec succès',
          description: 'La console doit afficher : Bonjour Sarah (#U1).',
          passed: false,
          hint: 'Vérifiez la console.'
        }
      ]
    },
    {
      id: 'ex-3-3',
      labNumber: 3,
      number: '3.3',
      title: 'Typage d\'un DTO API Générique',
      subtitle: 'Modéliser une enveloppe de réponse serveur avec paramètre de type',
      sectionId: 'duck-typing-runtime-cost',
      estimatedTime: '5 min',
      difficulty: 'Intermédiaire',
      statement:
        'Créez l\'interface générique `ReponseServeur<T>` avec `statut: number`, une charge utile optionnelle `data?: T`, et un message optionnel `erreur?: string`. Écrivez une fonction `traiterReponse(res: ReponseServeur<{ token: string }>): void` qui affiche le token si statut === 200, ou l\'erreur sinon. Testez avec une réponse valide.',
      hint: 'Utilisez `interface ReponseServeur<T> { statut: number; data?: T; erreur?: string; }`.',
      initialCode: `// 1. Déclarez l'interface générique ReponseServeur<T> :\n\n\n// 2. Déclarez la fonction traiterReponse(res: ReponseServeur<{ token: string }>): void :\n\n\n// 3. Testez votre code (décommentez une fois la fonction créée) :\n// const rep = {\n//   statut: 200,\n//   data: { token: "auth_token_abc_123" }\n// };\n// traiterReponse(rep);\n`,
      solutionCode: `interface ReponseServeur<T> {\n  statut: number;\n  data?: T;\n  erreur?: string;\n}\n\nfunction traiterReponse(res: ReponseServeur<{ token: string }>): void {\n  if (res.statut === 200 && res.data) {\n    console.log("Token reçu :", res.data.token);\n  } else {\n    console.error("Erreur serveur :", res.erreur);\n  }\n}\n\nconst rep = {\n  statut: 200,\n  data: { token: "auth_token_abc_123" }\n};\n\ntraiterReponse(rep);\n`,
      currentCode: `// 1. Déclarez l'interface générique ReponseServeur<T> :\n\n\n// 2. Déclarez la fonction traiterReponse(res: ReponseServeur<{ token: string }>): void :\n\n\n// 3. Testez votre code (décommentez une fois la fonction créée) :\n// const rep = {\n//   statut: 200,\n//   data: { token: "auth_token_abc_123" }\n// };\n// traiterReponse(rep);\n`,
      isCompleted: false,
      solutionExplanation: [
        'Les DTOs (Data Transfer Objects) sont les cas d\'usage rois des interfaces en TypeScript.',
        'La généricité `<T>` permet de réutiliser le squelette HTTP (`statut`, `erreur`) pour n\'importe quel type de payload (`data`).',
        'Au runtime JavaScript, cette interface disparaît totalement (0 octet dans le bundle !).'
      ],
      criteria: [
        {
          id: 'c33-generic-dto',
          label: 'Interface générique ReponseServeur<T>',
          description: 'L\'interface doit avoir statut, data? et erreur?.',
          passed: false,
          hint: 'interface ReponseServeur<T> { ... }'
        },
        {
          id: 'c33-payload-handling',
          label: 'Fonction traitant le token',
          description: 'traiterReponse doit extraire res.data.token.',
          passed: false,
          hint: 'console.log("Token reçu :", res.data.token);'
        },
        {
          id: 'c33-token-logged',
          label: 'Token affiché en console',
          description: 'La console doit afficher auth_token_abc_123.',
          passed: false,
          hint: 'Vérifiez la console.'
        }
      ]
    },
    {
      id: 'ex-3-4',
      labNumber: 3,
      number: '3.4',
      title: 'Strict Excess Property Check & Contournement',
      subtitle: 'Comprendre la nuance entre objet littéral direct et assignation via variable',
      sectionId: 'duck-typing-runtime-cost',
      estimatedTime: '5 min',
      difficulty: 'Intermédiaire',
      statement:
        'Soit `interface ConfigOption { debug: boolean; port: number; }`. Si vous tentez `const conf: ConfigOption = { debug: true, port: 8080, logPath: "/var/log" };`, TypeScript rejette le code (TS2353 Excess property check). Corrigez ce problème en déclarant d\'abord un objet intermédiaire `const optionsBrutes = { debug: true, port: 8080, logPath: "/var/log" };`, puis en assignant `const conf: ConfigOption = optionsBrutes;`. Affichez `conf.port`.',
      hint: 'TypeScript applique une vérification stricte immédiate uniquement sur les objets littéraux directs. Dès qu\'un objet transite par une variable intermédiaire, le duck typing standard reprend le dessus.',
      initialCode: `interface ConfigOption {\n  debug: boolean;\n  port: number;\n}\n\n// Corrigez en créant d'abord un objet intermédiaire optionsBrutes sans typage direct,\n// puis assignez-le à conf: ConfigOption :\n\n\n// console.log("Port configuré :", conf.port);\n`,
      solutionCode: `interface ConfigOption {\n  debug: boolean;\n  port: number;\n}\n\n// Déclaration via variable intermédiaire pour contourner l'excess property check direct :\nconst optionsBrutes = {\n  debug: true,\n  port: 8080,\n  logPath: "/var/log"\n};\n\nconst conf: ConfigOption = optionsBrutes;\n\nconsole.log("Port configuré :", conf.port);\n`,
      currentCode: `interface ConfigOption {\n  debug: boolean;\n  port: number;\n}\n\n// Corrigez en créant d'abord un objet intermédiaire optionsBrutes sans typage direct,\n// puis assignez-le à conf: ConfigOption :\n\n\n// console.log("Port configuré :", conf.port);\n`,
      isCompleted: false,
      solutionExplanation: [
        'Lors d\'une assignation directe d\'un objet littéral `{ ... }`, TypeScript suppose que si vous tapez une propriété inconnue, c\'est probablement une faute de frappe (`TS2353`).',
        'En revanche, lors de l\'assignation d\'une variable existante (`optionsBrutes`), TypeScript applique le pur sous-typage structurel : les surplus sont tolérés.',
        'Comprendre cette distinction évite de perdre des heures à chercher pourquoi un code littéral est refusé alors qu\'une variable est acceptée.'
      ],
      criteria: [
        {
          id: 'c34-intermediate-var',
          label: 'Variable intermédiaire déclarée',
          description: 'optionsBrutes doit contenir debug, port et logPath.',
          passed: false,
          hint: 'const optionsBrutes = { debug: true, port: 8080, logPath: "/var/log" };'
        },
        {
          id: 'c34-typed-conf',
          label: 'Assignation typée ConfigOption',
          description: 'conf: ConfigOption = optionsBrutes;',
          passed: false,
          hint: 'const conf: ConfigOption = optionsBrutes;'
        },
        {
          id: 'c34-port-logged',
          label: 'Port 8080 affiché',
          description: 'La console doit afficher Port configuré : 8080.',
          passed: false,
          hint: 'Vérifiez la console.'
        }
      ]
    },

    // =========================================================================
    // LABO 4 : Déjouer les Pièges & Type Guards (4 ex)
    // =========================================================================
    {
      id: 'ex-4-1',
      labNumber: 4,
      number: '4.1',
      title: 'Diagnostiquer le Piège instanceof sur Interface',
      subtitle: 'Constater l\'erreur TS2693 causée par l\'effacement de type',
      sectionId: 'pitfalls-type-guards',
      estimatedTime: '4 min',
      difficulty: 'Débutant',
      statement:
        'Soit `interface Jouable { jouer(): void; }`. Observez la tentative `if (x instanceof Jouable)` qui déclenche l\'erreur de compilation `TS2693: \'Jouable\' only refers to a type, but is being used as a value here`. Remplacez cette vérification erronée par un test runtime sur la présence de la méthode : `typeof x.jouer === "function"`.',
      hint: 'Comme les interfaces s\'évaporent en JavaScript (Type Erasure), le symbole `Jouable` n\'existe pas en mémoire au runtime. L\'opérateur `instanceof` ne fonctionne qu\'avec des classes (constructeurs JS réels) !',
      initialCode: `interface Jouable {\n  jouer(): void;\n}\n\nconst instrument: any = {\n  nom: "Guitare",\n  jouer() { console.log("Musique live !"); }\n};\n\n// Corrigez en vérifiant la présence de la méthode avec typeof au lieu de instanceof :\n\n`,
      solutionCode: `interface Jouable {\n  jouer(): void;\n}\n\nconst instrument: any = {\n  nom: "Guitare",\n  jouer() { console.log("Musique live !"); }\n};\n\n// Correction propre sans instanceof :\nif (typeof instrument.jouer === "function") {\n  instrument.jouer();\n}\n`,
      currentCode: `interface Jouable {\n  jouer(): void;\n}\n\nconst instrument: any = {\n  nom: "Guitare",\n  jouer() { console.log("Musique live !"); }\n};\n\n// Corrigez en vérifiant la présence de la méthode avec typeof au lieu de instanceof :\n\n`,
      isCompleted: false,
      solutionExplanation: [
        'En JavaScript généré, l\'interface a totalement disparu : il n\'y a ni fonction, ni prototype, ni objet `Jouable`.',
        'Faire `instanceof Jouable` est une erreur de compilation TypeScript (`TS2693`) et provoquerait un `ReferenceError` fatal en JavaScript.',
        'Pour vérifier la conformité à une interface au runtime, on doit tester la forme de l\'objet (`in` ou `typeof`).'
      ],
      criteria: [
        {
          id: 'c41-no-instanceof',
          label: 'Aucun instanceof sur l\'interface',
          description: 'Le code ne doit pas contenir instanceof Jouable.',
          passed: false,
          hint: 'Supprimez ou commentez tout instanceof Jouable.'
        },
        {
          id: 'c41-runtime-check',
          label: 'Test runtime typeof jouer === "function"',
          description: 'La vérification doit vérifier que la méthode est une fonction.',
          passed: false,
          hint: 'typeof instrument.jouer === "function"'
        },
        {
          id: 'c41-jouer-output',
          label: 'Méthode jouer exécutée',
          description: 'La console doit afficher : Musique live !.',
          passed: false,
          hint: 'Vérifiez la console.'
        }
      ]
    },
    {
      id: 'ex-4-2',
      labNumber: 4,
      number: '4.2',
      title: 'Créer un User-Defined Type Guard',
      subtitle: 'Enseigner au compilateur comment identifier une interface au runtime',
      sectionId: 'pitfalls-type-guards',
      estimatedTime: '6 min',
      difficulty: 'Intermédiaire',
      statement:
        'Soit `interface Soigneur { soigner(cible: string): string; }`. Écrivez la fonction de garde de type : `function isSoigneur(cible: any): cible is Soigneur`. La fonction doit renvoyer `true` si `cible` existe, n\'est pas nulle, et que `typeof cible.soigner === "function"`. Testez avec un objet compatible.',
      hint: 'La syntaxe du prédicat de type est `param is Type` dans le retour de la fonction.',
      initialCode: `interface Soigneur {\n  soigner(cible: string): string;\n}\n\n// 1. Écrivez la fonction Type Guard function isSoigneur(cible: any): cible is Soigneur :\n\n\n// 2. Testez votre code (décommentez une fois le guard créé) :\n// const hero1 = { nom: "Merlin", soigner: (c: string) => "Soin apporté à " + c };\n// const hero2 = { nom: "Conan", force: 50 };\n// console.log("hero1 est Soigneur ?", isSoigneur(hero1));\n// console.log("hero2 est Soigneur ?", isSoigneur(hero2));\n`,
      solutionCode: `interface Soigneur {\n  soigner(cible: string): string;\n}\n\nfunction isSoigneur(cible: any): cible is Soigneur {\n  return Boolean(cible && typeof cible.soigner === "function");\n}\n\nconst hero1 = { nom: "Merlin", soigner: (c: string) => "Soin apporté à " + c };\nconst hero2 = { nom: "Conan", force: 50 };\n\nconsole.log("hero1 est Soigneur ?", isSoigneur(hero1));\nconsole.log("hero2 est Soigneur ?", isSoigneur(hero2));\n`,
      currentCode: `interface Soigneur {\n  soigner(cible: string): string;\n}\n\n// 1. Écrivez la fonction Type Guard function isSoigneur(cible: any): cible is Soigneur :\n\n\n// 2. Testez votre code (décommentez une fois le guard créé) :\n// const hero1 = { nom: "Merlin", soigner: (c: string) => "Soin apporté à " + c };\n// const hero2 = { nom: "Conan", force: 50 };\n// console.log("hero1 est Soigneur ?", isSoigneur(hero1));\n// console.log("hero2 est Soigneur ?", isSoigneur(hero2));\n`,
      isCompleted: false,
      solutionExplanation: [
        'La signature spéciale `cible is Soigneur` indique au compilateur TypeScript : "si cette fonction renvoie true, alors considère que cible est de type Soigneur".',
        'Cela permet un rétrécissement de type automatique (*Type Narrowing*).',
        'C\'est la solution canonique et professionnelle pour remplacer le `instanceof` manquant sur les interfaces.'
      ],
      criteria: [
        {
          id: 'c42-guard-signature',
          label: 'Prédicat de type cible is Soigneur',
          description: 'La signature doit comporter cible is Soigneur.',
          passed: false,
          hint: 'function isSoigneur(cible: any): cible is Soigneur'
        },
        {
          id: 'c42-shape-check',
          label: 'Vérification de la présence de la méthode soigner',
          description: 'Le corps doit tester typeof cible.soigner === "function".',
          passed: false,
          hint: 'cible && typeof cible.soigner === "function"'
        },
        {
          id: 'c42-guard-results',
          label: 'hero1 reconnu true et hero2 reconnu false',
          description: 'La console doit afficher true pour Merlin et false pour Conan.',
          passed: false,
          hint: 'Vérifiez la console.'
        }
      ]
    },
    {
      id: 'ex-4-3',
      labNumber: 4,
      number: '4.3',
      title: 'Utilisation Sécurisée & Type Narrowing',
      subtitle: 'Invoquer la méthode sans forcer de cast risqué (as)',
      sectionId: 'pitfalls-type-guards',
      estimatedTime: '5 min',
      difficulty: 'Intermédiaire',
      statement:
        'En utilisant le Type Guard `isSoigneur` créé précédemment, écrivez une fonction `declencherSoinSiPossible(personnage: any, blessé: string): void`. À l\'intérieur d\'un bloc `if (isSoigneur(personnage))`, appelez directement `personnage.soigner(blessé)` sans aucun cast `as`. Testez avec un soigneur et un non-soigneur.',
      hint: 'Grâce au Type Guard, TypeScript comprend que dans le bloc if, `personnage` possède obligatoirement la méthode `soigner`. Aucun `as Soigneur` n\'est nécessaire.',
      initialCode: `interface Soigneur {\n  soigner(cible: string): string;\n}\n\nfunction isSoigneur(cible: any): cible is Soigneur {\n  return Boolean(cible && typeof cible.soigner === "function");\n}\n\n// 1. Codez declencherSoinSiPossible(personnage: any, blessé: string): void en utilisant isSoigneur :\n\n\n// 2. Testez votre code (décommentez une fois la fonction créée) :\n// const mage = { nom: "Gandalf", soigner: (cible: string) => "Lumière divine sur " + cible };\n// const orc = { nom: "Azog", hache: "Tranchante" };\n// declencherSoinSiPossible(mage, "Frodon");\n// declencherSoinSiPossible(orc, "Frodon");\n`,
      solutionCode: `interface Soigneur {\n  soigner(cible: string): string;\n}\n\nfunction isSoigneur(cible: any): cible is Soigneur {\n  return Boolean(cible && typeof cible.soigner === "function");\n}\n\nfunction declencherSoinSiPossible(personnage: any, blessé: string): void {\n  if (isSoigneur(personnage)) {\n    console.log(personnage.soigner(blessé));\n  } else {\n    console.log("Action impossible :", personnage.nom, "ne sait pas soigner !");\n  }\n}\n\nconst mage = { nom: "Gandalf", soigner: (cible: string) => "Lumière divine sur " + cible };\nconst orc = { nom: "Azog", hache: "Tranchante" };\n\ndeclencherSoinSiPossible(mage, "Frodon");\ndeclencherSoinSiPossible(orc, "Frodon");\n`,
      currentCode: `interface Soigneur {\n  soigner(cible: string): string;\n}\n\nfunction isSoigneur(cible: any): cible is Soigneur {\n  return Boolean(cible && typeof cible.soigner === "function");\n}\n\n// 1. Codez declencherSoinSiPossible(personnage: any, blessé: string): void en utilisant isSoigneur :\n\n\n// 2. Testez votre code (décommentez une fois la fonction créée) :\n// const mage = { nom: "Gandalf", soigner: (cible: string) => "Lumière divine sur " + cible };\n// const orc = { nom: "Azog", hache: "Tranchante" };\n// declencherSoinSiPossible(mage, "Frodon");\n// declencherSoinSiPossible(orc, "Frodon");\n`,
      isCompleted: false,
      solutionExplanation: [
        'Le casting forcé `(personnage as Soigneur).soigner(...)` est une bombe à retardement s\'il est appliqué à l\'aveugle.',
        'Avec le Type Guard, le compilateur garantit l\'innocuité de l\'appel à la compilation ET à l\'exécution.',
        'La lisibilité du code est optimale et respecte les principes de défense en profondeur.'
      ],
      criteria: [
        {
          id: 'c43-guard-used',
          label: 'Condition avec isSoigneur(personnage)',
          description: 'La fonction doit conditionner l\'appel avec isSoigneur.',
          passed: false,
          hint: 'if (isSoigneur(personnage)) { ... }'
        },
        {
          id: 'c43-safe-call',
          label: 'Appel sécurisé sans cast as',
          description: 'L\'appel doit invoquer .soigner(blessé).',
          passed: false,
          hint: 'personnage.soigner(blessé)'
        },
        {
          id: 'c43-both-tested',
          label: 'Gestion des cas soigneur et non-soigneur',
          description: 'La console doit afficher le soin réussi de Gandalf et le refus pour Azog.',
          passed: false,
          hint: 'Vérifiez la console.'
        }
      ]
    },
    {
      id: 'ex-4-4',
      labNumber: 4,
      number: '4.4',
      title: 'Refactorisation ISP (Interface Segregation)',
      subtitle: 'Découper une interface obèse en micro-contrats modulaires',
      sectionId: 'pitfalls-type-guards',
      estimatedTime: '6 min',
      difficulty: 'Avancé',
      statement:
        'Soit une interface monolithique polluée `interface MonstreuxMachine { imprimer(): void; faxer(): void; agrafer(): void; }`. Une simple imprimante thermique est forcée de lever des erreurs sur faxer() ! Découpez cette interface en 3 micro-interfaces ciblées (`Imprimant`, `Faxant`, `Agrafant`). Implémentez ensuite la classe `ImprimanteThermique` qui ne signe QUE `implements Imprimant`.',
      hint: 'Principe ISP : Aucun client ne devrait être forcé de dépendre de méthodes qu\'il n\'utilise pas.',
      initialCode: `// 1. Créez les 3 micro-interfaces ciblées : Imprimant, Faxant, Agrafant :\n\n\n// 2. Créez la classe ImprimanteThermique signant UNIQUEMENT Imprimant :\n\n\n// 3. Testez votre code (décommentez une fois la classe créée) :\n// const ticket = new ImprimanteThermique();\n// ticket.imprimer();\n`,
      solutionCode: `interface Imprimant {\n  imprimer(): void;\n}\n\ninterface Faxant {\n  faxer(): void;\n}\n\ninterface Agrafant {\n  agrafer(): void;\n}\n\nclass ImprimanteThermique implements Imprimant {\n  imprimer(): void {\n    console.log("Impression du ticket de caisse thermique...");\n  }\n}\n\nconst ticket = new ImprimanteThermique();\nticket.imprimer();\n`,
      currentCode: `// 1. Créez les 3 micro-interfaces ciblées : Imprimant, Faxant, Agrafant :\n\n\n// 2. Créez la classe ImprimanteThermique signant UNIQUEMENT Imprimant :\n\n\n// 3. Testez votre code (décommentez une fois la classe créée) :\n// const ticket = new ImprimanteThermique();\n// ticket.imprimer();\n`,
      isCompleted: false,
      solutionExplanation: [
        'Le principe ISP (Interface Segregation Principle - le "I" de SOLID) préconise des interfaces légères et hautement cohésives.',
        'Quand une interface est trop grosse, les classes simples se retrouvent avec du code mort ou lèvent des `throw new Error("Non supporté")`.',
        'En scindant en `Imprimant`, `Faxant`, `Agrafant`, chaque appareil ne signe et ne livre que ses vraies compétences.'
      ],
      criteria: [
        {
          id: 'c44-segregated-interfaces',
          label: 'Trois micro-interfaces distinctes',
          description: 'Imprimant, Faxant et Agrafant doivent être déclarées.',
          passed: false,
          hint: 'interface Imprimant, interface Faxant, interface Agrafant'
        },
        {
          id: 'c44-only-imprimant',
          label: 'ImprimanteThermique implements Imprimant uniquement',
          description: 'La classe ne doit implémenter que l\'impression.',
          passed: false,
          hint: 'class ImprimanteThermique implements Imprimant'
        },
        {
          id: 'c44-clean-run',
          label: 'Impression exécutée sans code mort ni exception',
          description: 'La console doit afficher le ticket de caisse thermique.',
          passed: false,
          hint: 'Vérifiez la console.'
        }
      ]
    },

    // =========================================================================
    // LABO 5 : Architecture Hybride & Découplage (4 ex)
    // =========================================================================
    {
      id: 'ex-5-1',
      labNumber: 5,
      number: '5.1',
      title: 'Le Squelette Abstrait (Pattern Hybride Pro)',
      subtitle: 'Interface pour le contrat public + Classe Abstraite pour le boilerplate',
      sectionId: 'decision-tree-hybrid',
      estimatedTime: '5 min',
      difficulty: 'Facile',
      statement:
        'Déclarez l\'interface publique `Exportable` avec `exporter(): string;`. Créez ensuite la classe abstraite `DocumentBase implements Exportable`. Elle factorise le constructeur avec `public titre: string` et une méthode concrète `obtenirDateCreation(): string` renvoyant `"2026-09-22"`. Laissez `exporter()` abstraite dans la classe de base.',
      hint: 'La classe abstraite signe l\'interface (`implements Exportable`) et fournit la factorisation d\'état tout en gardant `abstract exporter(): string;`.',
      initialCode: `// 1. Déclarez l'interface publique Exportable { exporter(): string; } :\n\n\n// 2. Déclarez la classe abstraite DocumentBase implements Exportable :\n\n\n// console.log("Squelette hybride configuré !");\n`,
      solutionCode: `interface Exportable {\n  exporter(): string;\n}\n\nabstract class DocumentBase implements Exportable {\n  constructor(public titre: string) {}\n\n  obtenirDateCreation(): string {\n    return "2026-09-22";\n  }\n\n  abstract exporter(): string;\n}\n\nconsole.log("Squelette hybride configuré !");\n`,
      currentCode: `// 1. Déclarez l'interface publique Exportable { exporter(): string; } :\n\n\n// 2. Déclarez la classe abstraite DocumentBase implements Exportable :\n\n\n// console.log("Squelette hybride configuré !");\n`,
      isCompleted: false,
      solutionExplanation: [
        'C\'est le pattern le plus populaire des architectures professionnelles (ex: Angular Router, Spring, DotNet).',
        'L\'interface `Exportable` sert d\'API publique et permet d\'isoler complètement les consommateurs des détails d\'implémentation.',
        'La classe abstraite `DocumentBase` évite le code dupliqué en stockant le titre et la logique commune de date.'
      ],
      criteria: [
        {
          id: 'c51-exportable-iface',
          label: 'Interface Exportable déclarée',
          description: 'Exportable doit exiger exporter(): string;',
          passed: false,
          hint: 'interface Exportable { exporter(): string; }'
        },
        {
          id: 'c51-docbase-abstract',
          label: 'abstract class DocumentBase implements Exportable',
          description: 'DocumentBase doit être abstraite et implémenter Exportable.',
          passed: false,
          hint: 'abstract class DocumentBase implements Exportable'
        },
        {
          id: 'c51-state-factoring',
          label: 'Constructeur titre et méthode de date',
          description: 'DocumentBase doit factoriser titre et obtenirDateCreation().',
          passed: false,
          hint: 'constructor(public titre: string) {}'
        }
      ]
    },
    {
      id: 'ex-5-2',
      labNumber: 5,
      number: '5.2',
      title: 'Concrétisation des Formats',
      subtitle: 'Spécialiser la méthode d\'export dans chaque format concret',
      sectionId: 'decision-tree-hybrid',
      estimatedTime: '5 min',
      difficulty: 'Facile',
      statement:
        'En prolongeant `DocumentBase`, créez `DocumentPDF` (dont `exporter()` retourne `"[PDF] " + this.titre`) et `DocumentMarkdown` (dont `exporter()` retourne `"# " + this.titre`). Instanciez les deux et affichez leur export respectif.',
      hint: 'Chaque classe hérite de `DocumentBase` avec `extends DocumentBase` et bénéficie automatiquement de la factorisation du titre via `super(titre)`.',
      initialCode: `interface Exportable {\n  exporter(): string;\n}\n\nabstract class DocumentBase implements Exportable {\n  constructor(public titre: string) {}\n  abstract exporter(): string;\n}\n\n// 1. Créez DocumentPDF extends DocumentBase\n\n\n// 2. Créez DocumentMarkdown extends DocumentBase\n\n\n// 3. Testez votre code (décommentez une fois les classes créées) :\n// const doc1 = new DocumentPDF("Facture_Septembre");\n// const doc2 = new DocumentMarkdown("Documentation");\n// console.log(doc1.exporter());\n// console.log(doc2.exporter());\n`,
      solutionCode: `interface Exportable {\n  exporter(): string;\n}\n\nabstract class DocumentBase implements Exportable {\n  constructor(public titre: string) {}\n  abstract exporter(): string;\n}\n\nclass DocumentPDF extends DocumentBase {\n  exporter(): string {\n    return "[PDF] " + this.titre;\n  }\n}\n\nclass DocumentMarkdown extends DocumentBase {\n  exporter(): string {\n    return "# " + this.titre;\n  }\n}\n\nconst doc1 = new DocumentPDF("Facture_Septembre");\nconst doc2 = new DocumentMarkdown("Documentation");\n\nconsole.log(doc1.exporter());\nconsole.log(doc2.exporter());\n`,
      currentCode: `interface Exportable {\n  exporter(): string;\n}\n\nabstract class DocumentBase implements Exportable {\n  constructor(public titre: string) {}\n  abstract exporter(): string;\n}\n\n// 1. Créez DocumentPDF extends DocumentBase\n\n\n// 2. Créez DocumentMarkdown extends DocumentBase\n\n\n// 3. Testez votre code (décommentez une fois les classes créées) :\n// const doc1 = new DocumentPDF("Facture_Septembre");\n// const doc2 = new DocumentMarkdown("Documentation");\n// console.log(doc1.exporter());\n// console.log(doc2.exporter());\n`,
      isCompleted: false,
      solutionExplanation: [
        'Les sous-classes n\'ont pas besoin de réécrire le constructeur si elles ne font que relayer le paramètre `titre` ! Le constructeur parent est automatiquement hérité.',
        'Chaque sous-classe n\'a qu\'une seule responsabilité : fournir l\'implémentation précise de sa sérialisation (`[PDF]`, `# Markdown`).'
      ],
      criteria: [
        {
          id: 'c52-pdf-class',
          label: 'Classe DocumentPDF héritant de DocumentBase',
          description: 'DocumentPDF doit implémenter exporter() avec le format [PDF].',
          passed: false,
          hint: 'return "[PDF] " + this.titre;'
        },
        {
          id: 'c52-md-class',
          label: 'Classe DocumentMarkdown héritant de DocumentBase',
          description: 'DocumentMarkdown doit implémenter exporter() avec le format markdown.',
          passed: false,
          hint: 'return "# " + this.titre;'
        },
        {
          id: 'c52-output-both',
          label: 'Exports affichés en console',
          description: 'La console doit afficher [PDF] Facture_Septembre et # Documentation.',
          passed: false,
          hint: 'Vérifiez la console.'
        }
      ]
    },
    {
      id: 'ex-5-3',
      labNumber: 5,
      number: '5.3',
      title: 'Collection Polymorphe Agnostique',
      subtitle: 'Traiter une collection hétérogène sans aucun if ni switch',
      sectionId: 'decision-tree-hybrid',
      estimatedTime: '5 min',
      difficulty: 'Intermédiaire',
      statement:
        'Écrivez la fonction `exporterTous(documents: Exportable[]): string[]`. Elle prend un tableau de contrats `Exportable[]` et retourne le tableau des résultats d\'export en utilisant `.map(d => d.exporter())`. Il est STRICTEMENT INTERDIT d\'utiliser un `if`, un `switch` ou `instanceof`. Testez avec un tableau contenant un PDF et un Markdown.',
      hint: 'C\'est l\'essence du polymorphisme : la fonction ne sait ni ne veut savoir quelle classe concrète est traitée ; elle appelle juste le contrat .exporter().',
      initialCode: `interface Exportable {\n  exporter(): string;\n}\n\nabstract class DocumentBase implements Exportable {\n  constructor(public titre: string) {}\n  abstract exporter(): string;\n}\n\nclass DocumentPDF extends DocumentBase {\n  exporter(): string { return "[PDF] " + this.titre; }\n}\n\nclass DocumentMarkdown extends DocumentBase {\n  exporter(): string { return "# " + this.titre; }\n}\n\n// 1. Écrivez la fonction polymorphe exporterTous(documents: Exportable[]): string[] :\n\n\n// 2. Testez votre code (décommentez une fois la fonction créée) :\n// const liste: Exportable[] = [\n//   new DocumentPDF("Bilan"),\n//   new DocumentMarkdown("Guide")\n// ];\n// console.log(exporterTous(liste));\n`,
      solutionCode: `interface Exportable {\n  exporter(): string;\n}\n\nabstract class DocumentBase implements Exportable {\n  constructor(public titre: string) {}\n  abstract exporter(): string;\n}\n\nclass DocumentPDF extends DocumentBase {\n  exporter(): string { return "[PDF] " + this.titre; }\n}\n\nclass DocumentMarkdown extends DocumentBase {\n  exporter(): string { return "# " + this.titre; }\n}\n\nfunction exporterTous(documents: Exportable[]): string[] {\n  return documents.map(d => d.exporter());\n}\n\nconst liste: Exportable[] = [\n  new DocumentPDF("Bilan"),\n  new DocumentMarkdown("Guide")\n];\n\nconsole.log(exporterTous(liste));\n`,
      currentCode: `interface Exportable {\n  exporter(): string;\n}\n\nabstract class DocumentBase implements Exportable {\n  constructor(public titre: string) {}\n  abstract exporter(): string;\n}\n\nclass DocumentPDF extends DocumentBase {\n  exporter(): string { return "[PDF] " + this.titre; }\n}\n\nclass DocumentMarkdown extends DocumentBase {\n  exporter(): string { return "# " + this.titre; }\n}\n\n// 1. Écrivez la fonction polymorphe exporterTous(documents: Exportable[]): string[] :\n\n\n// 2. Testez votre code (décommentez une fois la fonction créée) :\n// const liste: Exportable[] = [\n//   new DocumentPDF("Bilan"),\n//   new DocumentMarkdown("Guide")\n// ];\n// console.log(exporterTous(liste));\n`,
      isCompleted: false,
      solutionExplanation: [
        'Le type de paramètre `documents: Exportable[]` n\'est couplé ni à `DocumentBase`, ni à `DocumentPDF`.',
        'Le polymorphisme d\'interface élimine 100% des branchements conditionnels (`if`, `switch`).',
        'Le moteur JavaScript dispatch automatiquement l\'appel vers la méthode spécifique de chaque instance à l\'exécution.'
      ],
      criteria: [
        {
          id: 'c53-fn-signature',
          label: 'exporterTous accepte Exportable[]',
          description: 'La fonction doit recevoir documents: Exportable[].',
          passed: false,
          hint: 'function exporterTous(documents: Exportable[]): string[]'
        },
        {
          id: 'c53-no-conditions',
          label: 'Aucun if ni switch dans la fonction',
          description: 'Le code ne doit pas utiliser de conditions pour trier les types.',
          passed: false,
          hint: 'Utilisez simplement documents.map(d => d.exporter()).'
        },
        {
          id: 'c53-collected-array',
          label: 'Tableau des deux exports retourné',
          description: 'La console doit afficher [ "[PDF] Bilan", "# Guide" ].',
          passed: false,
          hint: 'Vérifiez la console.'
        }
      ]
    },
    {
      id: 'ex-5-4',
      labNumber: 5,
      number: '5.4',
      title: 'Extensibilité Sans Régression (OCP)',
      subtitle: 'Ajouter un nouveau format sans modifier une seule ligne du code existant',
      sectionId: 'decision-tree-hybrid',
      estimatedTime: '5 min',
      difficulty: 'Avancé',
      statement:
        'Prouvez le principe Ouvert/Fermé (OCP) : SANS TOUCHER à la fonction `exporterTous`, créez une nouvelle classe `FactureXML implements Exportable` (sans même hériter de DocumentBase si vous le souhaitez !) avec `constructor(public ref: string, public montant: number) {}` et `exporter(): string` retournant `"<facture ref=\'" + this.ref + "\'>" + this.montant + "€</facture>"`. Ajoutez-la à la liste et vérifiez le résultat.',
      hint: 'Grâce au typage structurel et au contrat d\'interface, n\'importe quel nouvel objet respectant `Exportable` est accepté immédiatement sans régression.',
      initialCode: `interface Exportable {\n  exporter(): string;\n}\n\nfunction exporterTous(documents: Exportable[]): string[] {\n  return documents.map(d => d.exporter());\n}\n\n// 1. Créez FactureXML implements Exportable sans modifier exporterTous :\n\n\n// 2. Testez votre code (décommentez une fois la classe créée) :\n// const items: Exportable[] = [\n//   new FactureXML("FAC-2026-001", 1250)\n// ];\n// console.log("Résultat OCP :", exporterTous(items));\n`,
      solutionCode: `interface Exportable {\n  exporter(): string;\n}\n\nfunction exporterTous(documents: Exportable[]): string[] {\n  return documents.map(d => d.exporter());\n}\n\nclass FactureXML implements Exportable {\n  constructor(public ref: string, public montant: number) {}\n\n  exporter(): string {\n    return "<facture ref='" + this.ref + "'>" + this.montant + "€</facture>";\n  }\n}\n\nconst items: Exportable[] = [\n  new FactureXML("FAC-2026-001", 1250)\n];\n\nconsole.log("Résultat OCP :", exporterTous(items));\n`,
      currentCode: `interface Exportable {\n  exporter(): string;\n}\n\nfunction exporterTous(documents: Exportable[]): string[] {\n  return documents.map(d => d.exporter());\n}\n\n// 1. Créez FactureXML implements Exportable sans modifier exporterTous :\n\n\n// 2. Testez votre code (décommentez une fois la classe créée) :\n// const items: Exportable[] = [\n//   new FactureXML("FAC-2026-001", 1250)\n// ];\n// console.log("Résultat OCP :", exporterTous(items));\n`,
      isCompleted: false,
      solutionExplanation: [
        'Le principe Ouvert/Fermé (Open/Closed Principle) : "Un module doit être ouvert à l\'extension mais fermé à la modification".',
        'Nous avons étendu le système avec un tout nouveau format XML sans risquer de casser la fonction `exporterTous`.',
        'C\'est la quintessence du découplage apporté par les interfaces et classes abstraites.'
      ],
      criteria: [
        {
          id: 'c54-facture-class',
          label: 'Classe FactureXML implémentant Exportable',
          description: 'FactureXML doit déclarer implements Exportable.',
          passed: false,
          hint: 'class FactureXML implements Exportable'
        },
        {
          id: 'c54-xml-format',
          label: 'Balise XML correcte dans exporter()',
          description: 'La méthode doit produire <facture ref=...>...€</facture>.',
          passed: false,
          hint: 'return "<facture ref=\'" + this.ref + "\'>" + this.montant + "€</facture>";'
        },
        {
          id: 'c54-ocp-success',
          label: 'Exécution sans modification de exporterTous',
          description: 'La console doit afficher le tableau avec la chaîne XML.',
          passed: false,
          hint: 'Vérifiez la console.'
        }
      ]
    }
  ]);

  readonly activeExercise = computed(() => {
    const list = this.exercises();
    const idx = this.activeExerciseIndex();
    return list[idx] || list[0];
  });

  readonly completedCount = computed(() => {
    return this.exercises().filter(e => e.isCompleted).length;
  });

  readonly totalCount = computed(() => {
    return this.exercises().length;
  });

  readonly progressPercentage = computed(() => {
    const total = this.totalCount();
    if (total === 0) return 0;
    return Math.round((this.completedCount() / total) * 100);
  });

  constructor() {
    this.loadFromStorage();
  }

  selectExercise(id: string): void {
    const index = this.exercises().findIndex(e => e.id === id);
    if (index !== -1) {
      this.activeExerciseIndex.set(index);
    }
  }

  setFilterLab(labNumber: number | null): void {
    this.filterLab.set(labNumber);
    const available = this.filteredExercises();
    if (available.length > 0) {
      this.selectExercise(available[0].id);
    }
  }

  readonly filteredExercises = computed(() => {
    const lab = this.filterLab();
    const list = this.exercises();
    if (lab === null) return list;
    return list.filter(e => e.labNumber === lab);
  });

  updateCurrentCode(exerciseId: string, code: string): void {
    this.exercises.update(list => {
      return list.map(ex => {
        if (ex.id === exerciseId) {
          return { ...ex, currentCode: code };
        }
        return ex;
      });
    });
    this.saveToStorage();
  }

  resetExercise(exerciseId: string): void {
    this.exercises.update(list => {
      return list.map(ex => {
        if (ex.id === exerciseId) {
          return {
            ...ex,
            currentCode: ex.initialCode,
            isCompleted: false,
            criteria: ex.criteria.map(c => ({ ...c, passed: false }))
          };
        }
        return ex;
      });
    });
    this.saveToStorage();
  }

  injectSolution(exerciseId: string): void {
    this.exercises.update(list => {
      return list.map(ex => {
        if (ex.id === exerciseId) {
          return { ...ex, currentCode: ex.solutionCode };
        }
        return ex;
      });
    });
    this.saveToStorage();
  }

  /**
   * Évalue le code de l'exercice avec la suite de critères automatiques
   */
  validateExercise(targetId: string, code: string): { success: boolean; logs: ConsoleLogEntry[]; error?: string } {
    const ex = this.exercises().find(e => e.id === targetId);
    if (!ex) {
      return { success: false, logs: [] };
    }

    const exec = this.transpiler.executeCode(code);
    const updatedCriteria = ex.criteria.map(c => ({ ...c }));
    let allPassed = false;

    switch (targetId) {
      // LABO 1 : Classes Abstraites & Signatures Pures
      case 'ex-1-1': {
        const hasAbstractClass = /abstract\s+class\s+Vehicule\b/.test(code);
        const hasConstructorMarque = /constructor\s*\([^)]*marque[^)]*\)/.test(code);
        // Doit ne pas tenter d'instancier new Vehicule non commenté
        const hasActiveNew = /(?<!\/\/.*)\bnew\s+Vehicule\s*\(/.test(code);
        const noActiveNew = !hasActiveNew;

        updatedCriteria[0].passed = hasAbstractClass;
        updatedCriteria[1].passed = hasConstructorMarque;
        updatedCriteria[2].passed = noActiveNew;
        allPassed = hasAbstractClass && hasConstructorMarque && noActiveNew && exec.success;
        break;
      }

      case 'ex-1-2': {
        const hasAbstractMethod = /abstract\s+demarrer\s*\([^)]*\)\s*:\s*string\s*;/.test(code) || /abstract\s+demarrer\s*\([^)]*\)\s*;/.test(code);
        const hasMotoClass = /class\s+Moto\s+extends\s+Vehicule\b/.test(code);
        const hasDemarrerImpl = /demarrer\s*\([^)]*\)\s*(?::\s*string)?\s*\{/.test(code);
        const hasLog = exec.logs.length > 0 && exec.logs.some(l => l.text.toLowerCase().includes('vroum') || l.text.toLowerCase().includes('démarrage') || l.text.length > 0);

        updatedCriteria[0].passed = hasAbstractMethod;
        updatedCriteria[1].passed = hasMotoClass && hasDemarrerImpl;
        updatedCriteria[2].passed = hasLog && exec.success;
        allPassed = hasAbstractMethod && hasMotoClass && hasDemarrerImpl && hasLog && exec.success;
        break;
      }

      case 'ex-1-3': {
        const hasSuper = /super\s*\(\s*marque\s*\)/.test(code) || /super\s*\([^)]+\)/.test(code);
        const hasPortes = /nombrePortes/.test(code);
        const hasLogOutput = exec.logs.some(l => l.text.includes('5') && (l.text.toLowerCase().includes('peugeot') || l.text.toLowerCase().includes('vrombissement') || l.text.includes('Portes')));

        updatedCriteria[0].passed = hasSuper;
        updatedCriteria[1].passed = hasPortes;
        updatedCriteria[2].passed = hasLogOutput && exec.success;
        allPassed = hasSuper && hasPortes && hasLogOutput && exec.success;
        break;
      }

      case 'ex-1-4': {
        const hasProtectedAbstract = /protected\s+abstract\s+calculerTaxe\s*\([^)]*\)\s*:\s*number\s*;/.test(code);
        const hasAfficherTTC = /afficherPrixTTC\s*\([^)]*\)/.test(code) && /calculerTaxe\s*\(\s*\)/.test(code);
        const hasCorrectResult = exec.logs.some(l => l.text.includes('20150'));

        updatedCriteria[0].passed = hasProtectedAbstract;
        updatedCriteria[1].passed = hasAfficherTTC;
        updatedCriteria[2].passed = hasCorrectResult && exec.success;
        allPassed = hasProtectedAbstract && hasAfficherTTC && hasCorrectResult && exec.success;
        break;
      }

      case 'ex-1-5': {
        const hasIntermAbstract = /abstract\s+class\s+VehiculeElectrique\s+extends\s+Vehicule\b/.test(code);
        const hasRechargerAbstract = /abstract\s+recharger\s*\([^)]*\)\s*:\s*string\s*;/.test(code);
        const hasTeslaConcrete = /class\s+Tesla\s+extends\s+VehiculeElectrique\b/.test(code);
        const hasCompleteOutput = exec.logs.some(l => l.text.includes('100') && (l.text.toLowerCase().includes('électrique') || l.text.toLowerCase().includes('recharge') || l.text.toLowerCase().includes('supercharger')));

        updatedCriteria[0].passed = hasIntermAbstract;
        updatedCriteria[1].passed = hasRechargerAbstract;
        updatedCriteria[2].passed = hasTeslaConcrete;
        updatedCriteria[3].passed = hasCompleteOutput && exec.success;
        allPassed = hasIntermAbstract && hasRechargerAbstract && hasTeslaConcrete && hasCompleteOutput && exec.success;
        break;
      }

      // LABO 2 : Interfaces & Multi-implémentation
      case 'ex-2-1': {
        const hasInterface = /interface\s+Connectable\b/.test(code) && /connecter\s*\([^)]*ip[^)]*\)\s*:\s*boolean/.test(code);
        const hasImplements = /class\s+ServeurWeb\s+implements\s+Connectable\b/.test(code);
        const hasOutput = exec.logs.some(l => l.text.includes('192.168.1.100') || l.text.includes('true'));

        updatedCriteria[0].passed = hasInterface;
        updatedCriteria[1].passed = hasImplements;
        updatedCriteria[2].passed = hasOutput && exec.success;
        allPassed = hasInterface && hasImplements && hasOutput && exec.success;
        break;
      }

      case 'ex-2-2': {
        const hasInterfaces = /interface\s+Imprimable\b/.test(code) && /interface\s+Scannable\b/.test(code);
        const hasMultiImpl = /class\s+ImprimanteMultifonction\s+implements\s+(?:Imprimable\s*,\s*Scannable|Scannable\s*,\s*Imprimable)\b/.test(code);
        const hasExecution = exec.logs.some(l => l.text.toLowerCase().includes('rapport') || l.text.toLowerCase().includes('impression')) &&
                             exec.logs.some(l => l.text.toLowerCase().includes('scan') || l.text.toLowerCase().includes('numérisation'));

        updatedCriteria[0].passed = hasInterfaces;
        updatedCriteria[1].passed = hasMultiImpl;
        updatedCriteria[2].passed = hasExecution && exec.success;
        allPassed = hasInterfaces && hasMultiImpl && hasExecution && exec.success;
        break;
      }

      case 'ex-2-3': {
        const hasExtendsMultiple = /interface\s+CompteAdmin\s+extends\s+(?:CompteSimple\s*,\s*Journalisable|Journalisable\s*,\s*CompteSimple)\b/.test(code);
        const hasDroits = /droits\s*:\s*string\s*\[\s*\]/.test(code);
        const hasSuperAdmin = /class\s+SuperAdmin\s+implements\s+CompteAdmin\b/.test(code);

        updatedCriteria[0].passed = hasExtendsMultiple;
        updatedCriteria[1].passed = hasDroits;
        updatedCriteria[2].passed = hasSuperAdmin && exec.success;
        allPassed = hasExtendsMultiple && hasDroits && hasSuperAdmin && exec.success;
        break;
      }

      case 'ex-2-4': {
        const hasReadonlyInterface = /interface\s+EntiteImmuable\b/.test(code) && /readonly\s+uuid\s*:\s*string/.test(code);
        const hasFichierMatch = /class\s+Fichier\s+implements\s+EntiteImmuable\b/.test(code);
        const hasUuidLogged = exec.logs.some(l => l.text.includes('550e8400') && l.text.includes('notes.txt'));

        updatedCriteria[0].passed = hasReadonlyInterface;
        updatedCriteria[1].passed = hasFichierMatch;
        updatedCriteria[2].passed = hasUuidLogged && exec.success;
        allPassed = hasReadonlyInterface && hasFichierMatch && hasUuidLogged && exec.success;
        break;
      }

      // LABO 3 : Duck Typing & DTOs
      case 'ex-3-1': {
        const hasPoint2D = /interface\s+Point2D\b/.test(code) && /x\s*:\s*number/.test(code) && /y\s*:\s*number/.test(code);
        const hasFunction = /calculerDistanceOrigine\s*\([^)]*:\s*Point2D[^)]*\)/.test(code);
        const hasResult5 = exec.logs.some(l => l.text.includes('5'));

        updatedCriteria[0].passed = hasPoint2D;
        updatedCriteria[1].passed = hasFunction;
        updatedCriteria[2].passed = hasResult5 && exec.success;
        allPassed = hasPoint2D && hasFunction && hasResult5 && exec.success;
        break;
      }

      case 'ex-3-2': {
        const hasSaluer = /saluer\s*\([^)]*:\s*Identifiable[^)]*\)/.test(code);
        const hasExtraProps = /utilisateurComplet/.test(code) && /role/.test(code) && /token/.test(code);
        const hasGreeting = exec.logs.some(l => l.text.includes('Sarah') && l.text.includes('U1'));

        updatedCriteria[0].passed = hasSaluer;
        updatedCriteria[1].passed = hasExtraProps;
        updatedCriteria[2].passed = hasGreeting && exec.success;
        allPassed = hasSaluer && hasExtraProps && hasGreeting && exec.success;
        break;
      }

      case 'ex-3-3': {
        const hasGenericDto = /interface\s+ReponseServeur\s*<\s*T\s*>/.test(code) && /statut\s*:\s*number/.test(code);
        const hasTraiter = /traiterReponse\s*\([^)]*ReponseServeur/.test(code);
        const hasTokenLog = exec.logs.some(l => l.text.includes('auth_token_abc_123'));

        updatedCriteria[0].passed = hasGenericDto;
        updatedCriteria[1].passed = hasTraiter;
        updatedCriteria[2].passed = hasTokenLog && exec.success;
        allPassed = hasGenericDto && hasTraiter && hasTokenLog && exec.success;
        break;
      }

      case 'ex-3-4': {
        const hasIntermedVar = /logPath/.test(code) && /8080/.test(code);
        const hasConfAssign = /:\s*ConfigOption\s*=/.test(code);
        const hasPort8080 = exec.logs.some(l => l.text.includes('8080'));

        updatedCriteria[0].passed = hasIntermedVar;
        updatedCriteria[1].passed = hasConfAssign;
        updatedCriteria[2].passed = hasPort8080 && exec.success;
        allPassed = hasIntermedVar && hasConfAssign && hasPort8080 && exec.success;
        break;
      }

      // LABO 4 : Déjouer les Pièges & Type Guards
      case 'ex-4-1': {
        const noInstanceOf = !/(?<!\/\/.*)\binstanceof\s+Jouable\b/.test(code);
        const hasTypeof = /typeof\s+[a-zA-Z_$0-9.]*jouer\s*===?\s*['"]function['"]/.test(code);
        const hasOutput = exec.logs.some(l => l.text.toLowerCase().includes('musique'));

        updatedCriteria[0].passed = noInstanceOf;
        updatedCriteria[1].passed = hasTypeof;
        updatedCriteria[2].passed = hasOutput && exec.success;
        allPassed = noInstanceOf && hasTypeof && hasOutput && exec.success;
        break;
      }

      case 'ex-4-2': {
        const hasPredicate = /isSoigneur\s*\([^)]*\)\s*:\s*[a-zA-Z_$0-9]+\s+is\s+Soigneur\b/.test(code);
        const hasShapeCheck = /typeof\s+[a-zA-Z_$0-9.]*soigner\s*===?\s*['"]function['"]/.test(code);
        const hasOutputs = exec.logs.some(l => l.text.includes('true')) && exec.logs.some(l => l.text.includes('false'));

        updatedCriteria[0].passed = hasPredicate;
        updatedCriteria[1].passed = hasShapeCheck;
        updatedCriteria[2].passed = hasOutputs && exec.success;
        allPassed = hasPredicate && hasShapeCheck && hasOutputs && exec.success;
        break;
      }

      case 'ex-4-3': {
        const hasGuardIf = /if\s*\(\s*isSoigneur\s*\([^)]*\)\s*\)/.test(code);
        const hasCall = /\.soigner\s*\([^)]*\)/.test(code);
        const hasBothOutputs = exec.logs.some(l => l.text.includes('Lumière divine') || l.text.includes('Frodon')) &&
                               exec.logs.some(l => l.text.toLowerCase().includes('impossible') || l.text.toLowerCase().includes('azog'));

        updatedCriteria[0].passed = hasGuardIf;
        updatedCriteria[1].passed = hasCall;
        updatedCriteria[2].passed = hasBothOutputs && exec.success;
        allPassed = hasGuardIf && hasCall && hasBothOutputs && exec.success;
        break;
      }

      case 'ex-4-4': {
        const hasMicroInterfaces = /interface\s+Imprimant\b/.test(code) && /interface\s+Faxant\b/.test(code) && /interface\s+Agrafant\b/.test(code);
        const hasOnlyImprimant = /class\s+ImprimanteThermique\s+implements\s+Imprimant\b/.test(code) && !/implements[^{]+Faxant/.test(code);
        const hasCleanPrint = exec.logs.some(l => l.text.toLowerCase().includes('ticket') || l.text.toLowerCase().includes('thermique'));

        updatedCriteria[0].passed = hasMicroInterfaces;
        updatedCriteria[1].passed = hasOnlyImprimant;
        updatedCriteria[2].passed = hasCleanPrint && exec.success;
        allPassed = hasMicroInterfaces && hasOnlyImprimant && hasCleanPrint && exec.success;
        break;
      }

      // LABO 5 : Architecture Hybride & Découplage
      case 'ex-5-1': {
        const hasExportable = /interface\s+Exportable\b/.test(code) && /exporter\s*\([^)]*\)\s*:\s*string/.test(code);
        const hasDocBase = /abstract\s+class\s+DocumentBase\s+implements\s+Exportable\b/.test(code);
        const hasStateFactoring = /constructor\s*\([^)]*titre[^)]*\)/.test(code) && /obtenirDateCreation/.test(code);

        updatedCriteria[0].passed = hasExportable;
        updatedCriteria[1].passed = hasDocBase;
        updatedCriteria[2].passed = hasStateFactoring;
        allPassed = hasExportable && hasDocBase && hasStateFactoring && exec.success;
        break;
      }

      case 'ex-5-2': {
        const hasPdf = /class\s+DocumentPDF\s+extends\s+DocumentBase\b/.test(code);
        const hasMd = /class\s+DocumentMarkdown\s+extends\s+DocumentBase\b/.test(code);
        const hasBothOutputs = exec.logs.some(l => l.text.includes('[PDF] Facture_Septembre')) &&
                               exec.logs.some(l => l.text.includes('# Documentation'));

        updatedCriteria[0].passed = hasPdf;
        updatedCriteria[1].passed = hasMd;
        updatedCriteria[2].passed = hasBothOutputs && exec.success;
        allPassed = hasPdf && hasMd && hasBothOutputs && exec.success;
        break;
      }

      case 'ex-5-3': {
        const hasFnSignature = /exporterTous\s*\([^)]*Exportable\s*\[\s*\][^)]*\)/.test(code);
        const noIfSwitch = !/\b(if|switch)\b/.test(code.replace(/\/\/.*$/gm, ''));
        const hasCollected = exec.logs.some(l => l.text.includes('[PDF] Bilan') && l.text.includes('# Guide'));

        updatedCriteria[0].passed = hasFnSignature;
        updatedCriteria[1].passed = noIfSwitch;
        updatedCriteria[2].passed = hasCollected && exec.success;
        allPassed = hasFnSignature && noIfSwitch && hasCollected && exec.success;
        break;
      }

      case 'ex-5-4': {
        const hasFactureXml = /class\s+FactureXML\s+implements\s+Exportable\b/.test(code);
        const hasXmlTag = /<facture ref=/.test(code) && /<\/facture>/.test(code);
        const hasOcpSuccess = exec.logs.some(l => l.text.includes('FAC-2026-001') && l.text.includes('1250€'));

        updatedCriteria[0].passed = hasFactureXml;
        updatedCriteria[1].passed = hasXmlTag;
        updatedCriteria[2].passed = hasOcpSuccess && exec.success;
        allPassed = hasFactureXml && hasXmlTag && hasOcpSuccess && exec.success;
        break;
      }
    }

    // Mettre à jour l'exercice dans le signal
    this.exercises.update(list => {
      return list.map(e => {
        if (e.id === targetId) {
          return {
            ...e,
            currentCode: code,
            isCompleted: allPassed,
            criteria: updatedCriteria
          };
        }
        return e;
      });
    });

    this.saveToStorage();

    return {
      success: allPassed,
      logs: exec.logs,
      error: exec.error
    };
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined') return;
    try {
      const data = this.exercises().map(e => ({
        id: e.id,
        currentCode: e.currentCode,
        isCompleted: e.isCompleted,
        criteria: e.criteria.map(c => ({ id: c.id, passed: c.passed }))
      }));
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Ignorer les erreurs de quota localStorage
    }
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return;
      const parsed: Array<{ id: string; currentCode: string; isCompleted: boolean; criteria: Array<{ id: string; passed: boolean }> }> = JSON.parse(raw);
      this.exercises.update(list => {
        return list.map(ex => {
          const saved = parsed.find(p => p.id === ex.id);
          if (!saved) return ex;
          return {
            ...ex,
            currentCode: saved.currentCode || ex.currentCode,
            isCompleted: saved.isCompleted ?? false,
            criteria: ex.criteria.map(c => {
              const savedCrit = saved.criteria?.find(sc => sc.id === c.id);
              return savedCrit ? { ...c, passed: savedCrit.passed } : c;
            })
          };
        });
      });
    } catch {
      // Ignorer
    }
  }
}
