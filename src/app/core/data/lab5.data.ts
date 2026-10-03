import { ExerciseDef } from '../models/app.models';

export const LAB5_EXERCISES: ExerciseDef[] = [
  {
    id: 'ex-5-1',
    labNumber: 5,
    number: '5.1',
    title: 'Ordre chirurgical de capture (Spécifique avant Général)',
    subtitle: 'Éviter que la classe mère n\'intercepte les classes filles en amont',
    sectionId: 'filtering-polymorphism',
    estimatedTime: '5 min',
    difficulty: 'Intermédiaire',
    statement: 'Dans routerErreur(err: unknown), organisez les branches if/else dans le bon ordre : testez d\'abord SoldeInsuffisantError (renvoyer "Spécifique: Solde"), puis BanqueError (renvoyer "Général: Banque"), et sinon renvoyer "Autre".',
    hint: 'Toujours tester les classes filles les plus précises en premier, sinon la classe mère interceptera tout via le polymorphisme d\'héritage.',
    initialCode: `export class BanqueError extends Error {}
export class SoldeInsuffisantError extends BanqueError {}

export function routerErreur(err: unknown): string {
  // ❌ ERREUR : Si BanqueError est testée en premier, SoldeInsuffisantError ne sera jamais atteinte !
  // TODO : Réorganiser dans le bon ordre :
  // 1. SoldeInsuffisantError -> "Spécifique: Solde"
  // 2. BanqueError -> "Général: Banque"
  // 3. Sinon -> "Autre"
  if (err instanceof BanqueError) {
    return "Général: Banque";
  } else if (err instanceof SoldeInsuffisantError) {
    return "Spécifique: Solde";
  }
  return "Autre";
}
`,
    solutionCode: `export class BanqueError extends Error {}
export class SoldeInsuffisantError extends BanqueError {}

export function routerErreur(err: unknown): string {
  if (err instanceof SoldeInsuffisantError) {
    return "Spécifique: Solde";
  } else if (err instanceof BanqueError) {
    return "Général: Banque";
  }
  return "Autre";
}
`,
    solutionExplanation: [
      'Puisque SoldeInsuffisantError hérite de BanqueError, l\'expression (err instanceof BanqueError) est vraie pour les deux classes !',
      'Placer la classe fille en premier est la seule façon de garantir un traitement spécialisé.'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /if\s*\(\s*err\s+instanceof\s+SoldeInsuffisantError\s*\)/,
        label: 'SoldeInsuffisantError en premier',
        errorMessage: 'Testez err instanceof SoldeInsuffisantError dans la première condition if.'
      }
    ],
    evaluateFn: (sandbox: any) => {
      const results: { criterionId: string; passed: boolean; message?: string }[] = [];
      const fn = sandbox.routerErreur;
      const SoldeError = sandbox.SoldeInsuffisantError;
      const BanqueError = sandbox.BanqueError;
      if (!fn || !SoldeError || !BanqueError) return [];

      const resSpecific = fn(new SoldeError());
      results.push({
        criterionId: 'c1',
        passed: resSpecific === 'Spécifique: Solde',
        message: resSpecific !== 'Spécifique: Solde' ? `Reçu "${resSpecific}" au lieu de "Spécifique: Solde". Le parent a intercepté l'enfant !` : undefined
      });

      const resGeneric = fn(new BanqueError());
      const resOther = fn(new TypeError('Bad type'));
      results.push({
        criterionId: 'c2',
        passed: resGeneric === 'Général: Banque' && resOther === 'Autre'
      });

      return results;
    },
    criteria: [
      {
        id: 'c1',
        label: 'Aiguillage précis vers l\'enfant',
        description: 'SoldeInsuffisantError retourne "Spécifique: Solde".',
        passed: false,
        hint: 'if (err instanceof SoldeInsuffisantError) return "Spécifique: Solde";'
      },
      {
        id: 'c2',
        label: 'Repli vers le parent et l\'inconnu',
        description: 'BanqueError retourne "Général: Banque" et TypeError retourne "Autre".',
        passed: false,
        hint: 'else if (err instanceof BanqueError) ... else return "Autre";'
      }
    ],
    isCompleted: false
  },

  {
    id: 'ex-5-2',
    labNumber: 5,
    number: '5.2',
    title: 'Error Wrapping dans la couche Service',
    subtitle: 'Traduire une réponse HTTP 409 en exception métier avec cause',
    sectionId: 'architectural-strategies',
    estimatedTime: '5 min',
    difficulty: 'Intermédiaire',
    statement: 'Dans ReservationService.reserver(slotId), interceptez toute erreur. Si err.status === 409, levez new CreneauIndisponibleError(slotId, { cause: err }), sinon relancez err avec throw err.',
    hint: 'catch (err: any) { if (err?.status === 409) throw new CreneauIndisponibleError(slotId, { cause: err }); throw err; }',
    initialCode: `export class CreneauIndisponibleError extends Error {
  constructor(public slotId: string, options?: { cause: unknown }) {
    super(\`Le créneau \${slotId} est déjà réservé.\`, options);
    this.name = 'CreneauIndisponibleError';
  }
}

export class ReservationService {
  constructor(private apiClient: { post(url: string): void }) {}

  reserver(slotId: string): void {
    try {
      this.apiClient.post(\`/slots/\${slotId}\`);
    } catch (err: any) {
      // TODO :
      // Si err.status === 409 -> lever new CreneauIndisponibleError(slotId, { cause: err })
      // Sinon -> relancer avec throw err
    }
  }
}
`,
    solutionCode: `export class CreneauIndisponibleError extends Error {
  constructor(public slotId: string, options?: { cause: unknown }) {
    super(\`Le créneau \${slotId} est déjà réservé.\`, options);
    this.name = 'CreneauIndisponibleError';
  }
}

export class ReservationService {
  constructor(private apiClient: { post(url: string): void }) {}

  reserver(slotId: string): void {
    try {
      this.apiClient.post(\`/slots/\${slotId}\`);
    } catch (err: any) {
      if (err && err.status === 409) {
        throw new CreneauIndisponibleError(slotId, { cause: err });
      }
      throw err;
    }
  }
}
`,
    solutionExplanation: [
      'L\'Error Wrapping abstrait le protocole HTTP. Le composant d\'interface manipule des exceptions métier et non des codes de statut HTTP 409.',
      'L\'option { cause: err } conserve la trace réseau originelle pour le diagnostic des serveurs.'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /throw\s+new\s+CreneauIndisponibleError/,
        label: 'throw new CreneauIndisponibleError',
        errorMessage: 'Levez new CreneauIndisponibleError en cas de conflit HTTP 409.'
      }
    ],
    evaluateFn: (sandbox: any) => {
      const results: { criterionId: string; passed: boolean; message?: string }[] = [];
      const ServiceClass = sandbox.ReservationService;
      const CreneauClass = sandbox.CreneauIndisponibleError;
      if (!ServiceClass || !CreneauClass) return [];

      // Test 1 : Conflit 409 converti
      const conflictClient = {
        post: () => {
          const e: any = new Error('Conflict HTTP');
          e.status = 409;
          throw e;
        }
      };
      const s1 = new ServiceClass(conflictClient);
      try {
        s1.reserver('slot-A');
        results.push({ criterionId: 'c1', passed: false, message: 'Aurait dû lever CreneauIndisponibleError' });
      } catch (e: any) {
        const passed = e instanceof CreneauClass && e.slotId === 'slot-A' && e.cause?.status === 409;
        results.push({ criterionId: 'c1', passed, message: passed ? undefined : 'L\'erreur métier enveloppée est incorrecte.' });
      }

      // Test 2 : Autre erreur relancée telle quelle
      const serverError = new Error('500 Internal Server Error');
      const err500Client = { post: () => { throw serverError; } };
      const s2 = new ServiceClass(err500Client);
      try {
        s2.reserver('slot-B');
        results.push({ criterionId: 'c2', passed: false });
      } catch (e: any) {
        results.push({ criterionId: 'c2', passed: e === serverError });
      }

      return results;
    },
    criteria: [
      {
        id: 'c1',
        label: 'Traduction HTTP 409 en erreur de domaine',
        description: 'Lève CreneauIndisponibleError avec slotId et cause originale.',
        passed: false,
        hint: 'if (err.status === 409) throw new CreneauIndisponibleError(slotId, { cause: err });'
      },
      {
        id: 'c2',
        label: 'Relance des autres erreurs non gérées',
        description: 'Relance les erreurs 500 sans les modifier.',
        passed: false,
        hint: 'throw err;'
      }
    ],
    isCompleted: false
  },

  {
    id: 'ex-5-3',
    labNumber: 5,
    number: '5.3',
    title: 'Remplacement d\'un catch silencieux',
    subtitle: 'Éliminer le pire anti-pattern : le swallow catch sans log ni repli',
    sectionId: 'filtering-polymorphism',
    estimatedTime: '4 min',
    difficulty: 'Facile',
    statement: 'Dans chargerConfiguration(), éliminez le catch vide : journalisez l\'anomalie avec console.error("Échec configuration :", err) et retournez l\'objet de repli par défaut { theme: "dark", lang: "fr" }.',
    hint: 'catch (err: unknown) { console.error("Échec configuration :", err); return { theme: "dark", lang: "fr" }; }',
    initialCode: `export interface Config {
  theme: string;
  lang: string;
}

export function chargerConfiguration(parser: () => Config): Config {
  try {
    return parser();
  } catch (err: unknown) {
    // ❌ CRIME MAJEUR : Le catch vide qui avale tout en silence !
    // TODO :
    // 1. console.error("Échec configuration :", err)
    // 2. return { theme: 'dark', lang: 'fr' }
  }
  return { theme: 'dark', lang: 'fr' };
}
`,
    solutionCode: `export interface Config {
  theme: string;
  lang: string;
}

export function chargerConfiguration(parser: () => Config): Config {
  try {
    return parser();
  } catch (err: unknown) {
    console.error("Échec configuration :", err);
    return { theme: 'dark', lang: 'fr' };
  }
}
`,
    solutionExplanation: [
      'Un catch vide rend les incidents indétectables en production.',
      'Si une erreur est capturée, il faut a minima la tracer (console.error) et fournir un état de repli explicite.'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /console\.error\s*\(/,
        label: 'console.error',
        errorMessage: 'Journalisez l\'erreur avec console.error(...).'
      }
    ],
    evaluateFn: (sandbox: any, logs: string[]) => {
      const results: { criterionId: string; passed: boolean; message?: string }[] = [];
      const fn = sandbox.chargerConfiguration;
      if (typeof fn !== 'function') return [];

      const parsed = fn(() => ({ theme: 'light', lang: 'en' }));
      results.push({ criterionId: 'c1', passed: parsed.theme === 'light' && parsed.lang === 'en' });

      const fallback = fn(() => { throw new Error('Fichier JSON corrompu'); });
      const hasLoggedError = logs.some(l => l.includes('Échec configuration') || l.includes('corrompu'));
      results.push({
        criterionId: 'c2',
        passed: fallback.theme === 'dark' && fallback.lang === 'fr' && hasLoggedError,
        message: !hasLoggedError ? 'console.error n\'a pas été appelé.' : undefined
      });

      return results;
    },
    criteria: [
      {
        id: 'c1',
        label: 'Lecture nominale valide',
        description: 'Renvoie la configuration analysée en cas de succès.',
        passed: false,
        hint: 'return parser();'
      },
      {
        id: 'c2',
        label: 'Tracé console et repli gracieux',
        description: 'Appelle console.error et retourne la configuration par défaut { theme: "dark", lang: "fr" }.',
        passed: false,
        hint: 'console.error("Échec configuration :", err); return { theme: "dark", lang: "fr" };'
      }
    ],
    isCompleted: false
  },

  {
    id: 'ex-5-4',
    labNumber: 5,
    number: '5.4',
    title: 'Exception vs Valeur normale (Ne pas abuser de throw)',
    subtitle: 'Retourner null plutôt que lever une exception pour une recherche infructueuse',
    sectionId: 'architectural-strategies',
    estimatedTime: '4 min',
    difficulty: 'Facile',
    statement: 'Refactorisez trouverUtilisateurParEmail(utilisateurs, email) : supprimez le throw new Error("Utilisateur non trouvé") et retournez simplement null si aucun utilisateur ne correspond, ou l\'utilisateur trouvé.',
    hint: 'const found = utilisateurs.find(u => u.email === email); return found || null;',
    initialCode: `export interface Utilisateur {
  id: number;
  email: string;
}

// ❌ ANTI-PATTERN : Lever une exception pour une simple absence dans une liste !
export function trouverUtilisateurParEmail(utilisateurs: Utilisateur[], email: string): Utilisateur | null {
  const user = utilisateurs.find(u => u.email === email);
  if (!user) {
    throw new Error("Utilisateur non trouvé"); // TODO : Remplacer par return null
  }
  return user;
}
`,
    solutionCode: `export interface Utilisateur {
  id: number;
  email: string;
}

export function trouverUtilisateurParEmail(utilisateurs: Utilisateur[], email: string): Utilisateur | null {
  const user = utilisateurs.find(u => u.email === email);
  if (!user) {
    return null;
  }
  return user;
}
`,
    solutionExplanation: [
      'Ne pas trouver un élément dans un tableau ou un formulaire est un cas d\'usage tout à fait normal et prévisible.',
      'Réserver les exceptions aux ruptures d\'invariants ou aux pannes techniques (disque, réseau).'
    ],
    syntaxRequirements: [
      {
        type: 'forbidden',
        pattern: /throw\s+new\s+Error/,
        label: 'Pas de throw',
        errorMessage: 'Supprimez l\'instruction throw : une recherche infructueuse doit renvoyer null.'
      }
    ],
    evaluateFn: (sandbox: any) => {
      const results: { criterionId: string; passed: boolean; message?: string }[] = [];
      const fn = sandbox.trouverUtilisateurParEmail;
      if (typeof fn !== 'function') return [];

      const users = [{ id: 1, email: 'alice@bank.be' }, { id: 2, email: 'bob@bank.be' }];

      results.push({
        criterionId: 'c1',
        passed: fn(users, 'alice@bank.be')?.id === 1
      });

      try {
        const notFound = fn(users, 'inconnu@bank.be');
        results.push({
          criterionId: 'c2',
          passed: notFound === null
        });
      } catch {
        results.push({
          criterionId: 'c2',
          passed: false,
          message: 'La fonction a levé une exception au lieu de renvoyer null !'
        });
      }

      return results;
    },
    criteria: [
      {
        id: 'c1',
        label: 'Recherche concluante',
        description: 'Retourne l\'utilisateur trouvé si l\'email existe.',
        passed: false,
        hint: 'return user;'
      },
      {
        id: 'c2',
        label: 'Retour de null si absent',
        description: 'Retourne null sans lever d\'exception si l\'email n\'existe pas.',
        passed: false,
        hint: 'if (!user) return null;'
      }
    ],
    isCompleted: false
  }
];
