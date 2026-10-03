import '@angular/compiler';
import { describe, it, expect, beforeAll } from 'vitest';
import { createEnvironmentInjector } from '@angular/core';
import { ExerciseService } from './exercise.service';
import { ConfettiService } from './confetti.service';

describe('Vérification Automatique des 26 Micro-Exercices de la Séance 10', () => {
  let service: ExerciseService;

  beforeAll(() => {
    const injector = createEnvironmentInjector([ConfettiService, ExerciseService], null as any);
    service = injector.get(ExerciseService);
  });

  it('doit charger exactement 26 exercices répartis sur 6 laboratoires', () => {
    const list = service.exercises();
    expect(list.length).toBe(26);

    const lab1 = list.filter(e => e.labNumber === 1);
    const lab2 = list.filter(e => e.labNumber === 2);
    const lab3 = list.filter(e => e.labNumber === 3);
    const lab4 = list.filter(e => e.labNumber === 4);
    const lab5 = list.filter(e => e.labNumber === 5);
    const lab6 = list.filter(e => e.labNumber === 6);

    expect(lab1.length).toBe(4);
    expect(lab2.length).toBe(4);
    expect(lab3.length).toBe(5);
    expect(lab4.length).toBe(4);
    expect(lab5.length).toBe(4);
    expect(lab6.length).toBe(5);
  });

  describe('Validation du code initial (Le code de départ ne doit PAS être validé)', () => {
    it('les 26 exercices doivent échouer avec leur initialCode', () => {
      const list = service.exercises();
      for (const ex of list) {
        service.updateCode(ex.id, ex.initialCode);
        const result = service.evaluateExercise(ex.id);
        expect(result.success, `L'exercice ${ex.number} (${ex.id}) est validé avec son initialCode !`).toBe(false);
      }
    });
  });

  describe('Validation de la solution officielle (Doit RÉUSSIR à 100%)', () => {
    it('les 26 exercices doivent tous valider 100% de leurs critères avec solutionCode', () => {
      const list = service.exercises();
      for (const ex of list) {
        service.updateCode(ex.id, ex.solutionCode);
        const result = service.evaluateExercise(ex.id);
        expect(result.success, `Échec pour l'exercice ${ex.number} (${ex.id}) : ${result.messages.join(' ; ')}`).toBe(true);
        expect(result.passedCount).toBe(result.totalCount);

        const currentEx = service.exercises().find(e => e.id === ex.id);
        expect(currentEx?.isCompleted).toBe(true);
        for (const crit of currentEx!.criteria) {
          expect(crit.passed, `Critère "${crit.label}" non validé pour ${ex.id}`).toBe(true);
        }
      }
    });
  });
});
