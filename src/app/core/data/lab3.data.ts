import { ExerciseDef } from '../models/app.models';

export const LAB3_EXERCISES: ExerciseDef[] = [
  {
    id: 'ex-3-1',
    labNumber: 3,
    number: '3.1',
    title: 'Typage strict unknown & instanceof Error',
    subtitle: 'Sécuriser l\'accès aux propriétés de l\'erreur avec un garde de type',
    sectionId: 'error-object-strict-typing',
    estimatedTime: '4 min',
    difficulty: 'Débutant',
    statement: 'Complétez la fonction capturerMessage(action) : exécutez action() dans un try. Dans le bloc catch (error: unknown), utilisez if (error instanceof Error) pour retourner son message, sinon retournez "Erreur inconnue".',
    hint: 'catch (error: unknown) { if (error instanceof Error) return error.message; return "Erreur inconnue"; }',
    initialCode: `export function capturerMessage(action: () => void): string {
  try {
    action();
    return "OK";
  } catch (error: unknown) {
    // TODO : Si error est une instance de Error, retourner error.message
    // Sinon retourner "Erreur inconnue"
    return "Erreur inconnue";
  }
}
`,
    solutionCode: `export function capturerMessage(action: () => void): string {
  try {
    action();
    return "OK";
  } catch (error: unknown) {
    if (error instanceof Error) {
      return error.message;
    }
    return "Erreur inconnue";
  }
}
`,
    solutionExplanation: [
      'Avec catch (error: unknown), le compilateur TypeScript interdit d\'accéder à error.message sans vérification préalable.',
      'Le garde if (error instanceof Error) affine le type et protège l\'application au runtime.'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /instanceof\s+Error/,
        label: 'error instanceof Error',
        errorMessage: 'Utilisez le garde if (error instanceof Error).'
      }
    ],
    evaluateFn: (sandbox: any) => {
      const results: { criterionId: string; passed: boolean; message?: string }[] = [];
      const fn = sandbox.capturerMessage;
      if (typeof fn !== 'function') return [];

      // Critère 1 : Cas Error standard
      const msg1 = fn(() => { throw new Error('Connexion perdue'); });
      results.push({ criterionId: 'c1', passed: msg1 === 'Connexion perdue' });

      // Critère 2 : Cas non-Error (throw 404)
      const msg2 = fn(() => { throw 404; });
      results.push({ criterionId: 'c2', passed: msg2 === 'Erreur inconnue' });

      return results;
    },
    criteria: [
      {
        id: 'c1',
        label: 'Extraction sécurisée de Error.message',
        description: 'Renvoie le message de l\'exception si error instanceof Error.',
        passed: false,
        hint: 'if (error instanceof Error) return error.message;'
      },
      {
        id: 'c2',
        label: 'Protection contre types exotiques',
        description: 'Renvoie "Erreur inconnue" si l\'élément jeté n\'est pas une Error (ex: nombre).',
        passed: false,
        hint: 'Retournez "Erreur inconnue" en dehors du if.'
      }
    ],
    isCompleted: false
  },

  {
    id: 'ex-3-2',
    labNumber: 3,
    number: '3.2',
    title: 'Prise en charge des chaînes primitives',
    subtitle: 'Élargir le narrowing pour gérer throw "message brut"',
    sectionId: 'error-object-strict-typing',
    estimatedTime: '4 min',
    difficulty: 'Facile',
    statement: 'Complétez analyserErreur(error: unknown) : si error instanceof Error, renvoyez error.message ; si typeof error === "string", renvoyez cette chaîne ; sinon renvoyez "Anomalie non reconnue".',
    hint: 'if (error instanceof Error) return error.message; else if (typeof error === "string") return error; return "Anomalie non reconnue";',
    initialCode: `export function analyserErreur(error: unknown): string {
  // TODO :
  // 1. Si error instanceof Error -> return error.message
  // 2. Si typeof error === 'string' -> return error
  // 3. Sinon -> return "Anomalie non reconnue"
  return "Anomalie non reconnue";
}
`,
    solutionCode: `export function analyserErreur(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return "Anomalie non reconnue";
}
`,
    solutionExplanation: [
      'En JavaScript legacy, certains développeurs écrivent encore throw "message".',
      'Le narrowing strict permet de prendre en charge ce cas tout en maintenant la sécurité.'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /typeof\s+error\s*===\s*['"]string['"]/,
        label: "typeof error === 'string'",
        errorMessage: 'Vérifiez le cas de la chaîne primitive avec typeof error === "string".'
      }
    ],
    evaluateFn: (sandbox: any) => {
      const results: { criterionId: string; passed: boolean; message?: string }[] = [];
      const fn = sandbox.analyserErreur;
      if (typeof fn !== 'function') return [];

      results.push({
        criterionId: 'c1',
        passed: fn(new Error('Erreur objet')) === 'Erreur objet'
      });

      results.push({
        criterionId: 'c2',
        passed: fn('Oups texte') === 'Oups texte' && fn(false) === 'Anomalie non reconnue'
      });

      return results;
    },
    criteria: [
      {
        id: 'c1',
        label: 'Instance d\'Error reconnue',
        description: 'analyserErreur(new Error("Erreur objet")) retourne "Erreur objet".',
        passed: false,
        hint: 'if (error instanceof Error) return error.message;'
      },
      {
        id: 'c2',
        label: 'Chaîne primitive et repli',
        description: 'analyserErreur("Oups texte") retourne "Oups texte", et false retourne "Anomalie non reconnue".',
        passed: false,
        hint: 'if (typeof error === "string") return error;'
      }
    ],
    isCompleted: false
  },

  {
    id: 'ex-3-3',
    labNumber: 3,
    number: '3.3',
    title: 'Résistance absolue au throw null',
    subtitle: 'Écrire un formateur de message invulnérable à null et undefined',
    sectionId: 'error-object-strict-typing',
    estimatedTime: '5 min',
    difficulty: 'Intermédiaire',
    statement: 'Écrivez extraireMessage(error: unknown): string : renvoyez error.message si instanceof Error, error si string, "NullError" si error === null, "UndefinedError" si error === undefined, et String(error) sinon.',
    hint: 'Gérez explicitement null et undefined avant d\'essayer de convertir d\'autres objets.',
    initialCode: `export function extraireMessage(error: unknown): string {
  // TODO : Renvoyer :
  // - error.message si error instanceof Error
  // - error si typeof error === 'string'
  // - "NullError" si error === null
  // - "UndefinedError" si error === undefined
  // - String(error) sinon
  return "";
}
`,
    solutionCode: `export function extraireMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  if (error === null) {
    return "NullError";
  }
  if (error === undefined) {
    return "UndefinedError";
  }
  return String(error);
}
`,
    solutionExplanation: [
      'Dans un environnement JS, throw null est légal au runtime.',
      'Une fonction robuste doit anticiper les valeurs primitives null et undefined sans jamais crasher.'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /error\s*===\s*null/,
        label: 'error === null',
        errorMessage: 'Vérifiez la condition error === null.'
      }
    ],
    evaluateFn: (sandbox: any) => {
      const results: { criterionId: string; passed: boolean; message?: string }[] = [];
      const fn = sandbox.extraireMessage;
      if (typeof fn !== 'function') return [];

      results.push({
        criterionId: 'c1',
        passed: fn(new Error('Crash')) === 'Crash' && fn('Erreur str') === 'Erreur str'
      });

      results.push({
        criterionId: 'c2',
        passed: fn(null) === 'NullError' && fn(undefined) === 'UndefinedError' && fn(500) === '500'
      });

      return results;
    },
    criteria: [
      {
        id: 'c1',
        label: 'Support Error & string',
        description: 'Fonctionne pour new Error() et pour les chaînes de caractères.',
        passed: false,
        hint: 'if (error instanceof Error) ... else if (typeof error === "string") ...'
      },
      {
        id: 'c2',
        label: 'Invulnérabilité à null & undefined',
        description: 'Retourne "NullError" pour null et "UndefinedError" pour undefined.',
        passed: false,
        hint: 'if (error === null) return "NullError"; if (error === undefined) return "UndefinedError";'
      }
    ],
    isCompleted: false
  },

  {
    id: 'ex-3-4',
    labNumber: 3,
    number: '3.4',
    title: 'Chaînage d\'erreur moderne avec cause',
    subtitle: 'Préserver l\'erreur technique d\'origine grâce à ES2022 cause',
    sectionId: 'error-object-strict-typing',
    estimatedTime: '4 min',
    difficulty: 'Facile',
    statement: 'Complétez executerAvecDiagnostic(action) : exécutez action() dans un try. En cas d\'erreur dans catch (err: unknown), levez une nouvelle Error("Opération métier échouée", { cause: err }).',
    hint: 'throw new Error("Opération métier échouée", { cause: err });',
    initialCode: `export function executerAvecDiagnostic(action: () => void): void {
  try {
    action();
  } catch (err: unknown) {
    // TODO : Lever new Error("Opération métier échouée", { cause: err })
  }
}
`,
    solutionCode: `export function executerAvecDiagnostic(action: () => void): void {
  try {
    action();
  } catch (err: unknown) {
    throw new Error("Opération métier échouée", { cause: err });
  }
}
`,
    solutionExplanation: [
      'L\'option { cause: err } permet d\'encapsuler l\'erreur technique sans écraser sa stack trace d\'origine.',
      'L\'interface reçoit un message lisible, et l\'équipe DevOps conserve le diagnostic bas niveau dans error.cause.'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /throw\s+new\s+Error\s*\(\s*["']Opération métier échouée["']\s*,\s*\{\s*cause\s*:\s*[A-Za-z0-9_]+\s*\}\s*\)/,
        label: '{ cause: err }',
        errorMessage: 'Utilisez throw new Error("Opération métier échouée", { cause: err }).'
      }
    ],
    evaluateFn: (sandbox: any) => {
      const results: { criterionId: string; passed: boolean; message?: string }[] = [];
      const fn = sandbox.executerAvecDiagnostic;
      if (typeof fn !== 'function') return [];

      // Critère 1 : Succès si pas d'erreur
      try {
        fn(() => {});
        results.push({ criterionId: 'c1', passed: true });
      } catch {
        results.push({ criterionId: 'c1', passed: false });
      }

      // Critère 2 : Encapsulation avec cause
      const originalErr = new Error('HTTP 500 Network');
      try {
        fn(() => { throw originalErr; });
        results.push({ criterionId: 'c2', passed: false, message: 'Aurait dû relancer une Error avec cause.' });
      } catch (wrapper: any) {
        const passed = wrapper.message === 'Opération métier échouée' && wrapper.cause === originalErr;
        results.push({
          criterionId: 'c2',
          passed,
          message: passed ? undefined : 'L\'erreur relancée ne contient pas le bon message ou la bonne cause.'
        });
      }

      return results;
    },
    criteria: [
      {
        id: 'c1',
        label: 'Cas nominal sans incident',
        description: 'Exécute l\'action sans lever d\'exception si celle-ci réussit.',
        passed: false,
        hint: 'try { action(); }'
      },
      {
        id: 'c2',
        label: 'Encapsulation avec cause d\'origine',
        description: 'Relance Error("Opération métier échouée") avec la cause originale préservée.',
        passed: false,
        hint: 'throw new Error("Opération métier échouée", { cause: err });'
      }
    ],
    isCompleted: false
  },

  {
    id: 'ex-3-5',
    labNumber: 3,
    number: '3.5',
    title: 'Relance obligatoire de l\'inconnu (Rethrow)',
    subtitle: 'Ne jamais avaler une anomalie inattendue dans un catch',
    sectionId: 'error-object-strict-typing',
    estimatedTime: '4 min',
    difficulty: 'Intermédiaire',
    statement: 'Complétez filtrerEtRelancer(action) : exécutez action(). Dans catch (error: unknown), si error instanceof ErreurValidation, retournez "Validation corrigée". Sinon (else), relancez obligatoirement l\'erreur avec throw error !',
    hint: 'if (error instanceof ErreurValidation) return "Validation corrigée"; else throw error;',
    initialCode: `export class ErreurValidation extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ErreurValidation';
  }
}

export function filtrerEtRelancer(action: () => void): string {
  try {
    action();
    return "Succès";
  } catch (error: unknown) {
    // TODO :
    // Si error instanceof ErreurValidation -> return "Validation corrigée"
    // SINON -> throw error (OBLIGATOIRE !)
    return "Ignoré";
  }
}
`,
    solutionCode: `export class ErreurValidation extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ErreurValidation';
  }
}

export function filtrerEtRelancer(action: () => void): string {
  try {
    action();
    return "Succès";
  } catch (error: unknown) {
    if (error instanceof ErreurValidation) {
      return "Validation corrigée";
    }
    throw error;
  }
}
`,
    solutionExplanation: [
      'Si un bloc catch ne traite qu\'un sous-ensemble d\'exceptions, tout ce qui n\'est pas reconnu doit être relancé.',
      'Sans le throw error, des bogues de code critiques (ex: TypeError) seraient étouffés en silence.'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /throw\s+error\s*;/,
        label: 'throw error;',
        errorMessage: 'Relancez l\'erreur inattendue avec throw error;.'
      }
    ],
    evaluateFn: (sandbox: any) => {
      const results: { criterionId: string; passed: boolean; message?: string }[] = [];
      const fn = sandbox.filtrerEtRelancer;
      const ErreurValidation = sandbox.ErreurValidation;
      if (typeof fn !== 'function' || !ErreurValidation) return [];

      // Critère 1 : Erreur de validation traitée
      const resVal = fn(() => { throw new ErreurValidation('Champ requis'); });
      results.push({ criterionId: 'c1', passed: resVal === 'Validation corrigée' });

      // Critère 2 : Autre erreur relancée
      const typeErr = new TypeError('Accès mémoire illégal');
      try {
        fn(() => { throw typeErr; });
        results.push({ criterionId: 'c2', passed: false, message: 'Le TypeError aurait dû être relancé !' });
      } catch (caught: any) {
        results.push({ criterionId: 'c2', passed: caught === typeErr });
      }

      return results;
    },
    criteria: [
      {
        id: 'c1',
        label: 'Interception de ErreurValidation',
        description: 'Retourne "Validation corrigée" pour ErreurValidation.',
        passed: false,
        hint: 'if (error instanceof ErreurValidation) return "Validation corrigée";'
      },
      {
        id: 'c2',
        label: 'Relance inconditionnelle des autres erreurs',
        description: 'Relance TypeError sans l\'avaler.',
        passed: false,
        hint: 'else { throw error; }'
      }
    ],
    isCompleted: false
  }
];
