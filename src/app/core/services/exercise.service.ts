import { Injectable, signal, computed, inject } from '@angular/core';
import { 
  Exercise, 
  ExerciseDef, 
  ValidationSummary, 
  ConsoleLogEntry 
} from '../models/app.models';
import { ConfettiService } from './confetti.service';
import { LAB1_EXERCISES } from '../data/lab1.data';
import { LAB2_EXERCISES } from '../data/lab2.data';
import { LAB3_EXERCISES } from '../data/lab3.data';
import { LAB4_EXERCISES } from '../data/lab4.data';
import { LAB5_EXERCISES } from '../data/lab5.data';
import { LAB6_EXERCISES } from '../data/lab6.data';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {
  private readonly STORAGE_KEY = 'seance10_exercises_progress';
  private readonly confetti = inject(ConfettiService);

  private readonly RAW_EXERCISES: ExerciseDef[] = [
    ...LAB1_EXERCISES,
    ...LAB2_EXERCISES,
    ...LAB3_EXERCISES,
    ...LAB4_EXERCISES,
    ...LAB5_EXERCISES,
    ...LAB6_EXERCISES
  ];

  readonly exercises = signal<Exercise[]>([]);
  readonly selectedExerciseId = signal<string>('ex-1-1');

  readonly totalCount = computed(() => this.exercises().length);
  readonly completedCount = computed(() => this.exercises().filter(e => e.isCompleted).length);
  readonly progressPercentage = computed(() => {
    const total = this.totalCount();
    if (total === 0) return 0;
    return Math.round((this.completedCount() / total) * 100);
  });

  readonly activeExercise = computed(() => {
    const id = this.selectedExerciseId();
    return this.exercises().find(e => e.id === id) || this.exercises()[0];
  });

  constructor() {
    this.initExercises();
  }

  private initExercises(): void {
    let savedProgress: Record<string, boolean> = {};
    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(this.STORAGE_KEY);
        if (raw) savedProgress = JSON.parse(raw);
      } catch (e) {}
    }

    const list: Exercise[] = this.RAW_EXERCISES.map(def => ({
      ...def,
      currentCode: def.initialCode,
      isCompleted: !!savedProgress[def.id],
      criteria: def.criteria.map(c => ({
        ...c,
        passed: !!savedProgress[def.id]
      }))
    }));

    this.exercises.set(list);
  }

  selectExercise(id: string): void {
    this.selectedExerciseId.set(id);
  }

  updateCode(id: string, code: string): void {
    this.exercises.update(list => 
      list.map(e => e.id === id ? { ...e, currentCode: code } : e)
    );
  }

  injectSolution(id: string): void {
    const ex = this.exercises().find(e => e.id === id);
    if (!ex) return;
    this.updateCode(id, ex.solutionCode);
  }

  resetExercise(id: string): void {
    const ex = this.exercises().find(e => e.id === id);
    if (!ex) return;
    this.updateCode(id, ex.initialCode);
  }

  evaluateExercise(id: string): ValidationSummary {
    const ex = this.exercises().find(e => e.id === id);
    if (!ex) {
      return {
        success: false,
        passedCount: 0,
        totalCount: 0,
        messages: ['Exercice introuvable'],
        consoleLogs: []
      };
    }

    const logs: ConsoleLogEntry[] = [];
    const messages: string[] = [];
    const rawLogs: string[] = [];
    let syntaxPassed = true;
    let executionError: string | undefined;
    let sandboxContext: any = {};

    // 1. Vérification des contraintes syntaxiques (en ignorant les commentaires)
    const codeWithoutComments = ex.currentCode
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/.*/g, '');

    for (const req of ex.syntaxRequirements) {
      const regex = typeof req.pattern === 'string' ? new RegExp(req.pattern) : req.pattern;
      if (req.type === 'forbidden') {
        if (regex.test(codeWithoutComments)) {
          syntaxPassed = false;
          messages.push(`Syntaxe interdite : ${req.errorMessage}`);
          logs.push({
            type: 'error',
            timestamp: new Date().toLocaleTimeString(),
            message: `✖ Erreur : ${req.errorMessage}`
          });
        }
      } else {
        if (!regex.test(codeWithoutComments)) {
          syntaxPassed = false;
          messages.push(req.errorMessage);
          logs.push({
            type: 'warn',
            timestamp: new Date().toLocaleTimeString(),
            message: `⚠ Critère manquant : ${req.errorMessage}`
          });
        }
      }
    }

    // 2. Transpilation et Exécution Sandboxée
    try {
      const transpileJs = this.transpileTsToJs(ex.currentCode);

      const mockSignal = (initialVal: any) => {
        let val = initialVal;
        const s: any = () => val;
        s.set = (newVal: any) => { val = newVal; };
        s.update = (fn: (prev: any) => any) => { val = fn(val); };
        return s;
      };

      const mockComputed = (fn: () => any) => {
        return () => fn();
      };

      const customConsole = {
        log: (...args: any[]) => {
          const str = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
          rawLogs.push(str);
          logs.push({
            type: 'log',
            timestamp: new Date().toLocaleTimeString(),
            message: str
          });
        },
        info: (...args: any[]) => {
          const str = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
          rawLogs.push(str);
          logs.push({
            type: 'info',
            timestamp: new Date().toLocaleTimeString(),
            message: str
          });
        },
        warn: (...args: any[]) => {
          const str = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
          rawLogs.push(str);
          logs.push({
            type: 'warn',
            timestamp: new Date().toLocaleTimeString(),
            message: str
          });
        },
        error: (...args: any[]) => {
          const str = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
          rawLogs.push(str);
          logs.push({
            type: 'error',
            timestamp: new Date().toLocaleTimeString(),
            message: str
          });
        }
      };

      const executionCode = `
        ${transpileJs}
        return {
          CompteBancaire: typeof CompteBancaire !== 'undefined' ? CompteBancaire : undefined,
          Distributeur: typeof Distributeur !== 'undefined' ? Distributeur : undefined,
          executerEnSecurite: typeof executerEnSecurite !== 'undefined' ? executerEnSecurite : undefined,
          lireFichier: typeof lireFichier !== 'undefined' ? lireFichier : undefined,
          GestionnaireRequete: typeof GestionnaireRequete !== 'undefined' ? GestionnaireRequete : undefined,
          calculerRatio: typeof calculerRatio !== 'undefined' ? calculerRatio : undefined,
          capturerMessage: typeof capturerMessage !== 'undefined' ? capturerMessage : undefined,
          analyserErreur: typeof analyserErreur !== 'undefined' ? analyserErreur : undefined,
          extraireMessage: typeof extraireMessage !== 'undefined' ? extraireMessage : undefined,
          executerAvecDiagnostic: typeof executerAvecDiagnostic !== 'undefined' ? executerAvecDiagnostic : undefined,
          ErreurValidation: typeof ErreurValidation !== 'undefined' ? ErreurValidation : undefined,
          filtrerEtRelancer: typeof filtrerEtRelancer !== 'undefined' ? filtrerEtRelancer : undefined,
          AppError: typeof AppError !== 'undefined' ? AppError : undefined,
          SoldeInsuffisantError: typeof SoldeInsuffisantError !== 'undefined' ? SoldeInsuffisantError : undefined,
          BanqueError: typeof BanqueError !== 'undefined' ? BanqueError : undefined,
          routerErreur: typeof routerErreur !== 'undefined' ? routerErreur : undefined,
          CreneauIndisponibleError: typeof CreneauIndisponibleError !== 'undefined' ? CreneauIndisponibleError : undefined,
          ReservationService: typeof ReservationService !== 'undefined' ? ReservationService : undefined,
          chargerConfiguration: typeof chargerConfiguration !== 'undefined' ? chargerConfiguration : undefined,
          trouverUtilisateurParEmail: typeof trouverUtilisateurParEmail !== 'undefined' ? trouverUtilisateurParEmail : undefined,
          AtmComponent: typeof AtmComponent !== 'undefined' ? AtmComponent : undefined,
          genererAlerteHtml: typeof genererAlerteHtml !== 'undefined' ? genererAlerteHtml : undefined
        };
      `;

      const runnerFn = new Function('console', 'signal', 'computed', executionCode);
      sandboxContext = runnerFn(customConsole, mockSignal, mockComputed);

      // Évaluation des critères
      const evalResults = ex.evaluateFn(sandboxContext, rawLogs);

      const updatedCriteria = ex.criteria.map(c => {
        const found = evalResults.find(r => r.criterionId === c.id);
        const passed = syntaxPassed && !!found?.passed;
        if (found && !found.passed && found.message) {
          messages.push(found.message);
        }
        return { ...c, passed };
      });

      const allPassed = syntaxPassed && updatedCriteria.every(c => c.passed);

      this.exercises.update(list => 
        list.map(e => e.id === id ? { 
          ...e, 
          criteria: updatedCriteria,
          isCompleted: allPassed
        } : e)
      );

      if (allPassed) {
        this.saveProgress();
        this.confetti.triggerSuccess();
        logs.push({
          type: 'success',
          timestamp: new Date().toLocaleTimeString(),
          message: `✔ Félicitations ! Tous les critères de l'exercice ${ex.number} sont validés !`
        });
      }

      return {
        success: allPassed,
        passedCount: updatedCriteria.filter(c => c.passed).length,
        totalCount: updatedCriteria.length,
        messages,
        consoleLogs: logs
      };

    } catch (err: any) {
      executionError = err.message || String(err);
      logs.push({
        type: 'error',
        timestamp: new Date().toLocaleTimeString(),
        message: `Erreur d'exécution : ${executionError}`
      });

      const failedCriteria = ex.criteria.map(c => ({ ...c, passed: false }));
      this.exercises.update(list => 
        list.map(e => e.id === id ? { ...e, criteria: failedCriteria, isCompleted: false } : e)
      );

      return {
        success: false,
        passedCount: 0,
        totalCount: ex.criteria.length,
        messages: [executionError || 'Erreur d\'exécution du code'],
        consoleLogs: logs,
        executionError
      };
    }
  }

  private transpileTsToJs(tsCode: string): string {
    let js = tsCode;

    // 0. Supprimer les interfaces TS et types complexes dans les paramètres pour éviter les collisions de parenthèses/accolades
    js = js.replace(/interface\s+[A-Za-z0-9_]+(?:\s*<[^>]+>)?(?:\s+extends\s+[^{]+)?\s*\{[\s\S]*?\}/g, '');
    js = js.replace(/type\s+[A-Za-z0-9_]+(?:\s*<[^>]+>)?\s*=\s*(?:\{[\s\S]*?\}|[^;]+);/g, '');
    js = js.replace(/:\s*\([^)]*\)\s*=>\s*[A-Za-z0-9_<>|&[\] ]+/g, '');
    js = js.replace(/:\s*\{[^{}]*\}/g, '');

    // 1. Assigner automatiquement les parameter properties dans les constructeurs (en respectant les blocs imbriqués)
    const ctorRegex = /constructor\s*\(/g;
    let match: RegExpExecArray | null;
    let newJs = '';
    let lastIndex = 0;

    while ((match = ctorRegex.exec(js)) !== null) {
      newJs += js.substring(lastIndex, match.index);
      const startOfParams = ctorRegex.lastIndex;
      let pDepth = 1;
      let p = startOfParams;
      while (p < js.length && pDepth > 0) {
        if (js[p] === '(') pDepth++;
        else if (js[p] === ')') pDepth--;
        p++;
      }
      const rawParams = js.substring(startOfParams, p - 1);
      while (p < js.length && js[p] !== '{') p++;
      p++; // juste après {
      const startOfBody = p;
      let bDepth = 1;
      let inString: string | null = null;
      let escaped = false;

      while (p < js.length && bDepth > 0) {
        const char = js[p];
        if (inString) {
          if (escaped) escaped = false;
          else if (char === '\\') escaped = true;
          else if (char === inString) inString = null;
        } else {
          if (char === '"' || char === "'" || char === '`') inString = char;
          else if (char === '{') bDepth++;
          else if (char === '}') bDepth--;
        }
        p++;
      }

      const body = js.substring(startOfBody, p - 1);
      lastIndex = p;
      ctorRegex.lastIndex = p;

      const assignments: string[] = [];
      const cleanedParams = rawParams.split(',').map(param => {
        let trimmed = param.trim();
        const propMatch = trimmed.match(/^(?:(?:public|private|protected|readonly)\s+)+([A-Za-z0-9_]+)/);
        if (propMatch) {
          assignments.push(`this.${propMatch[1]} = ${propMatch[1]};`);
        }
        trimmed = trimmed.replace(/^(?:(?:public|private|protected|readonly)\s+)+/, '');
        trimmed = trimmed.replace(/\?/, '');
        const colonIdx = trimmed.indexOf(':');
        if (colonIdx !== -1) {
          trimmed = trimmed.slice(0, colonIdx).trim();
        }
        return trimmed;
      }).join(', ');

      let newBody = body;
      if (assignments.length > 0) {
        const assignStr = assignments.join('\n    ');
        const superIdx = body.indexOf('super(');
        if (superIdx !== -1) {
          let parenDepth = 1;
          let sp = superIdx + 6;
          while (sp < body.length && parenDepth > 0) {
            if (body[sp] === '(') parenDepth++;
            else if (body[sp] === ')') parenDepth--;
            sp++;
          }
          while (sp < body.length && (body[sp] === ';' || body[sp] === ' ' || body[sp] === '\t' || body[sp] === '\n')) {
            sp++;
          }
          const superCallAndSemi = body.slice(0, sp);
          const afterSuper = body.slice(sp);
          newBody = `${superCallAndSemi}\n    ${assignStr}\n${afterSuper}`;
        } else {
          newBody = `\n    ${assignStr}\n${body}`;
        }
      }

      newJs += `constructor(${cleanedParams}) {${newBody}}`;
    }

    newJs += js.substring(lastIndex);
    js = newJs;

    // 2. Supprimer les exports et imports
    js = js.replace(/export\s+/g, '');
    js = js.replace(/import\s+[^;]+;/g, '');

    // 3. Supprimer les interfaces TS
    js = js.replace(/interface\s+[A-Za-z0-9_]+(?:\s*<[^>]+>)?(?:\s+extends\s+[^{]+)?\s*\{[\s\S]*?\}/g, '');

    // 4. Supprimer les types TS
    js = js.replace(/type\s+[A-Za-z0-9_]+(?:\s*<[^>]+>)?\s*=\s*(?:\{[\s\S]*?\}|[^;]+);/g, '');

    // 5. Supprimer implements
    js = js.replace(/\s+implements\s+[^{]+(?=\{)/g, '');

    // 6. Supprimer abstract class -> class
    js = js.replace(/\babstract\s+class\b/g, 'class');

    // 7. Supprimer les modificateurs de visibilité
    js = js.replace(/\b(public|private|protected|readonly|override)\s+/g, '');

    // 8. Supprimer les génériques Signal<T> -> Signal
    js = js.replace(/signal\s*<[^>]+>/g, 'signal');
    js = js.replace(/computed\s*<[^>]+>/g, 'computed');

    // 9. Supprimer les casts 'as Type'
    js = js.replace(/\s+as\s+[A-Za-z0-9_<>|[\] ]+/g, '');

    // 10. Supprimer les typages simples de variables : let/const/var x: Type = val -> let/const/var x = val
    js = js.replace(/(\b(?:let|const|var)\s+[A-Za-z0-9_]+)\s*:\s*[A-Za-z0-9_<>[\]| ]+\s*=/g, '$1 =');

    // 10b. Nettoyer les propriétés de classe typées
    js = js.replace(/^\s*(?:static\s+)?([A-Za-z0-9_$]+)\s*:\s*[^=;\n]+=\s*/gm, '  $1 = ');
    js = js.replace(/^\s*(?:static\s+)?([A-Za-z0-9_$]+)\s*:\s*[^;\n]+;/gm, '  $1;');

    // 10c. Nettoyer le typage dans catch (error: unknown) -> catch (error)
    js = js.replace(/catch\s*\(\s*([A-Za-z0-9_$]+)\s*:[^)]+\)/g, 'catch ($1)');

    // 10d. Supprimer les types de callbacks fonctionnels dans les paramètres : action: () => void -> action
    js = js.replace(/:\s*\([^)]*\)\s*=>\s*[A-Za-z0-9_<>|&[\] ]+/g, '');

    // 10e. Supprimer les types d'objets littéraux dans les paramètres : opt?: { cause: unknown } -> opt?
    js = js.replace(/:\s*\{[^}]*\}/g, '');

    // 10f. Supprimer les types de retour de méthode : ): ReturnType { -> ) {
    js = js.replace(/\)\s*:\s*[A-Za-z0-9_$<>\[\]|&\s]+\s*\{/g, ') {');
    js = js.replace(/\)\s*:\s*[A-Za-z0-9_$<>\[\]|&\s]+\s*=>/g, ') =>');

    // 11. Nettoyer les paramètres de fonctions
    const cleanParams = (params: string) => {
      return params.split(',').map(p => {
        let s = p.trim();
        if (!s) return '';
        const eqIdx = s.indexOf('=');
        let defVal = '';
        if (eqIdx !== -1) {
          defVal = ' = ' + s.slice(eqIdx + 1).trim();
          s = s.slice(0, eqIdx).trim();
        }
        s = s.replace(/^(?:(?:public|private|protected|readonly)\s+)+/, '');
        s = s.replace(/\?/, '');
        const colonIdx = s.indexOf(':');
        if (colonIdx !== -1) {
          s = s.slice(0, colonIdx).trim();
        }
        return s + defVal;
      }).join(', ');
    };

    js = js.replace(/\b(function(?:\s+[A-Za-z0-9_]+)?|[A-Za-z0-9_]+)\s*\(([^)]*)\)\s*(?::\s*[A-Za-z0-9_<>[\]| ]+)?\s*\{/g, (match, prefix, params) => {
      const trimmedPrefix = prefix.trim();
      if (['if', 'while', 'for', 'switch', 'catch'].includes(trimmedPrefix)) {
        return match;
      }
      return `${prefix}(${cleanParams(params)}) {`;
    });

    // 12. Supprimer les types de paramètres dans les fonctions fléchées
    js = js.replace(/\(([^)]*)\)\s*(?::\s*[A-Za-z0-9_<>[\]| ]+)?\s*=>/g, (match, params) => {
      return `(${cleanParams(params)}) =>`;
    });

    return js;
  }

  private saveProgress(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const progress: Record<string, boolean> = {};
      this.exercises().forEach(e => {
        if (e.isCompleted) progress[e.id] = true;
      });
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {}
  }
}
