import { 
  Component, 
  input, 
  inject, 
  signal, 
  computed, 
  effect 
} from '@angular/core';
import { ExerciseService } from '../../../core/services/exercise.service';
import { MonacoEditorComponent } from '../monaco-editor/monaco-editor.component';
import { ConsoleLogEntry, ValidationSummary } from '../../../core/models/app.models';

@Component({
  selector: 'app-lab-runner',
  standalone: true,
  imports: [MonacoEditorComponent],
  template: `
    <div class="lab-runner-container">
      <!-- Barre de sélection d'exercices -->
      @if (displayedExercises().length > 1) {
        <div class="exercise-selector-bar card-panel">
          <div class="selector-tabs">
            @for (ex of displayedExercises(); track ex.id) {
              <button 
                class="ex-pill-btn" 
                [class.active]="selectedExerciseId() === ex.id"
                [class.completed]="ex.isCompleted"
                (click)="onSelectExercise(ex.id)"
              >
                <span class="status-icon">{{ ex.isCompleted ? '✓' : ex.number }}</span>
                <span class="ex-short-title">{{ ex.title }}</span>
              </button>
            }
          </div>

          <div class="lab-progress-badge">
            <span class="badge badge-success">{{ labCompletedCount() }} / {{ displayedExercises().length }} Validés</span>
          </div>
        </div>
      }

      <!-- Grille de travail principale -->
      <div class="lab-grid">
        <!-- Colonne Gauche : Énoncé, Critères & Monaco -->
        <div class="editor-col">
          <!-- Carte Énoncé -->
          <div class="card-panel brief-panel">
            <div class="brief-header">
              <div class="badges-row">
                <span class="badge badge-indigo">Labo {{ activeEx().labNumber }} · Ex {{ activeEx().number }}</span>
                <span class="badge badge-purple">{{ activeEx().difficulty }}</span>
                <span class="badge badge-amber">⏱️ {{ activeEx().estimatedTime }}</span>
                @if (activeEx().isCompleted) {
                  <span class="badge badge-success">✓ Validé</span>
                }
              </div>
              <h3 class="brief-title">{{ activeEx().title }}</h3>
              <p class="brief-sub">{{ activeEx().subtitle }}</p>
            </div>

            <div class="statement-box">
              <div class="statement-label">🎯 Consigne :</div>
              <p class="statement-text">{{ activeEx().statement }}</p>
            </div>

            <!-- Critères d'évaluation -->
            <div class="criteria-box">
              <div class="criteria-title">Critères de validation automatique :</div>
              <div class="criteria-list">
                @for (c of activeEx().criteria; track c.id) {
                  <div class="criterion-item" [class.passed]="c.passed">
                    <div class="c-icon">{{ c.passed ? '✔' : '○' }}</div>
                    <div class="c-info">
                      <div class="c-label">{{ c.label }}</div>
                      <div class="c-desc">{{ c.description }}</div>
                      @if (!c.passed && showHints()) {
                        <div class="c-hint">💡 Indice : {{ c.hint }}</div>
                      }
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Indice Pédagogique -->
            @if (showHints()) {
              <div class="hint-card">
                <div class="hint-title">💡 Indice pédagogique :</div>
                <p>{{ activeEx().hint }}</p>
              </div>
            }

            <!-- Solution pas-à-pas -->
            @if (showSolution()) {
              <div class="solution-card">
                <div class="sol-title">📖 Explication pas-à-pas de la solution :</div>
                <ul>
                  @for (item of activeEx().solutionExplanation; track item) {
                    <li>{{ item }}</li>
                  }
                </ul>
              </div>
            }
          </div>

          <!-- Barre d'outils de l'éditeur -->
          <div class="editor-toolbar card-panel">
            <div class="file-tabs">
              <div class="file-tab active">
                <span class="badge-tag ts">TS</span>
                <span>exercice.ts</span>
              </div>
            </div>

            <div class="toolbar-actions">
              <button class="btn-secondary btn-sm" (click)="toggleHints()">
                {{ showHints() ? 'Masquer Indice' : '💡 Indice' }}
              </button>
              <button class="btn-secondary btn-sm" (click)="toggleSolution()">
                {{ showSolution() ? 'Masquer Solution' : '📖 Solution' }}
              </button>
              <button class="btn-secondary btn-sm" (click)="injectSolution()" title="Injecter la solution officielle">
                Injecter Solution
              </button>
              <button class="btn-secondary btn-sm" (click)="resetExercise()" title="Réinitialiser le code de départ">
                ↺ Réinitialiser
              </button>
              <button class="btn-primary btn-sm" (click)="validateCurrentExercise()">
                🚀 Valider &amp; Exécuter
              </button>
            </div>
          </div>

          <!-- Éditeur Monaco -->
          <div class="monaco-container">
            <app-monaco-editor
              [code]="activeEx().currentCode"
              language="typescript"
              (codeChange)="onCodeChange($event)"
            ></app-monaco-editor>
          </div>
        </div>

        <!-- Colonne Droite : Console Virtuelle & Rapport -->
        <div class="preview-col">
          <!-- Console Virtuelle -->
          <div class="virtual-terminal card-panel">
            <div class="terminal-header">
              <div class="terminal-dots">
                <span class="dot red"></span>
                <span class="dot yellow"></span>
                <span class="dot green"></span>
              </div>
              <span class="terminal-title">Console Virtuelle (Output TypeScript)</span>
              <div class="terminal-actions">
                <span class="log-count-badge">{{ currentLogs().length }} logs</span>
                <button class="btn-ghost btn-xs" (click)="clearConsole()" title="Effacer la console">
                  Effacer
                </button>
              </div>
            </div>

            <div class="terminal-body">
              @if (currentLogs().length === 0) {
                <div class="terminal-empty">
                  <span>$ En attente de l'évaluation du script...</span>
                  <span class="dim">Les sorties de console.log() et les erreurs s'afficheront ici.</span>
                </div>
              } @else {
                <div class="logs-container">
                  @for (log of currentLogs(); track $index) {
                    <div class="log-line" [class]="'log-' + log.type">
                      <span class="log-time">{{ log.timestamp }}</span>
                      <span class="log-prefix">
                        @switch (log.type) {
                          @case ('log') { ▶ }
                          @case ('info') { ℹ }
                          @case ('warn') { ⚠ }
                          @case ('error') { ✖ }
                          @case ('success') { ✔ }
                        }
                      </span>
                      <span class="log-msg">{{ log.message }}</span>
                    </div>
                  }
                </div>
              }
            </div>
          </div>

          <!-- Rapport de Conformité -->
          <div class="validation-panel card-panel">
            <div class="validation-header">
              <span class="val-title">Rapport de Conformité POO</span>
              @if (lastValidationResult()) {
                <span class="val-badge" [class.success]="lastValidationResult()?.success" [class.error]="!lastValidationResult()?.success">
                  {{ lastValidationResult()?.success ? 'Succès (100%)' : 'Critères non validés' }}
                </span>
              }
            </div>

            <div class="validation-body">
              @if (lastValidationResult()) {
                <div class="banner" [class.success]="lastValidationResult()?.success" [class.error]="!lastValidationResult()?.success">
                  @if (lastValidationResult()?.success) {
                    <div class="banner-content">
                      <span class="check-icon">🎉</span>
                      <div>
                        <strong>Félicitations ! L'exercice est validé avec succès !</strong>
                        <p>Les invariants, les types stricts et les assertions d'exécution sont tous conformes aux spécifications.</p>
                      </div>
                    </div>
                  } @else {
                    <div class="banner-content">
                      <span class="check-icon">⚠️</span>
                      <div>
                        <strong>Exercice non validé :</strong>
                        @for (msg of lastValidationResult()?.messages; track msg) {
                          <div class="error-line">• {{ msg }}</div>
                        }
                      </div>
                    </div>
                  }
                </div>
              } @else {
                <div class="empty-hint">
                  Complétez le code dans l'éditeur Monaco à gauche puis cliquez sur « <strong>🚀 Valider &amp; Exécuter</strong> » pour évaluer les contraintes et exécuter les tests automatisés.
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .lab-runner-container {
      display: flex;
      flex-direction: column;
      gap: 14px;
      height: 100%;
      overflow-y: auto;
      padding-bottom: 24px;
    }

    .exercise-selector-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 16px;
      gap: 12px;
      flex-wrap: wrap;
    }

    .selector-tabs {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .ex-pill-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      background: var(--bg-subtle);
      color: var(--text-muted);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 500;

      &:hover {
        background: var(--bg-card-hover);
        color: var(--text-main);
      }

      &.active {
        background: var(--exception-indigo);
        color: #ffffff;
        border-color: #818cf8;
        box-shadow: 0 2px 8px rgba(99, 102, 241, 0.4);
      }

      &.completed {
        border-color: rgba(16, 185, 129, 0.4);
        .status-icon {
          color: #34d399;
          font-weight: 800;
        }
      }

      .status-icon {
        font-family: var(--font-mono);
        font-size: 0.75rem;
      }
    }

    .lab-grid {
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      gap: 16px;
      min-height: 600px;

      @media (max-width: 1200px) {
        grid-template-columns: 1fr;
      }
    }

    .editor-col, .preview-col {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .brief-panel {
      padding: 16px 20px;
    }

    .badges-row {
      display: flex;
      gap: 8px;
      margin-bottom: 8px;
      flex-wrap: wrap;
    }

    .brief-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--text-main);
      margin-bottom: 2px;
    }

    .brief-sub {
      font-size: 0.82rem;
      color: var(--text-muted);
      margin-bottom: 12px;
    }

    .statement-box {
      background: var(--bg-subtle);
      border-left: 3px solid var(--exception-indigo);
      padding: 10px 14px;
      border-radius: 4px;
      margin-bottom: 14px;

      .statement-label {
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        color: #818cf8;
        margin-bottom: 4px;
      }

      .statement-text {
        font-size: 0.88rem;
        color: var(--text-main);
        line-height: 1.45;
      }
    }

    .criteria-box {
      margin-bottom: 10px;

      .criteria-title {
        font-size: 0.78rem;
        font-weight: 700;
        color: var(--text-muted);
        text-transform: uppercase;
        margin-bottom: 8px;
      }

      .criteria-list {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .criterion-item {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        padding: 6px 10px;
        background: var(--bg-subtle);
        border-radius: 6px;
        border: 1px solid var(--border-subtle);
        font-size: 0.8rem;

        &.passed {
          border-color: rgba(16, 185, 129, 0.4);
          background: rgba(16, 185, 129, 0.05);

          .c-icon {
            color: #34d399;
          }
        }

        .c-icon {
          color: var(--text-dim);
          font-family: var(--font-mono);
          font-size: 0.85rem;
          margin-top: 1px;
        }

        .c-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .c-label {
          font-weight: 600;
          color: var(--text-main);
        }

        .c-desc {
          color: var(--text-muted);
          font-size: 0.76rem;
        }

        .c-hint {
          color: #fbbf24;
          font-size: 0.75rem;
          margin-top: 4px;
          font-style: italic;
        }
      }
    }

    .hint-card, .solution-card {
      margin-top: 10px;
      padding: 12px 14px;
      border-radius: 6px;
      font-size: 0.82rem;
      line-height: 1.4;
    }

    .hint-card {
      background: rgba(245, 158, 11, 0.1);
      border: 1px solid rgba(245, 158, 11, 0.3);
      color: #fbbf24;

      .hint-title {
        font-weight: 700;
        margin-bottom: 4px;
      }
    }

    .solution-card {
      background: rgba(99, 102, 241, 0.12);
      border: 1px solid rgba(99, 102, 241, 0.35);
      color: var(--text-main);

      .sol-title {
        font-weight: 700;
        color: #818cf8;
        margin-bottom: 6px;
      }

      ul {
        margin-left: 18px;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
    }

    .editor-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 12px;
      gap: 10px;
      flex-wrap: wrap;
    }

    .file-tabs {
      display: flex;
      gap: 6px;
    }

    .file-tab {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 5px 12px;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-muted);
      background: var(--bg-subtle);

      &.active {
        color: var(--text-main);
        background: var(--bg-card-hover);
        border: 1px solid var(--border-color);
      }

      .badge-tag.ts {
        font-size: 0.68rem;
        background: #3178c6;
        color: #fff;
        padding: 1px 4px;
        border-radius: 3px;
        font-weight: 800;
      }
    }

    .toolbar-actions {
      display: flex;
      gap: 6px;
      align-items: center;
      flex-wrap: wrap;
    }

    .btn-sm {
      font-size: 0.78rem;
      padding: 5px 10px;
    }

    .btn-xs {
      font-size: 0.72rem;
      padding: 3px 8px;
    }

    .monaco-container {
      height: 440px;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid var(--border-color);
    }

    .virtual-terminal {
      display: flex;
      flex-direction: column;
      height: 380px;
      padding: 0;
      overflow: hidden;
      border-color: #24314c;
    }

    .terminal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 14px;
      background: var(--terminal-header);
      border-bottom: 1px solid var(--border-color);
    }

    .terminal-dots {
      display: flex;
      gap: 6px;

      .dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;

        &.red { background: #ef4444; }
        &.yellow { background: #f59e0b; }
        &.green { background: #10b981; }
      }
    }

    .terminal-title {
      font-size: 0.76rem;
      font-weight: 600;
      color: var(--text-muted);
      font-family: var(--font-mono);
    }

    .terminal-actions {
      display: flex;
      align-items: center;
      gap: 8px;

      .log-count-badge {
        font-size: 0.7rem;
        color: var(--text-dim);
        font-family: var(--font-mono);
      }
    }

    .terminal-body {
      flex: 1;
      padding: 12px;
      background: var(--terminal-bg);
      font-family: var(--font-mono);
      font-size: 0.8rem;
      overflow-y: auto;
      line-height: 1.5;
    }

    .terminal-empty {
      display: flex;
      flex-direction: column;
      gap: 6px;
      color: var(--text-dim);
      padding: 16px 8px;

      .dim {
        font-size: 0.72rem;
        color: #475569;
      }
    }

    .logs-container {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .log-line {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      word-break: break-all;

      .log-time {
        font-size: 0.7rem;
        color: #475569;
        min-width: 55px;
      }

      .log-prefix {
        font-size: 0.72rem;
        font-weight: 700;
      }

      &.log-log {
        color: #e2e8f0;
        .log-prefix { color: #60a5fa; }
      }

      &.log-info {
        color: #93c5fd;
        .log-prefix { color: #3b82f6; }
      }

      &.log-warn {
        color: #fde047;
        .log-prefix { color: #eab308; }
      }

      &.log-error {
        color: #fca5a5;
        .log-prefix { color: #ef4444; }
      }

      &.log-success {
        color: #86efac;
        .log-prefix { color: #22c55e; }
      }
    }

    .validation-panel {
      padding: 16px;
    }

    .validation-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;

      .val-title {
        font-size: 0.85rem;
        font-weight: 700;
        color: var(--text-main);
        text-transform: uppercase;
      }

      .val-badge {
        font-size: 0.72rem;
        font-weight: 700;
        padding: 3px 8px;
        border-radius: 4px;

        &.success {
          background: rgba(16, 185, 129, 0.2);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.4);
        }

        &.error {
          background: rgba(239, 68, 68, 0.15);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }
      }
    }

    .banner {
      padding: 12px 14px;
      border-radius: 8px;
      font-size: 0.82rem;

      &.success {
        background: rgba(16, 185, 129, 0.12);
        border: 1px solid rgba(16, 185, 129, 0.3);
        color: #ecfdf5;

        p {
          color: #a7f3d0;
          font-size: 0.78rem;
          margin-top: 3px;
        }
      }

      &.error {
        background: rgba(239, 68, 68, 0.12);
        border: 1px solid rgba(239, 68, 68, 0.3);
        color: #fef2f2;

        .error-line {
          color: #fca5a5;
          margin-top: 4px;
          font-family: var(--font-mono);
          font-size: 0.78rem;
        }
      }

      .banner-content {
        display: flex;
        gap: 10px;
        align-items: flex-start;

        .check-icon {
          font-size: 1.2rem;
          margin-top: 1px;
        }
      }
    }

    .empty-hint {
      font-size: 0.82rem;
      color: var(--text-muted);
      line-height: 1.5;
    }
  `]
})
export class LabRunnerComponent {
  readonly filterLabNumber = input<number | undefined>(undefined);

  readonly exercisesService = inject(ExerciseService);

  readonly showHints = signal<boolean>(false);
  readonly showSolution = signal<boolean>(false);
  readonly currentLogs = signal<ConsoleLogEntry[]>([]);
  readonly lastValidationResult = signal<ValidationSummary | null>(null);

  readonly displayedExercises = computed(() => {
    const list = this.exercisesService.exercises();
    const filter = this.filterLabNumber();
    if (filter !== undefined) {
      return list.filter(e => e.labNumber === filter);
    }
    return list;
  });

  readonly selectedExerciseId = computed(() => {
    return this.exercisesService.selectedExerciseId();
  });

  readonly activeEx = computed(() => {
    const list = this.displayedExercises();
    const selId = this.selectedExerciseId();
    const found = list.find(e => e.id === selId);
    return found || list[0] || this.exercisesService.activeExercise();
  });

  readonly labCompletedCount = computed(() => {
    return this.displayedExercises().filter(e => e.isCompleted).length;
  });

  constructor() {
    effect(() => {
      const list = this.displayedExercises();
      const selId = this.exercisesService.selectedExerciseId();
      if (list.length > 0 && !list.some(e => e.id === selId)) {
        this.exercisesService.selectExercise(list[0].id);
      }
    });
  }

  onSelectExercise(id: string): void {
    this.exercisesService.selectExercise(id);
    this.lastValidationResult.set(null);
    this.currentLogs.set([]);
    this.showHints.set(false);
    this.showSolution.set(false);
  }

  onCodeChange(code: string): void {
    this.exercisesService.updateCode(this.activeEx().id, code);
  }

  toggleHints(): void {
    this.showHints.update(v => !v);
  }

  toggleSolution(): void {
    this.showSolution.update(v => !v);
  }

  injectSolution(): void {
    this.exercisesService.injectSolution(this.activeEx().id);
    this.showSolution.set(true);
  }

  resetExercise(): void {
    this.exercisesService.resetExercise(this.activeEx().id);
    this.lastValidationResult.set(null);
    this.currentLogs.set([]);
  }

  validateCurrentExercise(): void {
    const summary = this.exercisesService.evaluateExercise(this.activeEx().id);
    this.lastValidationResult.set(summary);
    this.currentLogs.set(summary.consoleLogs);
  }

  clearConsole(): void {
    this.currentLogs.set([]);
  }
}
