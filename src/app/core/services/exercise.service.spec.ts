import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { ExerciseService } from './exercise.service';
import { TypescriptTranspilerService } from './typescript-transpiler.service';

describe('ExerciseService & Solution Validation Suite', () => {
  let service: ExerciseService;
  let transpiler: TypescriptTranspilerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExerciseService, TypescriptTranspilerService]
    });
    service = TestBed.inject(ExerciseService);
    transpiler = TestBed.inject(TypescriptTranspilerService);
  });

  it('should have exactly 21 exercises across 5 labs', () => {
    const list = service.exercises();
    expect(list.length).toBe(21);

    const lab1 = list.filter(e => e.labNumber === 1);
    const lab2 = list.filter(e => e.labNumber === 2);
    const lab3 = list.filter(e => e.labNumber === 3);
    const lab4 = list.filter(e => e.labNumber === 4);
    const lab5 = list.filter(e => e.labNumber === 5);

    expect(lab1.length).toBe(5);
    expect(lab2.length).toBe(4);
    expect(lab3.length).toBe(4);
    expect(lab4.length).toBe(4);
    expect(lab5.length).toBe(4);
  });

  it('should validate 100% of solutions for all 21 exercises', () => {
    const list = service.exercises();

    for (const ex of list) {
      const result = service.validateExercise(ex.id, ex.solutionCode);
      if (!result.success) {
        console.error(`Validation failed for ${ex.id} (${ex.number} - ${ex.title}):`, {
          error: result.error,
          logs: result.logs
        });
      }
      expect(result.success, `Solution for ${ex.id} should validate all criteria`).toBe(true);

      // Vérifier que tous les critères sont passés
      const updated = service.exercises().find(e => e.id === ex.id);
      expect(updated).toBeDefined();
      const allPassed = updated!.criteria.every(c => c.passed);
      expect(allPassed, `All criteria of ${ex.id} must be marked as passed`).toBe(true);
    }
  });

  it('should transpile abstract classes and pure signatures cleanly', () => {
    const ts = `
      abstract class Animal {
        constructor(public nom: string) {}
        abstract crier(): string;
      }
      class Chien extends Animal {
        crier(): string {
          return this.nom + " aboie !";
        }
      }
      const c = new Chien("Rex");
      console.log(c.crier());
    `;

    const res = transpiler.executeCode(ts);
    expect(res.success).toBe(true);
    expect(res.logs.some(l => l.text.includes("Rex aboie !"))).toBe(true);
  });

  it('should transpile interfaces with zero runtime artifact', () => {
    const ts = `
      interface Volant { voler(): string; }
      class Oiseau implements Volant {
        voler(): string { return "Vole haut"; }
      }
      const o = new Oiseau();
      console.log(o.voler());
    `;

    const res = transpiler.executeCode(ts);
    expect(res.success).toBe(true);
    expect(res.logs.some(l => l.text.includes("Vole haut"))).toBe(true);
    // Vérifier que l'interface a disparu
    expect(res.transpiledJs.includes("interface Volant")).toBe(false);
  });
});
