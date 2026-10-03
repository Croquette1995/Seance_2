import { Component, signal, inject } from '@angular/core';
import { ExerciseService } from '../../core/services/exercise.service';
import { LabRunnerComponent } from '../../shared/components/lab-runner/lab-runner.component';

@Component({
  selector: 'app-workshops-lab',
  standalone: true,
  imports: [LabRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag-row">
          <span class="module-tag">Séance 10 · Ateliers Pratiques</span>
          <span class="badge badge-purple">Monaco Editor</span>
          <span class="badge badge-success">{{ exercises.completedCount() }} / {{ exercises.totalCount() }} Validés</span>
        </div>
        <h2>Espace Ateliers Pratiques (26 Micro-Exercices de Robustesse)</h2>
        <p class="module-desc">
          Pratiquez intensivement la gestion des exceptions, le typage strict <code>unknown</code>, la création de classes métier <code>extends Error</code>,
          la libération garantie dans <code>finally</code> et la résilience réactive avec les Signaux Angular.
        </p>

        <!-- Filtre des 6 Labos -->
        <div class="lab-filters-bar mt-2">
          <button 
            class="lab-tab-btn" 
            [class.active]="selectedLab() === undefined"
            (click)="selectedLab.set(undefined)"
          >
            🌟 Tous les Labos (26 Défis)
          </button>
          <button 
            class="lab-tab-btn" 
            [class.active]="selectedLab() === 1"
            (click)="selectedLab.set(1)"
          >
            Labo 1 : Invariants &amp; throw (4 ex)
          </button>
          <button 
            class="lab-tab-btn" 
            [class.active]="selectedLab() === 2"
            (click)="selectedLab.set(2)"
          >
            Labo 2 : try / catch / finally (4 ex)
          </button>
          <button 
            class="lab-tab-btn" 
            [class.active]="selectedLab() === 3"
            (click)="selectedLab.set(3)"
          >
            Labo 3 : unknown &amp; Narrowing (5 ex)
          </button>
          <button 
            class="lab-tab-btn" 
            [class.active]="selectedLab() === 4"
            (click)="selectedLab.set(4)"
          >
            Labo 4 : Exceptions Métier (4 ex)
          </button>
          <button 
            class="lab-tab-btn" 
            [class.active]="selectedLab() === 5"
            (click)="selectedLab.set(5)"
          >
            Labo 5 : Filtrage &amp; Couches (4 ex)
          </button>
          <button 
            class="lab-tab-btn" 
            [class.active]="selectedLab() === 6"
            (click)="selectedLab.set(6)"
          >
            Labo 6 : Signals &amp; UI (5 ex)
          </button>
        </div>
      </div>

      <div class="runner-wrapper">
        <app-lab-runner [filterLabNumber]="selectedLab()"></app-lab-runner>
      </div>
    </div>
  `,
  styles: [`
    .lab-filters-bar {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }

    .lab-tab-btn {
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 0.78rem;
      font-weight: 600;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      color: var(--text-muted);

      &:hover {
        background: var(--bg-card-hover);
        color: var(--text-main);
      }

      &.active {
        background: var(--exception-indigo);
        color: #ffffff;
        border-color: #818cf8;
        box-shadow: 0 2px 8px rgba(99, 102, 241, 0.35);
      }
    }

    .runner-wrapper {
      flex: 1;
      min-height: 0;
    }
  `]
})
export class WorkshopsLabComponent {
  readonly exercises = inject(ExerciseService);
  readonly selectedLab = signal<number | undefined>(undefined);
}
