import { Injectable } from '@angular/core';
import { ConsoleLogEntry } from '../models/app.models';

export interface ExecutionResult {
  success: boolean;
  logs: ConsoleLogEntry[];
  returnValue?: any;
  error?: string;
  transpiledJs: string;
}

@Injectable({
  providedIn: 'root'
})
export class TypescriptTranspilerService {

  /**
   * Transpilation complète TypeScript vers JavaScript exécutable 100% côté client.
   * Spécifiquement optimisée pour la Séance 8 :
   * - Transformation d'abstract class en class JS valide
   * - Transformation des signatures abstraites sans corps (abstract foo(): number;) en méthodes concrètes
   *   qui lèvent une exception claire si non redéfinies
   * - Effacement total des interfaces (Type Erasure fidèle à tsc)
   * - Suppression des clauses implements Interface1, Interface2
   * - Transformation des Parameter Properties (public readonly nom: string)
   * - Suppression des types, génériques, modificateurs de visibilité
   */
  transpileToJs(tsCode: string): string {
    if (!tsCode) return '';

    let js = tsCode;

    // 1. Transformer les Enums TypeScript
    js = js.replace(/enum\s+([A-Za-z0-9_$]+)\s*\{([^}]+)\}/g, (_match, enumName, body) => {
      const entries = body.split(',').map((e: string) => e.trim()).filter((e: string) => e.length > 0);
      const assignments: string[] = [];
      let autoIndex = 0;

      for (const entry of entries) {
        const parts = entry.split('=').map((p: string) => p.trim());
        const key = parts[0];
        if (parts.length > 1) {
          const val = parts[1];
          const num = Number(val);
          if (!isNaN(num)) {
            autoIndex = num + 1;
            assignments.push(`${enumName}[${enumName}["${key}"] = ${val}] = "${key}";`);
          } else {
            assignments.push(`${enumName}["${key}"] = ${val};`);
          }
        } else {
          assignments.push(`${enumName}[${enumName}["${key}"] = ${autoIndex}] = "${key}";`);
          autoIndex++;
        }
      }

      return `var ${enumName} = (function(${enumName}) {\n  ${assignments.join('\n  ')}\n  return ${enumName};\n})({});`;
    });

    // 2. Transformer les méthodes abstraites sans corps dans les classes :
    // e.g.  abstract demarrer(): string;  OU  protected abstract calculer(): number;
    // En JS standard, une méthode sans corps provoque une erreur de syntaxe.
    // On la remplace par une méthode qui lève une exception explicite si appelée sur la classe mère.
    js = js.replace(/(?:public\s+|protected\s+)?abstract\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\([^)]*\)\s*:\s*[^;\n]+;/g, (_m, methodName) => {
      return `${methodName}() { throw new Error("Méthode abstraite '${methodName}' non implémentée."); }`;
    });
    // Gérer les cas sans type de retour explicite : abstract demarrer();
    js = js.replace(/(?:public\s+|protected\s+)?abstract\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\([^)]*\)\s*;/g, (_m, methodName) => {
      return `${methodName}() { throw new Error("Méthode abstraite '${methodName}' non implémentée."); }`;
    });

    // 3. Nettoyer les clauses "abstract class" -> "class"
    js = js.replace(/\babstract\s+class\b/g, 'class');

    // 4. Nettoyer les clauses "implements Interface1, Interface2"
    // e.g. class Moto extends Vehicule implements Demarrable, Roulable {
    // ou   class Moto implements Demarrable {
    js = js.replace(/\s+implements\s+[^{]+(?=\{)/g, ' ');

    // 5. Supprimer les interfaces (Type Erasure total)
    // Gère les interfaces multilignes et imbriquées simples
    js = js.replace(/interface\s+[A-Za-z0-9_$]+(?:\s*<[^>]*>)?(?:\s+extends\s+[^{]+)?\s*\{[\s\S]*?\}/g, '');

    // 6. Supprimer les types (type Nom = ...)
    js = js.replace(/type\s+[A-Za-z0-9_$]+(?:\s*<[^>]*>)?\s*=[\s\S]*?;/g, '');

    // 7. Transformer les Parameter Properties dans les constructeurs :
    // constructor(private _numero: string, public readonly solde: number) {}
    js = js.replace(/constructor\s*\(([^)]*)\)\s*\{([\s\S]*?)\}/g, (match, paramsStr, bodyStr) => {
      if (!/\b(public|private|protected|readonly)\b/.test(paramsStr)) {
        return match;
      }

      const params = paramsStr.split(',');
      const assignments: string[] = [];
      const cleanParams: string[] = [];

      for (const rawParam of params) {
        const trimmed = rawParam.trim();
        if (!trimmed) continue;

        const isParamProperty = /\b(public|private|protected|readonly)\b/.test(trimmed);
        const strippedMod = trimmed.replace(/\b(public|private|protected|readonly)\s+/g, '');
        const paramNameMatch = strippedMod.match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)/);
        const paramName = paramNameMatch ? paramNameMatch[1] : '';

        if (isParamProperty && paramName) {
          assignments.push(`this.${paramName} = ${paramName};`);
        }
        cleanParams.push(this.cleanParams(strippedMod));
      }

      const superMatch = bodyStr.match(/^\s*super\([^)]*\);?/);
      if (superMatch) {
        const superCall = superMatch[0];
        const restBody = bodyStr.slice(superCall.length);
        return `constructor(${cleanParams.join(', ')}) {\n  ${superCall}\n  ${assignments.join('\n  ')}\n${restBody}}`;
      }

      return `constructor(${cleanParams.join(', ')}) {\n  ${assignments.join('\n  ')}\n${bodyStr}}`;
    });

    // 8. Supprimer les casts "as Type"
    js = js.replace(/\s+as\s+[A-Za-z0-9_$<>\[\]|&\s]+/g, '');

    // 9. Supprimer les modificateurs de visibilité restants
    js = js.replace(/\b(public|private|protected|readonly|abstract)\s+/g, '');

    // 10. Supprimer les types dans les paramètres et les types de retour des fonctions et méthodes
    js = this.cleanFunctionSignatures(js);

    // 11. Supprimer les déclarations de types de variables : let x: number = 5
    js = js.replace(/\b(let|const|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*[^=;]+=/g, '$1 $2 =');

    // 12. Nettoyer les propriétés de classe sans assignation ou avec typage
    js = js.replace(/^\s*(static\s+)?([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*[^=;\n]+=\s*/gm, '  $1$2 = ');
    js = js.replace(/^\s*(static\s+)?([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*[^;\n]+;/gm, '  $1$2;');

    return js;
  }

  private cleanFunctionSignatures(code: string): string {
    // 1. Nettoie les fonctions fléchées : (c: string): string => ...
    let res = code.replace(/\(([^);]*?)\)\s*(?::\s*([^{=]+))?\s*=>/g, (_m, paramList) => {
      const cleanParams = this.cleanParams(paramList);
      return `(${cleanParams}) =>`;
    });

    // 2. Nettoie les fonctions et méthodes classiques : (constructor|function|identifiant)(params): ReturnType {
    // Exclut les mots-clés de contrôle (if, while, for, switch, catch) et ne traverse pas les points-virgules
    return res.replace(/(constructor|function|\b[a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(([^);]*?)\)\s*(?::\s*([^{=]+(?:\{[^}]*\})*))?\s*(\{|=>(?!>))/g, (_match, fnName, paramList, _retType, suffix) => {
      if (fnName === 'if' || fnName === 'while' || fnName === 'for' || fnName === 'switch' || fnName === 'catch') {
        return _match;
      }
      const cleanParams = this.cleanParams(paramList);
      return `${fnName}(${cleanParams}) ${suffix}`;
    });
  }

  private cleanParams(paramStr: string): string {
    if (!paramStr || !paramStr.includes(':')) {
      return paramStr;
    }

    let result = '';
    let inType = false;
    let depth = 0;

    for (let i = 0; i < paramStr.length; i++) {
      const ch = paramStr[i];
      if (ch === '<' || ch === '{' || ch === '(' || ch === '[') {
        depth++;
      } else if (ch === '>' || ch === '}' || ch === ')' || ch === ']') {
        depth--;
      } else if (depth === 0) {
        if (ch === ':') {
          inType = true;
          continue;
        } else if (ch === '=' || ch === ',') {
          inType = false;
        }
      }

      if (!inType) {
        if (depth === 0 && ch === '?' && paramStr[i + 1] === ':') {
          continue;
        }
        result += ch;
      }
    }

    return result.trim();
  }

  /**
   * Exécute le code dans un bac à sable en capturant logs et erreurs
   */
  executeCode(tsCode: string): ExecutionResult {
    const logs: ConsoleLogEntry[] = [];
    const timestamp = () => new Date().toLocaleTimeString();

    const mockConsole = {
      log: (...args: any[]) => {
        logs.push({
          type: 'log',
          text: args.map(a => this.formatArg(a)).join(' '),
          timestamp: timestamp()
        });
      },
      error: (...args: any[]) => {
        logs.push({
          type: 'error',
          text: args.map(a => this.formatArg(a)).join(' '),
          timestamp: timestamp()
        });
      },
      warn: (...args: any[]) => {
        logs.push({
          type: 'warn',
          text: args.map(a => this.formatArg(a)).join(' '),
          timestamp: timestamp()
        });
      },
      info: (...args: any[]) => {
        logs.push({
          type: 'info',
          text: args.map(a => this.formatArg(a)).join(' '),
          timestamp: timestamp()
        });
      }
    };

    let transpiledJs = '';
    try {
      transpiledJs = this.transpileToJs(tsCode);
    } catch (err: any) {
      return {
        success: false,
        logs: [{
          type: 'error',
          text: `Erreur de transpilation : ${err.message}`,
          timestamp: timestamp()
        }],
        error: err.message,
        transpiledJs: ''
      };
    }

    try {
      const runFn = new Function('console', `
        "use strict";
        ${transpiledJs}
      `);

      const returnValue = runFn(mockConsole);

      return {
        success: true,
        logs,
        returnValue,
        transpiledJs
      };
    } catch (err: any) {
      logs.push({
        type: 'error',
        text: `Runtime Error : ${err.message}`,
        timestamp: timestamp()
      });

      return {
        success: false,
        logs,
        error: err.message,
        transpiledJs
      };
    }
  }

  private formatArg(arg: any): string {
    if (arg === null) return 'null';
    if (arg === undefined) return 'undefined';
    if (typeof arg === 'string') return arg;
    if (typeof arg === 'number' || typeof arg === 'boolean') return String(arg);
    if (typeof arg === 'function') return `[Function: ${arg.name || 'anonymous'}]`;
    if (Array.isArray(arg)) {
      try {
        return JSON.stringify(arg);
      } catch {
        return '[Array]';
      }
    }
    if (typeof arg === 'object') {
      try {
        return JSON.stringify(arg, null, 2);
      } catch {
        return '[Object]';
      }
    }
    return String(arg);
  }
}
