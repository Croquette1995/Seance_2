import { ExerciseDef } from '../models/app.models';

export const LAB2_EXERCISES: ExerciseDef[] = [
  {
    id: 'ex-2-1',
    labNumber: 2,
    number: '2.1',
    title: 'Filet d\'interception élémentaire',
    subtitle: 'Encapsuler une opération risquée dans un bloc try/catch',
    sectionId: 'try-catch-finally',
    estimatedTime: '4 min',
    difficulty: 'Débutant',
    statement: 'Complétez la fonction executerEnSecurite(service) : appelez service.traiter() dans un bloc try et retournez true. En cas d\'exception attrapée dans catch, retournez false sans laisser l\'erreur fuiter.',
    hint: 'try { service.traiter(); return true; } catch (error) { return false; }',
    initialCode: `export interface IService {
  traiter(): void;
}

export function executerEnSecurite(service: IService): boolean {
  // TODO : try d'appeler service.traiter() et retourner true
  // En cas d'erreur dans catch, retourner false
  service.traiter();
  return true;
}
`,
    solutionCode: `export interface IService {
  traiter(): void;
}

export function executerEnSecurite(service: IService): boolean {
  try {
    service.traiter();
    return true;
  } catch (error: unknown) {
    return false;
  }
}
`,
    solutionExplanation: [
      'Le bloc try surveille l\'exécution de service.traiter().',
      'Si une exception est levée, le contrôle saute dans catch et renvoie false sans faire planter le script.'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /try\s*\{[\s\S]*\}\s*catch/,
        label: 'try / catch',
        errorMessage: 'Utilisez un bloc try / catch.'
      }
    ],
    evaluateFn: (sandbox: any) => {
      const results: { criterionId: string; passed: boolean; message?: string }[] = [];
      const fn = sandbox.executerEnSecurite;
      if (typeof fn !== 'function') return [];

      // Critère 1 : Cas nominal renvoie true
      const okService = { traiter: () => {} };
      results.push({
        criterionId: 'c1',
        passed: fn(okService) === true
      });

      // Critère 2 : Cas d'erreur renvoie false sans crasher
      const failingService = {
        traiter: () => { throw new Error('Échec service'); }
      };
      try {
        const res = fn(failingService);
        results.push({
          criterionId: 'c2',
          passed: res === false,
          message: res === false ? undefined : 'La fonction doit renvoyer false lors d\'une exception.'
        });
      } catch (err: any) {
        results.push({
          criterionId: 'c2',
          passed: false,
          message: `L'exception a fuité hors de la fonction : ${err.message}`
        });
      }

      return results;
    },
    criteria: [
      {
        id: 'c1',
        label: 'Succès nominal',
        description: 'Renvoie true lorsque service.traiter() s\'exécute sans lever d\'exception.',
        passed: false,
        hint: 'try { service.traiter(); return true; }'
      },
      {
        id: 'c2',
        label: 'Interception de l\'échec',
        description: 'Renvoie false lorsque service.traiter() lève une exception.',
        passed: false,
        hint: 'catch (error: unknown) { return false; }'
      }
    ],
    isCompleted: false
  },

  {
    id: 'ex-2-2',
    labNumber: 2,
    number: '2.2',
    title: 'Libération de ressource avec finally',
    subtitle: 'Garantir la fermeture inconditionnelle d\'un flux ou fichier',
    sectionId: 'try-catch-finally',
    estimatedTime: '5 min',
    difficulty: 'Facile',
    statement: 'Complétez la fonction lireFichier(fichier) pour appeler fichier.fermer() dans un bloc finally, garantissant la fermeture que l\'opération fichier.lire() réussisse ou qu\'elle plante.',
    hint: 'try { return fichier.lire(); } finally { fichier.fermer(); }',
    initialCode: `export interface FichierVirtuel {
  ouvert: boolean;
  lire(): string;
  fermer(): void;
}

export function lireFichier(fichier: FichierVirtuel): string {
  // TODO : Lire le fichier dans un try et garantir fichier.fermer() dans finally
  return fichier.lire();
}
`,
    solutionCode: `export interface FichierVirtuel {
  ouvert: boolean;
  lire(): string;
  fermer(): void;
}

export function lireFichier(fichier: FichierVirtuel): string {
  try {
    return fichier.lire();
  } finally {
    fichier.fermer();
  }
}
`,
    solutionExplanation: [
      'Le bloc finally s\'exécute TOUJOURS, même si le bloc try contient un return anticipé ou s\'il subit un crash.',
      'C\'est la garantie suprême contre les fuites de ressources (resource leaks).'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /finally\s*\{[\s\S]*fichier\.fermer\(\)/,
        label: 'finally { fichier.fermer(); }',
        errorMessage: 'Appelez fichier.fermer() à l\'intérieur d\'un bloc finally.'
      }
    ],
    evaluateFn: (sandbox: any) => {
      const results: { criterionId: string; passed: boolean; message?: string }[] = [];
      const fn = sandbox.lireFichier;
      if (typeof fn !== 'function') return [];

      // Critère 1 : Fermeture en cas de succès
      let closedOnSuccess = false;
      const f1: any = {
        ouvert: true,
        lire: () => 'contenu',
        fermer: () => { closedOnSuccess = true; }
      };
      const contenu = fn(f1);
      results.push({
        criterionId: 'c1',
        passed: contenu === 'contenu' && closedOnSuccess
      });

      // Critère 2 : Fermeture en cas d'erreur
      let closedOnError = false;
      const f2: any = {
        ouvert: true,
        lire: () => { throw new Error('Disque plein'); },
        fermer: () => { closedOnError = true; }
      };
      try {
        fn(f2);
      } catch (e) {
        // Attendu
      }
      results.push({
        criterionId: 'c2',
        passed: closedOnError,
        message: closedOnError ? undefined : 'fichier.fermer() n\'a pas été appelé après le crash dans try !'
      });

      return results;
    },
    criteria: [
      {
        id: 'c1',
        label: 'Libération après succès',
        description: 'Retourne le contenu et appelle fichier.fermer().',
        passed: false,
        hint: 'try { return fichier.lire(); } finally { fichier.fermer(); }'
      },
      {
        id: 'c2',
        label: 'Libération après exception',
        description: 'Appelle fichier.fermer() même si fichier.lire() lève une exception.',
        passed: false,
        hint: 'Le bloc finally est exécuté même en cas d\'erreur non attrapée.'
      }
    ],
    isCompleted: false
  },

  {
    id: 'ex-2-3',
    labNumber: 2,
    number: '2.3',
    title: 'Loader UI résilient',
    subtitle: 'Désactiver le spinner de chargement dans tous les cas',
    sectionId: 'try-catch-finally',
    estimatedTime: '5 min',
    difficulty: 'Facile',
    statement: 'Dans la classe GestionnaireRequete, complétez executer(action) : activez this.enChargement = true au début, exécutez action() dans un try, capturez les erreurs dans catch pour renseigner this.derniereErreur, et garantissez this.enChargement = false dans finally.',
    hint: 'this.enChargement = true; try { action(); } catch (e) { ... } finally { this.enChargement = false; }',
    initialCode: `export class GestionnaireRequete {
  public enChargement: boolean = false;
  public derniereErreur: string | null = null;

  executer(action: () => void): void {
    // TODO :
    // 1. Activer le chargement
    // 2. try { action(); }
    // 3. catch (err) { assigner message à derniereErreur }
    // 4. finally { désactiver le chargement }
  }
}
`,
    solutionCode: `export class GestionnaireRequete {
  public enChargement: boolean = false;
  public derniereErreur: string | null = null;

  executer(action: () => void): void {
    this.enChargement = true;
    this.derniereErreur = null;
    try {
      action();
    } catch (err: any) {
      this.derniereErreur = err?.message || String(err);
    } finally {
      this.enChargement = false;
    }
  }
}
`,
    solutionExplanation: [
      'Si une erreur survient dans action(), sans bloc finally, this.enChargement resterait à true indéfiniment.',
      'L\'interface utilisateur serait alors bloquée dans un état de chargement infini.'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /finally\s*\{[\s\S]*enChargement\s*=\s*false/,
        label: 'finally { enChargement = false }',
        errorMessage: 'Désactivez enChargement = false dans un bloc finally.'
      }
    ],
    evaluateFn: (sandbox: any) => {
      const results: { criterionId: string; passed: boolean; message?: string }[] = [];
      const ManagerClass = sandbox.GestionnaireRequete;
      if (!ManagerClass) return [];

      const mgr = new ManagerClass();

      // Critère 1 : Action nominale
      mgr.executer(() => {});
      results.push({
        criterionId: 'c1',
        passed: mgr.enChargement === false && mgr.derniereErreur === null
      });

      // Critère 2 : Action en échec
      mgr.executer(() => { throw new Error('Connexion perdue'); });
      results.push({
        criterionId: 'c2',
        passed: mgr.enChargement === false && mgr.derniereErreur === 'Connexion perdue',
        message: mgr.enChargement ? 'enChargement est resté à true !' : undefined
      });

      return results;
    },
    criteria: [
      {
        id: 'c1',
        label: 'Fin de chargement en cas de succès',
        description: 'Après action réussie : enChargement vaut false et aucune erreur.',
        passed: false,
        hint: 'this.enChargement = false;'
      },
      {
        id: 'c2',
        label: 'Fin de chargement garantie en cas d\'erreur',
        description: 'Après crash dans action() : enChargement est remis à false et derniereErreur est alimentée.',
        passed: false,
        hint: 'Placez this.enChargement = false impérativement dans le finally.'
      }
    ],
    isCompleted: false
  },

  {
    id: 'ex-2-4',
    labNumber: 2,
    number: '2.4',
    title: 'Détecter et supprimer le piège de finally',
    subtitle: 'Éradiquer l\'anti-pattern mortel du return à l\'intérieur de finally',
    sectionId: 'try-catch-finally',
    estimatedTime: '4 min',
    difficulty: 'Intermédiaire',
    statement: 'Corrigez la fonction calculerRatio(a, b) : supprimez le return 0 situé dans le finally qui étouffe silencieusement l\'exception levée lorsque b === 0. Placez un simple console.log dans le finally.',
    hint: 'Ne mettez jamais d\'instruction return dans un bloc finally, car elle écrase l\'exception du try.',
    initialCode: `export function calculerRatio(a: number, b: number): number {
  try {
    if (b === 0) {
      throw new Error("Division par zéro interdite");
    }
    return a / b;
  } finally {
    // ❌ ANTI-PATTERN ASSASSIN : return dans finally étouffe l'exception !
    // TODO : Supprimer ce return et mettre console.log("Calcul terminé");
    return 0;
  }
}
`,
    solutionCode: `export function calculerRatio(a: number, b: number): number {
  try {
    if (b === 0) {
      throw new Error("Division par zéro interdite");
    }
    return a / b;
  } finally {
    console.log("Calcul terminé");
  }
}
`,
    solutionExplanation: [
      'Lorsqu\'un bloc finally contient un return, le moteur JavaScript ignore toute exception levée dans le try ou le catch !',
      'Le bogue devient alors silencieux et impossible à diagnostiquer.'
    ],
    syntaxRequirements: [
      {
        type: 'forbidden',
        pattern: /finally\s*\{[\s\S]*return\b/,
        label: 'Aucun return dans finally',
        errorMessage: 'Supprimez impérativement toute instruction return du bloc finally.'
      }
    ],
    evaluateFn: (sandbox: any, rawLogs: string[]) => {
      const results: { criterionId: string; passed: boolean; message?: string }[] = [];
      const fn = sandbox.calculerRatio;
      if (typeof fn !== 'function') return [];

      // Critère 1 : Calcul valide
      const ratio = fn(10, 2);
      results.push({ criterionId: 'c1', passed: ratio === 5 });

      // Critère 2 : Exception bien propagée lors de la division par zéro
      try {
        fn(10, 0);
        results.push({
          criterionId: 'c2',
          passed: false,
          message: 'calculerRatio(10, 0) aurait dû propager l\'exception "Division par zéro interdite" !'
        });
      } catch (err: any) {
        results.push({
          criterionId: 'c2',
          passed: err.message === 'Division par zéro interdite'
        });
      }

      return results;
    },
    criteria: [
      {
        id: 'c1',
        label: 'Calcul nominal correct',
        description: 'calculerRatio(10, 2) retourne 5.',
        passed: false,
        hint: 'return a / b;'
      },
      {
        id: 'c2',
        label: 'Propagation de l\'exception préservée',
        description: 'calculerRatio(10, 0) propage Error("Division par zéro interdite") sans être étouffée.',
        passed: false,
        hint: 'Supprimez le return du bloc finally.'
      }
    ],
    isCompleted: false
  }
];
