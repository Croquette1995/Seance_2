import { ExerciseDef } from '../models/app.models';

export const LAB4_EXERCISES: ExerciseDef[] = [
  {
    id: 'ex-4-1',
    labNumber: 4,
    number: '4.1',
    title: 'Classe abstraite socle AppError',
    subtitle: 'Créer la fondation objet de l\'ensemble des exceptions de l\'application',
    sectionId: 'custom-domain-errors',
    estimatedTime: '5 min',
    difficulty: 'Débutant',
    statement: 'Créez la classe abstraite AppError qui hérite de Error. Son constructeur doit recevoir message: string et code: string, appeler super(message), stocker public readonly code: string et réaffecter this.name = this.constructor.name.',
    hint: 'export abstract class AppError extends Error { constructor(message: string, public readonly code: string) { super(message); this.name = this.constructor.name; } }',
    initialCode: `// TODO : Déclarer abstract class AppError extends Error
// - Constructeur(message: string, public readonly code: string)
// - super(message)
// - this.name = this.constructor.name
export abstract class AppError extends Error {
  constructor(message: string, public readonly code: string) {
    // Complétez ici
    super(message);
  }
}
`,
    solutionCode: `export abstract class AppError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
`,
    solutionExplanation: [
      'En étendant Error, notre classe personnalisée hérite de la gestion native de la stack trace.',
      'Réassigner this.name = this.constructor.name permet d\'afficher le vrai nom de la sous-classe dans les logs au lieu du terme générique "Error".'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /abstract\s+class\s+AppError\s+extends\s+Error/,
        label: 'abstract class AppError extends Error',
        errorMessage: 'Déclarez abstract class AppError extends Error.'
      },
      {
        type: 'keyword',
        pattern: /this\.name\s*=\s*this\.constructor\.name/,
        label: 'this.name = this.constructor.name',
        errorMessage: 'Affectez this.name = this.constructor.name dans le constructeur.'
      }
    ],
    evaluateFn: (sandbox: any) => {
      const results: { criterionId: string; passed: boolean; message?: string }[] = [];
      const AppErrorClass = sandbox.AppError;
      if (!AppErrorClass) return [];

      class TestConcreteError extends AppErrorClass {
        constructor() {
          super('Message test', 'ERR_TEST');
        }
      }

      const err: any = new TestConcreteError();
      const anyErr = err as any;

      results.push({
        criterionId: 'c1',
        passed: err instanceof Error && anyErr.message === 'Message test' && anyErr.code === 'ERR_TEST'
      });

      results.push({
        criterionId: 'c2',
        passed: anyErr.name === 'TestConcreteError',
        message: anyErr.name !== 'TestConcreteError' ? `name attendu : "TestConcreteError", reçu : "${anyErr.name}"` : undefined
      });

      return results;
    },
    criteria: [
      {
        id: 'c1',
        label: 'Héritage d\'Error et attribut code',
        description: 'La sous-classe est une instance d\'Error, possède le message et le code public readonly.',
        passed: false,
        hint: 'constructor(message: string, public readonly code: string) { super(message); ... }'
      },
      {
        id: 'c2',
        label: 'Nom dynamique de la classe',
        description: 'this.name vaut le nom exact de la classe concrète instanciée.',
        passed: false,
        hint: 'this.name = this.constructor.name;'
      }
    ],
    isCompleted: false
  },

  {
    id: 'ex-4-2',
    labNumber: 4,
    number: '4.2',
    title: 'Exception métier spécifique : SoldeInsuffisantError',
    subtitle: 'Modéliser une exception de domaine avec un code constant',
    sectionId: 'custom-domain-errors',
    estimatedTime: '5 min',
    difficulty: 'Facile',
    statement: 'Créez SoldeInsuffisantError qui hérite de AppError. Son constructeur reçoit (solde: number, montant: number) et appelle super() avec le message "Solde insuffisant pour retirer " + montant + " €" et le code "SOLDE_INSUFFISANT".',
    hint: 'class SoldeInsuffisantError extends AppError { constructor(solde: number, montant: number) { super(`Solde insuffisant pour retirer ${montant} €`, "SOLDE_INSUFFISANT"); } }',
    initialCode: `export abstract class AppError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

// TODO : Créer SoldeInsuffisantError extends AppError
// constructeur(solde: number, montant: number)
// super(\`Solde insuffisant pour retirer \${montant} €\`, 'SOLDE_INSUFFISANT')
export class SoldeInsuffisantError extends AppError {
  constructor(solde: number, montant: number) {
    super("Solde insuffisant", "ERR");
  }
}
`,
    solutionCode: `export abstract class AppError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class SoldeInsuffisantError extends AppError {
  constructor(solde: number, montant: number) {
    super(\`Solde insuffisant pour retirer \${montant} €\`, 'SOLDE_INSUFFISANT');
  }
}
`,
    solutionExplanation: [
      'Un code constant (ex: SOLDE_INSUFFISANT) est insensible aux traductions de langues et aux fautes de frappe.',
      'L\'interface graphique peut afficher une notification personnalisée en s\'appuyant sur ce code constant.'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /class\s+SoldeInsuffisantError\s+extends\s+AppError/,
        label: 'extends AppError',
        errorMessage: 'SoldeInsuffisantError doit hériter de AppError.'
      },
      {
        type: 'keyword',
        pattern: /['"]SOLDE_INSUFFISANT['"]/,
        label: "'SOLDE_INSUFFISANT'",
        errorMessage: 'Le code transmis à super() doit être "SOLDE_INSUFFISANT".'
      }
    ],
    evaluateFn: (sandbox: any) => {
      const results: { criterionId: string; passed: boolean; message?: string }[] = [];
      const SoldeErrorClass = sandbox.SoldeInsuffisantError;
      if (!SoldeErrorClass) return [];

      const err = new SoldeErrorClass(50, 120);

      results.push({
        criterionId: 'c1',
        passed: err.code === 'SOLDE_INSUFFISANT' && err.message.includes('120')
      });

      results.push({
        criterionId: 'c2',
        passed: err.name === 'SoldeInsuffisantError' && err instanceof Error
      });

      return results;
    },
    criteria: [
      {
        id: 'c1',
        label: 'Code constant et message paramétré',
        description: 'code vaut "SOLDE_INSUFFISANT" et le message mentionne le montant demandé.',
        passed: false,
        hint: 'super(`Solde insuffisant pour retirer ${montant} €`, "SOLDE_INSUFFISANT");'
      },
      {
        id: 'c2',
        label: 'Identité de classe préservée',
        description: 'name vaut "SoldeInsuffisantError" et hérite de Error.',
        passed: false,
        hint: 'Vérifiez la chaîne d\'héritage vers AppError.'
      }
    ],
    isCompleted: false
  },

  {
    id: 'ex-4-3',
    labNumber: 4,
    number: '4.3',
    title: 'Données contextuelles riches',
    subtitle: 'Calculer et exposer le montant manquant pour l\'interface utilisateur',
    sectionId: 'custom-domain-errors',
    estimatedTime: '5 min',
    difficulty: 'Intermédiaire',
    statement: 'Dans SoldeInsuffisantError, ajoutez une propriété public readonly montantManquant: number calculée dans le constructeur (montant - solde), et conservez public readonly soldeActuel: number et public readonly montantDemande: number.',
    hint: 'constructor(public readonly soldeActuel: number, public readonly montantDemande: number) { super(...); this.montantManquant = montantDemande - soldeActuel; }',
    initialCode: `export abstract class AppError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class SoldeInsuffisantError extends AppError {
  public readonly montantManquant: number;

  constructor(
    public readonly soldeActuel: number,
    public readonly montantDemande: number
  ) {
    super(\`Solde insuffisant : \${soldeActuel} € pour \${montantDemande} €\`, 'SOLDE_INSUFFISANT');
    // TODO : Calculer this.montantManquant = montantDemande - soldeActuel
    this.montantManquant = 0;
  }
}
`,
    solutionCode: `export abstract class AppError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class SoldeInsuffisantError extends AppError {
  public readonly montantManquant: number;

  constructor(
    public readonly soldeActuel: number,
    public readonly montantDemande: number
  ) {
    super(\`Solde insuffisant : \${soldeActuel} € pour \${montantDemande} €\`, 'SOLDE_INSUFFISANT');
    this.montantManquant = montantDemande - soldeActuel;
  }
}
`,
    solutionExplanation: [
      'Enrichir l\'exception d\'attributs métier typés permet à l\'UI d\'afficher des calculs exacts sans devoir parser le message texte.',
      'L\'interface peut par exemple proposer un bouton : "Approvisionner votre compte de [montantManquant] €".'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /this\.montantManquant\s*=\s*(?:this\.)?montantDemande\s*-\s*(?:this\.)?soldeActuel/,
        label: 'Calcul montantManquant',
        errorMessage: 'Calculez this.montantManquant = montantDemande - soldeActuel.'
      }
    ],
    evaluateFn: (sandbox: any) => {
      const results: { criterionId: string; passed: boolean; message?: string }[] = [];
      const SoldeErrorClass = sandbox.SoldeInsuffisantError;
      if (!SoldeErrorClass) return [];

      const err = new SoldeErrorClass(40, 100);

      results.push({
        criterionId: 'c1',
        passed: err.montantManquant === 60,
        message: err.montantManquant !== 60 ? `montantManquant attendu : 60, reçu : ${err.montantManquant}` : undefined
      });

      results.push({
        criterionId: 'c2',
        passed: err.soldeActuel === 40 && err.montantDemande === 100
      });

      return results;
    },
    criteria: [
      {
        id: 'c1',
        label: 'Calcul automatique du manque',
        description: 'Avec solde=40 et montant=100, montantManquant vaut 60.',
        passed: false,
        hint: 'this.montantManquant = montantDemande - soldeActuel;'
      },
      {
        id: 'c2',
        label: 'Exposition des attributs de contexte',
        description: 'soldeActuel et montantDemande sont accessibles en readonly.',
        passed: false,
        hint: 'Déclarez public readonly dans les paramètres du constructeur.'
      }
    ],
    isCompleted: false
  },

  {
    id: 'ex-4-4',
    labNumber: 4,
    number: '4.4',
    title: 'Restauration de la chaîne de prototypes',
    subtitle: 'Garantir la fiabilité absolue de instanceof en transpilation TypeScript',
    sectionId: 'custom-domain-errors',
    estimatedTime: '4 min',
    difficulty: 'Intermédiaire',
    statement: 'Dans le constructeur de AppError, ajoutez Object.setPrototypeOf(this, new.target.prototype); pour restaurer la chaîne de prototypes lors de l\'extension de classes natives.',
    hint: 'Object.setPrototypeOf(this, new.target.prototype); juste après super(message) et this.name.',
    initialCode: `export abstract class AppError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = this.constructor.name;
    // TODO : Restauration de prototype avec Object.setPrototypeOf(this, new.target.prototype)
  }
}
`,
    solutionCode: `export abstract class AppError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
`,
    solutionExplanation: [
      'Lors de la compilation TypeScript vers certaines cibles JavaScript (ES5), hériter de Error peut briser la chaîne de prototypes.',
      'Object.setPrototypeOf(this, new.target.prototype) répare ce problème et garantit le succès de instanceof dans tous les runtimes.'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /Object\.setPrototypeOf\s*\(\s*this\s*,\s*new\.target\.prototype\s*\)/,
        label: 'Object.setPrototypeOf(this, new.target.prototype)',
        errorMessage: 'Ajoutez Object.setPrototypeOf(this, new.target.prototype); dans le constructeur.'
      }
    ],
    evaluateFn: (sandbox: any) => {
      const results: { criterionId: string; passed: boolean; message?: string }[] = [];
      const AppErrorClass = sandbox.AppError;
      if (!AppErrorClass) return [];

      class ConcrError extends AppErrorClass {
        constructor() {
          super('test', 'CODE');
        }
      }

      const e = new ConcrError();
      results.push({
        criterionId: 'c1',
        passed: e instanceof ConcrError && e instanceof AppErrorClass && e instanceof Error
      });

      return results;
    },
    criteria: [
      {
        id: 'c1',
        label: 'Chaîne de prototypes restaurée',
        description: 'instanceof fonctionne sur toute la chaîne d\'héritage.',
        passed: false,
        hint: 'Object.setPrototypeOf(this, new.target.prototype);'
      }
    ],
    isCompleted: false
  }
];
