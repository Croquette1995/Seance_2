import { ExerciseDef } from '../models/app.models';

export const LAB6_EXERCISES: ExerciseDef[] = [
  {
    id: 'ex-6-1',
    labNumber: 6,
    number: '6.1',
    title: 'Signal d\'erreur typé dans un composant Angular',
    subtitle: 'Capturer l\'exception métier pour alimenter un Signal réactif',
    sectionId: 'atm-simulator',
    estimatedTime: '5 min',
    difficulty: 'Débutant',
    statement: 'Dans AtmComponent.retirer(montant), exécutez service.debiter(montant) dans un try. En cas d\'erreur dans catch (err: unknown), si err instanceof BanqueError, assignez-le au signal this.erreur.set(err).',
    hint: 'try { this.service.debiter(montant); } catch (err: unknown) { if (err instanceof BanqueError) this.erreur.set(err); }',
    initialCode: `export class BanqueError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
  }
}

export class AtmComponent {
  // Signal d'erreur typé
  erreur = signal<BanqueError | null>(null);

  constructor(private service: { debiter(montant: number): void }) {}

  retirer(montant: number): void {
    // TODO :
    // 1. try d'appeler this.service.debiter(montant)
    // 2. catch (err: unknown) -> si err instanceof BanqueError, this.erreur.set(err)
    this.service.debiter(montant);
  }
}
`,
    solutionCode: `export class BanqueError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
  }
}

export class AtmComponent {
  erreur = signal<BanqueError | null>(null);

  constructor(private service: { debiter(montant: number): void }) {}

  retirer(montant: number): void {
    try {
      this.service.debiter(montant);
    } catch (err: unknown) {
      if (err instanceof BanqueError) {
        this.erreur.set(err);
      }
    }
  }
}
`,
    solutionExplanation: [
      'Le composant Angular intercepte l\'exception métier sans jamais la laisser fuiter dans la console.',
      'En alimentant un Signal réactif, l\'UI se met à jour immédiatement de façon déclarative.'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /this\.erreur\.set\s*\(\s*err\s*\)/,
        label: 'this.erreur.set(err)',
        errorMessage: 'Alimentez le signal d\'erreur avec this.erreur.set(err).'
      }
    ],
    evaluateFn: (sandbox: any) => {
      const results: { criterionId: string; passed: boolean; message?: string }[] = [];
      const CompClass = sandbox.AtmComponent;
      const BanqueError = sandbox.BanqueError;
      if (!CompClass || !BanqueError) return [];

      const mockService = {
        debiter: (m: number) => {
          if (m > 100) throw new BanqueError('Solde insuffisant', 'SOLDE_INSUFFISANT');
        }
      };

      const cmp = new CompClass(mockService);

      cmp.retirer(50);
      results.push({ criterionId: 'c1', passed: cmp.erreur() === null });

      cmp.retirer(150);
      const err = cmp.erreur();
      results.push({
        criterionId: 'c2',
        passed: err instanceof BanqueError && err.code === 'SOLDE_INSUFFISANT'
      });

      return results;
    },
    criteria: [
      {
        id: 'c1',
        label: 'Signal neutre en cas de succès',
        description: 'retirer(50) n\'assigne aucune erreur (erreur() === null).',
        passed: false,
        hint: 'this.erreur.set(null);'
      },
      {
        id: 'c2',
        label: 'Signal alimenté lors d\'une exception',
        description: 'retirer(150) capture BanqueError et met à jour le signal avec l\'instance.',
        passed: false,
        hint: 'if (err instanceof BanqueError) this.erreur.set(err);'
      }
    ],
    isCompleted: false
  },

  {
    id: 'ex-6-2',
    labNumber: 6,
    number: '6.2',
    title: 'Préservation du signal de données',
    subtitle: 'Mettre à jour le solde uniquement si l\'opération bancaire aboutit',
    sectionId: 'atm-simulator',
    estimatedTime: '5 min',
    difficulty: 'Facile',
    statement: 'Dans AtmComponent.retirer(montant), appelez const nouveau = this.service.debiter(this.solde(), montant) et ensuite seulement this.solde.set(nouveau). Si le service lève une erreur, capturez-la sans que this.solde ne soit modifié.',
    hint: 'Placez this.solde.set(...) dans le bloc try, juste après l\'appel au service. Si une exception surgit, la ligne suivante ne sera jamais exécutée.',
    initialCode: `export class AtmComponent {
  solde = signal<number>(100);
  erreur = signal<string | null>(null);

  constructor(private service: { debiter(solde: number, montant: number): number }) {}

  retirer(montant: number): void {
    // ❌ ERREUR : Ne pas débiter le solde avant que le service n'ait validé !
    // TODO :
    // try {
    //   const nouveau = this.service.debiter(this.solde(), montant);
    //   this.solde.set(nouveau);
    // } catch (err: any) { ... }
    this.solde.set(this.solde() - montant);
    this.service.debiter(this.solde(), montant);
  }
}
`,
    solutionCode: `export class AtmComponent {
  solde = signal<number>(100);
  erreur = signal<string | null>(null);

  constructor(private service: { debiter(solde: number, montant: number): number }) {}

  retirer(montant: number): void {
    try {
      const nouveau = this.service.debiter(this.solde(), montant);
      this.solde.set(nouveau);
    } catch (err: any) {
      this.erreur.set(err.message);
    }
  }
}
`,
    solutionExplanation: [
      'Grâce au court-circuit du bloc try, si service.debiter() lève une exception, this.solde.set(nouveau) n\'est jamais atteint.',
      'Le solde du compte reste intact à 100% sans aucun risque de corruption.'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /try\s*\{[\s\S]*this\.solde\.set/,
        label: 'solde.set() dans le try',
        errorMessage: 'La mise à jour this.solde.set(...) doit se trouver à l\'intérieur du try, après l\'appel service.'
      }
    ],
    evaluateFn: (sandbox: any) => {
      const results: { criterionId: string; passed: boolean; message?: string }[] = [];
      const CompClass = sandbox.AtmComponent;
      if (!CompClass) return [];

      const mockService = {
        debiter: (solde: number, montant: number) => {
          if (montant > solde) throw new Error('Dépassement interdit');
          return solde - montant;
        }
      };

      const cmp = new CompClass(mockService);

      // Retrait autorisé
      cmp.retirer(30);
      results.push({ criterionId: 'c1', passed: cmp.solde() === 70 });

      // Retrait refusé : solde doit rester à 70
      cmp.retirer(200);
      results.push({
        criterionId: 'c2',
        passed: cmp.solde() === 70 && cmp.erreur() === 'Dépassement interdit',
        message: cmp.solde() !== 70 ? `Solde corrompu : ${cmp.solde()} € au lieu de 70 € !` : undefined
      });

      return results;
    },
    criteria: [
      {
        id: 'c1',
        label: 'Mise à jour en cas de succès',
        description: 'retirer(30) sur solde=100 met à jour solde() à 70.',
        passed: false,
        hint: 'this.solde.set(nouveau);'
      },
      {
        id: 'c2',
        label: 'Intégrité du solde préservée en cas d\'exception',
        description: 'retirer(200) échoue et solde() reste strictement à 70.',
        passed: false,
        hint: 'Ne modifiez pas solde() si l\'opération échoue.'
      }
    ],
    isCompleted: false
  },

  {
    id: 'ex-6-3',
    labNumber: 6,
    number: '6.3',
    title: 'Gestion du signal de chargement réactif',
    subtitle: 'Déverrouiller l\'automate via finally',
    sectionId: 'atm-simulator',
    estimatedTime: '5 min',
    difficulty: 'Facile',
    statement: 'Dans AtmComponent.onRetirer(montant), passez this.enCours.set(true) avant le try, et dans finally, réinitialisez systématiquement this.enCours.set(false).',
    hint: 'this.enCours.set(true); try { ... } finally { this.enCours.set(false); }',
    initialCode: `export class AtmComponent {
  enCours = signal<boolean>(false);
  solde = signal<number>(100);

  constructor(private service: { traiter(montant: number): void }) {}

  onRetirer(montant: number): void {
    // TODO :
    // 1. this.enCours.set(true)
    // 2. try { this.service.traiter(montant); }
    // 3. catch (err) { ... }
    // 4. finally { this.enCours.set(false) }
  }
}
`,
    solutionCode: `export class AtmComponent {
  enCours = signal<boolean>(false);
  solde = signal<number>(100);

  constructor(private service: { traiter(montant: number): void }) {}

  onRetirer(montant: number): void {
    this.enCours.set(true);
    try {
      this.service.traiter(montant);
    } catch (err: any) {
      // Gestion d'erreur
    } finally {
      this.enCours.set(false);
    }
  }
}
`,
    solutionExplanation: [
      'Garantir le déverrouillage de l\'interface dans le bloc finally empêche les boutons de rester désactivés à tout jamais.',
      'C\'est la clé de voûte de l\'expérience utilisateur sur les formulaires Angular.'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /finally\s*\{[\s\S]*this\.enCours\.set\s*\(\s*false\s*\)/,
        label: 'finally { this.enCours.set(false) }',
        errorMessage: 'Remettez this.enCours.set(false) dans le bloc finally.'
      }
    ],
    evaluateFn: (sandbox: any) => {
      const results: { criterionId: string; passed: boolean; message?: string }[] = [];
      const CompClass = sandbox.AtmComponent;
      if (!CompClass) return [];

      let stateDuringAction = false;
      const srv = {
        traiter: (m: number) => {
          stateDuringAction = true;
          if (m < 0) throw new Error('Erreur montant');
        }
      };

      const cmp = new CompClass(srv);

      // Succès
      cmp.onRetirer(20);
      results.push({ criterionId: 'c1', passed: cmp.enCours() === false && stateDuringAction });

      // Échec
      cmp.onRetirer(-5);
      results.push({
        criterionId: 'c2',
        passed: cmp.enCours() === false,
        message: cmp.enCours() ? 'enCours est resté à true après l\'exception !' : undefined
      });

      return results;
    },
    criteria: [
      {
        id: 'c1',
        label: 'Verrouillage puis déverrouillage nominal',
        description: 'enCours() repasse à false après une opération réussie.',
        passed: false,
        hint: 'this.enCours.set(false);'
      },
      {
        id: 'c2',
        label: 'Déverrouillage garanti après crash',
        description: 'enCours() repasse à false même si le service lève une exception.',
        passed: false,
        hint: 'Placez this.enCours.set(false) dans le bloc finally.'
      }
    ],
    isCompleted: false
  },

  {
    id: 'ex-6-4',
    labNumber: 6,
    number: '6.4',
    title: 'Affichage réactif avec le nouveau control flow @if',
    subtitle: 'Générer le rendu HTML de l\'alerte en extrayant code et message',
    sectionId: 'atm-simulator',
    estimatedTime: '5 min',
    difficulty: 'Intermédiaire',
    statement: 'Écrivez la fonction genererAlerteHtml(erreur: { code: string; message: string } | null): string. Si erreur n\'est pas null, retournez `<div class="alerte"><strong>[${erreur.code}]</strong> ${erreur.message}</div>`, sinon retournez une chaîne vide "".',
    hint: 'if (!erreur) return ""; return `<div class="alerte"><strong>[${erreur.code}]</strong> ${erreur.message}</div>`;',
    initialCode: `export interface ErreurMetier {
  code: string;
  message: string;
}

export function genererAlerteHtml(erreur: ErreurMetier | null): string {
  // TODO : Si erreur existe, retourner :
  // \`<div class="alerte"><strong>[\${erreur.code}]</strong> \${erreur.message}</div>\`
  // Sinon retourner ""
  return "";
}
`,
    solutionCode: `export interface ErreurMetier {
  code: string;
  message: string;
}

export function genererAlerteHtml(erreur: ErreurMetier | null): string {
  if (!erreur) {
    return "";
  }
  return \`<div class="alerte"><strong>[\${erreur.code}]</strong> \${erreur.message}</div>\`;
}
`,
    solutionExplanation: [
      'Ce format simule le modèle natif @if (erreur(); as err) du template Angular.',
      'L\'utilisateur visualise instantanément le code métier [SOLDE_INSUFFISANT] et la description explicative.'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /class="alerte"/,
        label: 'class="alerte"',
        errorMessage: 'Utilisez la classe CSS "alerte" dans le template rendu.'
      }
    ],
    evaluateFn: (sandbox: any) => {
      const results: { criterionId: string; passed: boolean; message?: string }[] = [];
      const fn = sandbox.genererAlerteHtml;
      if (typeof fn !== 'function') return [];

      const html = fn({ code: 'MONTANT_INVALIDE', message: 'Montant négatif interdit' });
      results.push({
        criterionId: 'c1',
        passed: html.includes('[MONTANT_INVALIDE]') && html.includes('Montant négatif interdit')
      });

      const empty = fn(null);
      results.push({
        criterionId: 'c2',
        passed: empty === ''
      });

      return results;
    },
    criteria: [
      {
        id: 'c1',
        label: 'Rendu du bandeau d\'alerte',
        description: 'Contient [CODE] et le message lorsque erreur est présente.',
        passed: false,
        hint: 'return `<div class="alerte"><strong>[${erreur.code}]</strong> ${erreur.message}</div>`;'
      },
      {
        id: 'c2',
        label: 'Rendu vide si aucune erreur',
        description: 'Retourne "" lorsque erreur est null.',
        passed: false,
        hint: 'if (!erreur) return "";'
      }
    ],
    isCompleted: false
  },

  {
    id: 'ex-6-5',
    labNumber: 6,
    number: '6.5',
    title: 'Réinitialisation saine de l\'état (Reset)',
    subtitle: 'Purger les alertes et les succès avant chaque nouvelle tentative',
    sectionId: 'atm-simulator',
    estimatedTime: '4 min',
    difficulty: 'Facile',
    statement: 'Dans AtmComponent, implémentez la méthode reinitialiser() qui remet this.erreur.set(null) et this.succes.set(null) à null.',
    hint: 'this.erreur.set(null); this.succes.set(null);',
    initialCode: `export class AtmComponent {
  erreur = signal<string | null>("Erreur précédente");
  succes = signal<string | null>("Succès précédent");

  reinitialiser(): void {
    // TODO : Réinitialiser erreur et succes à null
  }
}
`,
    solutionCode: `export class AtmComponent {
  erreur = signal<string | null>("Erreur précédente");
  succes = signal<string | null>("Succès précédent");

  reinitialiser(): void {
    this.erreur.set(null);
    this.succes.set(null);
  }
}
`,
    solutionExplanation: [
      'Avant de déclencher une action asynchrone ou risquée, réinitialiser les signaux d\'affichage garantit qu\'aucun ancien message ne subsiste à l\'écran.',
      'C\'est le garant de la cohérence visuelle.'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /this\.erreur\.set\s*\(\s*null\s*\)/,
        label: 'this.erreur.set(null)',
        errorMessage: 'Réinitialisez this.erreur.set(null).'
      },
      {
        type: 'keyword',
        pattern: /this\.succes\.set\s*\(\s*null\s*\)/,
        label: 'this.succes.set(null)',
        errorMessage: 'Réinitialisez this.succes.set(null).'
      }
    ],
    evaluateFn: (sandbox: any) => {
      const results: { criterionId: string; passed: boolean; message?: string }[] = [];
      const CompClass = sandbox.AtmComponent;
      if (!CompClass) return [];

      const cmp = new CompClass();
      cmp.reinitialiser();

      results.push({
        criterionId: 'c1',
        passed: cmp.erreur() === null && cmp.succes() === null
      });

      return results;
    },
    criteria: [
      {
        id: 'c1',
        label: 'Purge des signaux',
        description: 'erreur() et succes() valent tous les deux null après reinitialiser().',
        passed: false,
        hint: 'this.erreur.set(null); this.succes.set(null);'
      }
    ],
    isCompleted: false
  }
];
