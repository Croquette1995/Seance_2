import { ExerciseDef } from '../models/app.models';

export const LAB1_EXERCISES: ExerciseDef[] = [
  {
    id: 'ex-1-1',
    labNumber: 1,
    number: '1.1',
    title: 'Invariant dans un constructeur',
    subtitle: 'Interdire formellement l\'instanciation d\'un objet corrompu en mémoire',
    sectionId: 'sentinel-vs-exceptions',
    estimatedTime: '4 min',
    difficulty: 'Débutant',
    statement: 'Complétez le constructeur de la classe CompteBancaire pour lever une exception new Error("Le solde initial ne peut pas être négatif") si le solde transmis est strictement inférieur à 0.',
    hint: 'Un constructeur ne peut pas renvoyer de code de retour. Utilisez if (solde < 0) { throw new Error(...); }',
    initialCode: `export class CompteBancaire {
  constructor(
    public titulaire: string,
    private solde: number
  ) {
    // TODO : Si solde < 0, lever new Error("Le solde initial ne peut pas être négatif")
  }

  getSolde(): number {
    return this.solde;
  }
}
`,
    solutionCode: `export class CompteBancaire {
  constructor(
    public titulaire: string,
    private solde: number
  ) {
    if (solde < 0) {
      throw new Error("Le solde initial ne peut pas être négatif");
    }
  }

  getSolde(): number {
    return this.solde;
  }
}
`,
    solutionExplanation: [
      'Un constructeur renvoie toujours la nouvelle instance créée. Il est techniquement impossible de lui faire renvoyer un code sentinelle comme -1 ou null.',
      'Le mot-clé throw interrompt instantanément la construction de l\'objet : aucune référence corrompue n\'est stockée en mémoire vive.'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /throw\s+new\s+Error/,
        label: 'throw new Error',
        errorMessage: 'Vous devez utiliser throw new Error(...) pour signaler la violation d\'invariant.'
      }
    ],
    evaluateFn: (sandbox: any) => {
      const results: { criterionId: string; passed: boolean; message?: string }[] = [];
      const CompteClass = sandbox.CompteBancaire;

      if (!CompteClass) {
        return [
          { criterionId: 'c1', passed: false, message: 'Classe CompteBancaire introuvable.' },
          { criterionId: 'c2', passed: false, message: 'Classe CompteBancaire introuvable.' }
        ];
      }

      // Critère 1 : Instanciation nominale
      try {
        const c = new CompteClass('Alice', 100);
        results.push({ criterionId: 'c1', passed: c.getSolde() === 100 });
      } catch (err: any) {
        results.push({ criterionId: 'c1', passed: false, message: `Échec cas nominal : ${err.message}` });
      }

      // Critère 2 : Rejet du solde négatif
      try {
        new CompteClass('Bob', -20);
        results.push({ criterionId: 'c2', passed: false, message: 'Le constructeur aurait dû lever une exception pour un solde de -20 !' });
      } catch (err: any) {
        const passed = err.message === 'Le solde initial ne peut pas être négatif';
        results.push({
          criterionId: 'c2',
          passed,
          message: passed ? undefined : `Message attendu : "Le solde initial ne peut pas être négatif", reçu : "${err.message}"`
        });
      }

      return results;
    },
    criteria: [
      {
        id: 'c1',
        label: 'Instanciation valide',
        description: 'Un compte avec solde positif (ex: 100 €) est créé sans erreur.',
        passed: false,
        hint: 'Assurez-vous de ne pas lever d\'exception quand solde >= 0.'
      },
      {
        id: 'c2',
        label: 'Protection contre solde négatif',
        description: 'new CompteBancaire("Bob", -20) lève Error("Le solde initial ne peut pas être négatif").',
        passed: false,
        hint: 'Vérifiez if (solde < 0) { throw new Error("Le solde initial ne peut pas être négatif"); }'
      }
    ],
    isCompleted: false
  },

  {
    id: 'ex-1-2',
    labNumber: 1,
    number: '1.2',
    title: 'Élimination du code sentinelle',
    subtitle: 'Remplacer return -1 par une exception explicite',
    sectionId: 'sentinel-vs-exceptions',
    estimatedTime: '4 min',
    difficulty: 'Débutant',
    statement: 'Dans la méthode retirer(montant), supprimez le code sentinelle return -1 et levez à la place new Error("Solde insuffisant") lorsque le montant demandé excède le solde disponible.',
    hint: 'Remplacez return -1 par throw new Error("Solde insuffisant");',
    initialCode: `export class CompteBancaire {
  constructor(public titulaire: string, private solde: number) {}

  retirer(montant: number): number {
    // ❌ ANTI-PATTERN : Renvoyer -1
    if (montant > this.solde) {
      return -1; // TODO : Remplacer par throw new Error("Solde insuffisant")
    }
    this.solde -= montant;
    return this.solde;
  }

  getSolde(): number {
    return this.solde;
  }
}
`,
    solutionCode: `export class CompteBancaire {
  constructor(public titulaire: string, private solde: number) {}

  retirer(montant: number): number {
    if (montant > this.solde) {
      throw new Error("Solde insuffisant");
    }
    this.solde -= montant;
    return this.solde;
  }

  getSolde(): number {
    return this.solde;
  }
}
`,
    solutionExplanation: [
      'En levant une exception au lieu de retourner -1, l\'appelant ne peut plus oublier de traiter l\'anomalie.',
      'Le résultat renvoyé par la méthode ne mélange plus le solde réel et les erreurs.'
    ],
    syntaxRequirements: [
      {
        type: 'forbidden',
        pattern: /return\s+-1/,
        label: 'Pas de return -1',
        errorMessage: 'Supprimez l\'instruction return -1.'
      },
      {
        type: 'keyword',
        pattern: /throw\s+new\s+Error\s*\(\s*["']Solde insuffisant["']\s*\)/,
        label: 'throw new Error("Solde insuffisant")',
        errorMessage: 'Levez new Error("Solde insuffisant") quand le montant dépasse le solde.'
      }
    ],
    evaluateFn: (sandbox: any) => {
      const results: { criterionId: string; passed: boolean; message?: string }[] = [];
      const CompteClass = sandbox.CompteBancaire;

      if (!CompteClass) return [];

      const c = new CompteClass('Alice', 100);

      // Critère 1 : Retrait nominal
      const solde1 = c.retirer(40);
      results.push({ criterionId: 'c1', passed: solde1 === 60 && c.getSolde() === 60 });

      // Critère 2 : Exception levée lors du dépassement
      try {
        c.retirer(90); // 90 > 60
        results.push({ criterionId: 'c2', passed: false, message: 'retirer(90) aurait dû lever une exception !' });
      } catch (err: any) {
        const passed = err.message === 'Solde insuffisant' && c.getSolde() === 60;
        results.push({ criterionId: 'c2', passed, message: passed ? undefined : `Message ou intégrité incorrecte : ${err.message}` });
      }

      return results;
    },
    criteria: [
      {
        id: 'c1',
        label: 'Retrait nominal fonctionnel',
        description: 'retirer(40) sur un solde de 100 déduit 40 et retourne 60.',
        passed: false,
        hint: 'this.solde -= montant; return this.solde;'
      },
      {
        id: 'c2',
        label: 'Exception Solde insuffisant',
        description: 'retirer(90) sur un solde de 60 lève Error("Solde insuffisant") sans altérer le solde.',
        passed: false,
        hint: 'Vérifiez if (montant > this.solde) throw new Error("Solde insuffisant");'
      }
    ],
    isCompleted: false
  },

  {
    id: 'ex-1-3',
    labNumber: 1,
    number: '1.3',
    title: 'Précondition de paramètre',
    subtitle: 'Valider les arguments d\'une méthode avant tout effet de bord',
    sectionId: 'stack-unwinding',
    estimatedTime: '4 min',
    difficulty: 'Facile',
    statement: 'Dans la méthode transferer(montant, destinataire), levez une Error("Montant invalide") si le montant est inférieur ou égal à zéro, puis effectuez le virement (débit de l\'émetteur et crédit du destinataire).',
    hint: 'if (montant <= 0) throw new Error("Montant invalide"); puis this.retirer(montant); destinataire.deposer(montant);',
    initialCode: `export class CompteBancaire {
  constructor(public titulaire: string, private solde: number) {}

  deposer(montant: number): void {
    this.solde += montant;
  }

  retirer(montant: number): void {
    if (montant > this.solde) throw new Error("Solde insuffisant");
    this.solde -= montant;
  }

  transferer(montant: number, destinataire: CompteBancaire): void {
    // TODO : Si montant <= 0, lever new Error("Montant invalide")
    // Puis débiter l'émetteur et déposer sur le destinataire
  }

  getSolde(): number {
    return this.solde;
  }
}
`,
    solutionCode: `export class CompteBancaire {
  constructor(public titulaire: string, private solde: number) {}

  deposer(montant: number): void {
    this.solde += montant;
  }

  retirer(montant: number): void {
    if (montant > this.solde) throw new Error("Solde insuffisant");
    this.solde -= montant;
  }

  transferer(montant: number, destinataire: CompteBancaire): void {
    if (montant <= 0) {
      throw new Error("Montant invalide");
    }
    this.retirer(montant);
    destinataire.deposer(montant);
  }

  getSolde(): number {
    return this.solde;
  }
}
`,
    solutionExplanation: [
      'Valider les préconditions en tête de méthode (Guard Clause) garantit qu\'aucun argent n\'est débité si le montant est négatif ou nul.',
      'Si le montant est invalide, l\'exception court-circuite la suite du virement.'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /throw\s+new\s+Error\s*\(\s*["']Montant invalide["']\s*\)/,
        label: 'throw new Error("Montant invalide")',
        errorMessage: 'Levez new Error("Montant invalide") si montant <= 0.'
      }
    ],
    evaluateFn: (sandbox: any) => {
      const results: { criterionId: string; passed: boolean; message?: string }[] = [];
      const CompteClass = sandbox.CompteBancaire;
      if (!CompteClass) return [];

      const alice = new CompteClass('Alice', 100);
      const bob = new CompteClass('Bob', 50);

      // Critère 1 : Rejet montant <= 0
      try {
        alice.transferer(-10, bob);
        results.push({ criterionId: 'c1', passed: false, message: 'transferer(-10) aurait dû lever une exception !' });
      } catch (err: any) {
        const passed = err.message === 'Montant invalide' && alice.getSolde() === 100 && bob.getSolde() === 50;
        results.push({ criterionId: 'c1', passed, message: passed ? undefined : `Rejet incorrect : ${err.message}` });
      }

      // Critère 2 : Virement valide
      try {
        alice.transferer(30, bob);
        const passed = alice.getSolde() === 70 && bob.getSolde() === 80;
        results.push({ criterionId: 'c2', passed, message: passed ? undefined : 'Soldes mal mis à jour après virement.' });
      } catch (err: any) {
        results.push({ criterionId: 'c2', passed: false, message: err.message });
      }

      return results;
    },
    criteria: [
      {
        id: 'c1',
        label: 'Précondition de montant positif',
        description: 'transferer(-10) lève Error("Montant invalide") sans modifier les soldes.',
        passed: false,
        hint: 'Vérifiez if (montant <= 0) throw new Error("Montant invalide");'
      },
      {
        id: 'c2',
        label: 'Transfert nominal réussi',
        description: 'Alice (100) transfère 30 à Bob (50) -> Alice a 70 et Bob a 80.',
        passed: false,
        hint: 'this.retirer(montant); destinataire.deposer(montant);'
      }
    ],
    isCompleted: false
  },

  {
    id: 'ex-1-4',
    labNumber: 1,
    number: '1.4',
    title: 'Protection de l\'état & Inviolabilité',
    subtitle: 'Garantir qu\'aucune donnée n\'est corrompue en cas de panne à mi-parcours',
    sectionId: 'stack-unwinding',
    estimatedTime: '5 min',
    difficulty: 'Facile',
    statement: 'Dans Distributeur.distribuer(montant), vérifiez d\'abord que this.actif est vrai (sinon lever Error("Distributeur inactif")) AVANT d\'incrémenter this.compteurTransactions.',
    hint: 'Ne modifiez jamais les compteurs d\'état avant d\'avoir validé toutes les préconditions.',
    initialCode: `export class Distributeur {
  public compteurTransactions: number = 0;

  constructor(public actif: boolean, public reserve: number) {}

  distribuer(montant: number): void {
    // ❌ ERREUR : modifier l'état avant de vérifier !
    // TODO : Réorganiser le code pour vérifier this.actif en premier
    this.compteurTransactions++;
    if (!this.actif) {
      throw new Error("Distributeur inactif");
    }
    this.reserve -= montant;
  }
}
`,
    solutionCode: `export class Distributeur {
  public compteurTransactions: number = 0;

  constructor(public actif: boolean, public reserve: number) {}

  distribuer(montant: number): void {
    if (!this.actif) {
      throw new Error("Distributeur inactif");
    }
    this.compteurTransactions++;
    this.reserve -= montant;
  }
}
`,
    solutionExplanation: [
      'Si un compteur est incrémenté avant le throw, l\'état de l\'objet est faussé en cas d\'échec.',
      'Placer les validations en premier assure qu\'en cas d\'exception, aucune variable n\'a été polluée.'
    ],
    syntaxRequirements: [
      {
        type: 'keyword',
        pattern: /if\s*\(!this\.actif\)/,
        label: 'Vérification préalable',
        errorMessage: 'Vérifiez if (!this.actif) en tout début de méthode.'
      }
    ],
    evaluateFn: (sandbox: any) => {
      const results: { criterionId: string; passed: boolean; message?: string }[] = [];
      const DistClass = sandbox.Distributeur;
      if (!DistClass) return [];

      // Critère 1 : Opération nominale
      const d1 = new DistClass(true, 1000);
      d1.distribuer(100);
      results.push({
        criterionId: 'c1',
        passed: d1.compteurTransactions === 1 && d1.reserve === 900
      });

      // Critère 2 : Inviolabilité en cas d'inactivité
      const d2 = new DistClass(false, 1000);
      try {
        d2.distribuer(100);
        results.push({ criterionId: 'c2', passed: false, message: 'Aurait dû lever une exception.' });
      } catch (err: any) {
        const passed = d2.compteurTransactions === 0 && d2.reserve === 1000;
        results.push({
          criterionId: 'c2',
          passed,
          message: passed ? undefined : 'compteurTransactions ou réserve a été modifié à tort !'
        });
      }

      return results;
    },
    criteria: [
      {
        id: 'c1',
        label: 'Distribution nominale',
        description: 'Distributeur actif : déduit la réserve et incrémente compteurTransactions.',
        passed: false,
        hint: 'this.compteurTransactions++; this.reserve -= montant;'
      },
      {
        id: 'c2',
        label: 'Préservation absolue de l\'état',
        description: 'Distributeur inactif : lève l\'erreur sans toucher à compteurTransactions (doit rester 0).',
        passed: false,
        hint: 'Placez la vérification if (!this.actif) avant this.compteurTransactions++'
      }
    ],
    isCompleted: false
  }
];
