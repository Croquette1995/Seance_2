import { Component, input, inject, signal, computed, effect } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { ExerciseService } from '../../../core/services/exercise.service';
import { MonacoEditorComponent } from '../monaco-editor/monaco-editor.component';
import { Exercise, ConsoleLogEntry } from '../../../core/models/app.models';

@Component({
  selector: 'app-lab-runner',
  standalone: true,
  imports: [MonacoEditorComponent, UpperCasePipe],
  template: `
    <div class="lab-runner-container">
      <!-- Barre supérieure de sélection d'exercices -->
      <div class="exercise-selector-bar card-panel">
        <div class="selector-tabs">
          @for (ex of displayedExercises(); track ex.id; let idx = $index) {
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

      <!-- Espace de travail de l'exercice actif -->
      <div class="lab-grid">
        <!-- Panneau Énoncé & Critères -->
        <div class="card-panel brief-panel">
          <div class="brief-header">
            <div class="badges-row">
              <span class="badge badge-ts">Exercice {{ activeEx().number }}</span>
              <span class="badge badge-purple">{{ activeEx().difficulty }}</span>
              <span class="badge badge-warning">⏱️ {{ activeEx().estimatedTime }}</span>
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

          <!-- Critères d'évaluation automatique -->
          <div class="criteria-box">
            <div class="criteria-title">Vérifications automatiques :</div>
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

          <!-- Indice dépliable -->
          @if (showHints()) {
            <div class="hint-card">
              <div class="hint-title">💡 Indice pédagogique :</div>
              <p>{{ activeEx().hint }}</p>
            </div>
          }

          <!-- Explication guidée de la solution -->
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

        <!-- Panneau Éditeur Monaco & Console Virtuelle -->
        <div class="editor-col">
          <!-- Barre d'outils de l'éditeur -->
          <div class="editor-toolbar card-panel">
            <div class="file-name-indicator">
              <span class="ts-icon">TS</span>
              <span>exercice-{{ activeEx().number }}.ts</span>
            </div>

            <div class="toolbar-actions">
              <button class="btn-secondary" (click)="toggleHints()">
                {{ showHints() ? 'Masquer Indice' : '💡 Indice' }}
              </button>
              <button class="btn-secondary" (click)="toggleSolution()">
                {{ showSolution() ? 'Masquer Solution' : '📖 Solution' }}
              </button>
              <button class="btn-secondary" (click)="injectSolution()" title="Remplacer le code actuel par la solution officielle">
                Injecter Solution
              </button>
              <button class="btn-secondary" (click)="resetExercise()" title="Réinitialiser le code d'origine">
                ↺ Réinitialiser
              </button>
              <button class="btn-primary" (click)="validate()">
                🚀 Valider mon code
              </button>
              @if (lastValidationStatus() === true && nextExercise()) {
                <button class="btn-next-ex" (click)="goToNextExercise()" title="Passer à l'exercice suivant">
                  Suivant ({{ nextExercise()?.number }}) ➔
                </button>
              }
            </div>
          </div>

          <!-- Fenêtre de l'éditeur -->
          <div class="editor-viewport card-panel">
            <app-monaco-editor
              [code]="editorCode()"
              (codeChange)="onCodeChanged($event)"
            ></app-monaco-editor>
          </div>

          <!-- Terminal simulé des sorties console -->
          <div class="terminal-panel card-panel">
            <div class="terminal-header">
              <div class="term-dots">
                <span class="dot dot-red"></span>
                <span class="dot dot-yellow"></span>
                <span class="dot dot-green"></span>
              </div>
              <div class="term-title">Console virtuelle d'exécution (Sandbox en mémoire)</div>
              <div class="term-actions">
                @if (lastValidationStatus() !== null) {
                  <span class="val-badge" [class.success]="lastValidationStatus() === true" [class.failure]="lastValidationStatus() === false">
                    {{ lastValidationStatus() === true ? '✔ Tous les critères sont validés !' : '✖ Des critères ne sont pas remplis' }}
                  </span>
                }
                <button class="btn-ghost clear-btn" (click)="clearLogs()">Effacer</button>
              </div>
            </div>

            <div class="terminal-body">
              @if (lastValidationStatus() === true) {
                <div class="success-banner">
                  <div class="success-msg">🎉 Bravo ! Exercice {{ activeEx().number }} validé avec succès !</div>
                  @if (nextExercise()) {
                    <button class="btn-success-next" (click)="goToNextExercise()">
                      Passer à l'exercice suivant ({{ nextExercise()?.number }} - {{ nextExercise()?.title }}) ➔
                    </button>
                  }
                </div>
              }
              @if (consoleLogs().length === 0) {
                <div class="empty-terminal">
                  <span class="prompt-arrow">&gt;</span> Cliquez sur « 🚀 Valider mon code » pour compiler et exécuter ce snippet TypeScript.
                </div>
              } @else {
                @for (log of consoleLogs(); track $index) {
                  <div class="log-line" [class]="'log-' + log.type">
                    <span class="log-time">{{ log.timestamp }}</span>
                    <span class="log-type-tag">[{{ log.type | uppercase }}]</span>
                    <span class="log-text">{{ log.text }}</span>
                  </div>
                }
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
      gap: 16px;
      height: 100%;
    }

    .exercise-selector-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 16px;
      gap: 12px;
      overflow-x: auto;
    }

    .selector-tabs {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .ex-pill-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      border-radius: 6px;
      background: var(--bg-subtle);
      border: 1px solid var(--border-subtle);
      color: var(--text-muted);
      font-size: 0.8rem;
      font-weight: 600;

      &:hover {
        background: var(--bg-card-hover);
        color: var(--text-main);
        border-color: var(--border-color);
      }

      &.active {
        background: var(--ts-blue-bg);
        border-color: var(--ts-blue);
        color: var(--ts-blue-light);
      }

      &.completed {
        border-color: rgba(16, 185, 129, 0.4);
        .status-icon {
          color: #34d399;
          font-weight: 800;
        }
      }
    }

    .status-icon {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      padding: 1px 5px;
      background: rgba(255, 255, 255, 0.06);
      border-radius: 4px;
    }

    .ex-short-title {
      max-width: 170px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .lab-grid {
      display: grid;
      grid-template-columns: 420px 1fr;
      gap: 16px;
      flex: 1;
      min-height: 0;
    }

    .brief-panel {
      display: flex;
      flex-direction: column;
      gap: 16px;
      overflow-y: auto;
      max-height: calc(100vh - 170px);
    }

    .brief-header {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .badges-row {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }

    .brief-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--text-main);
    }

    .brief-sub {
      font-size: 0.82rem;
      color: var(--text-muted);
    }

    .statement-box {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 12px 14px;
      display: flex;
      flex-direction: column;
      gap: 6px;

      .statement-label {
        font-size: 0.78rem;
        font-weight: 700;
        color: var(--ts-blue-light);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .statement-text {
        font-size: 0.88rem;
        line-height: 1.45;
        color: var(--text-main);
      }
    }

    .criteria-box {
      display: flex;
      flex-direction: column;
      gap: 10px;

      .criteria-title {
        font-size: 0.82rem;
        font-weight: 700;
        color: var(--text-dim);
        text-transform: uppercase;
        letter-spacing: 0.06em;
      }
    }

    .criteria-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .criterion-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 10px 12px;
      border-radius: 6px;
      background: var(--bg-subtle);
      border: 1px solid var(--border-subtle);
      font-size: 0.82rem;

      &.passed {
        border-color: rgba(16, 185, 129, 0.4);
        background: rgba(16, 185, 129, 0.06);

        .c-icon {
          color: #10b981;
        }
        .c-label {
          color: #34d399;
          font-weight: 600;
        }
      }

      .c-icon {
        font-size: 0.95rem;
        color: var(--text-dim);
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
        font-size: 0.78rem;
      }

      .c-hint {
        color: #fbbf24;
        font-size: 0.74rem;
        margin-top: 4px;
        font-family: var(--font-mono);
      }
    }

    .hint-card, .solution-card {
      padding: 12px 14px;
      border-radius: 8px;
      font-size: 0.82rem;
      line-height: 1.4;
    }

    .hint-card {
      background: rgba(245, 158, 11, 0.1);
      border: 1px solid rgba(245, 158, 11, 0.3);
      color: #fef3c7;

      .hint-title {
        font-weight: 700;
        margin-bottom: 4px;
        color: #fbbf24;
      }
    }

    .solution-card {
      background: rgba(99, 102, 241, 0.1);
      border: 1px solid rgba(99, 102, 241, 0.3);
      color: #e0e7ff;

      .sol-title {
        font-weight: 700;
        margin-bottom: 6px;
        color: #818cf8;
      }

      ul {
        padding-left: 18px;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
    }

    .editor-col {
      display: flex;
      flex-direction: column;
      gap: 12px;
      min-height: 0;
    }

    .editor-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 14px;
      gap: 12px;
    }

    .file-name-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: var(--font-mono);
      font-size: 0.82rem;
      color: var(--text-main);
      font-weight: 600;

      .ts-icon {
        background: #3178c6;
        color: #ffffff;
        font-size: 0.68rem;
        padding: 1px 5px;
        border-radius: 3px;
        font-weight: 800;
      }
    }

    .toolbar-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;

      button {
        padding: 5px 11px;
        font-size: 0.8rem;
      }

      .btn-next-ex {
        background: #10b981;
        color: #ffffff;
        border: none;
        border-radius: 6px;
        font-weight: 700;

        &:hover {
          background: #059669;
        }
      }
    }

    .success-banner {
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.4);
      border-radius: 6px;
      padding: 10px 14px;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;

      .success-msg {
        color: #34d399;
        font-weight: 700;
        font-size: 0.85rem;
      }

      .btn-success-next {
        background: #10b981;
        color: #ffffff;
        border: none;
        padding: 6px 12px;
        border-radius: 6px;
        font-weight: 700;
        font-size: 0.8rem;
        cursor: pointer;

        &:hover {
          background: #059669;
        }
      }
    }

    .editor-viewport {
      height: 380px;
      min-height: 300px;
      padding: 0;
      overflow: hidden;
    }

    .terminal-panel {
      display: flex;
      flex-direction: column;
      padding: 0;
      overflow: hidden;
      background: var(--terminal-bg);
      border-radius: 8px;
      height: 220px;
      min-height: 180px;
    }

    .terminal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 14px;
      background: var(--terminal-header);
      border-bottom: 1px solid var(--border-color);
      font-size: 0.78rem;
    }

    .term-dots {
      display: flex;
      gap: 6px;

      .dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
      }
      .dot-red { background: #ef4444; }
      .dot-yellow { background: #f59e0b; }
      .dot-green { background: #10b981; }
    }

    .term-title {
      font-family: var(--font-mono);
      color: var(--text-dim);
      font-size: 0.74rem;
    }

    .term-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .val-badge {
      font-size: 0.72rem;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 4px;

      &.success {
        background: rgba(16, 185, 129, 0.2);
        color: #34d399;
      }
      &.failure {
        background: rgba(239, 68, 68, 0.2);
        color: #f87171;
      }
    }

    .clear-btn {
      font-size: 0.72rem;
      padding: 2px 6px;
    }

    .terminal-body {
      flex: 1;
      padding: 12px 16px;
      overflow-y: auto;
      font-family: var(--font-mono);
      font-size: 0.8rem;
      line-height: 1.5;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .empty-terminal {
      color: var(--text-dim);
      display: flex;
      align-items: center;
      gap: 8px;
      height: 100%;
    }

    .prompt-arrow {
      color: var(--ts-blue-light);
      font-weight: 700;
    }

    .log-line {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      word-break: break-all;

      .log-time {
        color: var(--text-dim);
        font-size: 0.72rem;
      }

      .log-type-tag {
        font-size: 0.7rem;
        font-weight: 700;
      }

      &.log-log {
        color: #e2e8f0;
        .log-type-tag { color: #60a5fa; }
      }
      &.log-error {
        color: #fca5a5;
        .log-type-tag { color: #ef4444; }
      }
      &.log-warn {
        color: #fde68a;
        .log-type-tag { color: #f59e0b; }
      }
      &.log-info {
        color: #93c5fd;
        .log-type-tag { color: #3b82f6; }
      }
    }
  `]
})
export class LabRunnerComponent {
  labFilter = input<number | null>(null);

  private readonly exerciseService = inject(ExerciseService);

  readonly selectedExerciseId = signal<string>('ex-1-1');
  readonly editorCode = signal<string>('');
  readonly showHints = signal<boolean>(false);
  readonly showSolution = signal<boolean>(false);
  readonly consoleLogs = signal<ConsoleLogEntry[]>([]);
  readonly lastValidationStatus = signal<boolean | null>(null);

  readonly displayedExercises = computed(() => {
    const filter = this.labFilter();
    const all = this.exerciseService.exercises();
    if (filter === null) return all;
    return all.filter(e => e.labNumber === filter);
  });

  readonly activeEx = computed(() => {
    const id = this.selectedExerciseId();
    const found = this.exerciseService.exercises().find(e => e.id === id);
    return found || this.displayedExercises()[0] || this.exerciseService.exercises()[0];
  });

  readonly labCompletedCount = computed(() => {
    return this.displayedExercises().filter(e => e.isCompleted).length;
  });

  readonly nextExercise = computed(() => {
    const list = this.displayedExercises();
    const currentId = this.selectedExerciseId();
    const currentIndex = list.findIndex(e => e.id === currentId);
    if (currentIndex !== -1 && currentIndex < list.length - 1) {
      return list[currentIndex + 1];
    }
    // Si à la fin de la liste filtrée, chercher dans tous les exercices
    const all = this.exerciseService.exercises();
    const globalIndex = all.findIndex(e => e.id === currentId);
    if (globalIndex !== -1 && globalIndex < all.length - 1) {
      return all[globalIndex + 1];
    }
    return null;
  });

  private lastFilter: number | null | undefined = undefined;

  constructor() {
    effect(() => {
      const filter = this.labFilter();
      const list = this.displayedExercises();
      if (this.lastFilter !== filter) {
        this.lastFilter = filter;
        if (list.length > 0) {
          this.onSelectExercise(list[0].id);
        }
      } else if (list.length > 0) {
        const currentId = this.selectedExerciseId();
        if (!list.some(e => e.id === currentId)) {
          this.onSelectExercise(list[0].id);
        }
      }
    });

    effect(() => {
      const ex = this.activeEx();
      if (ex) {
        this.editorCode.set(ex.currentCode);
      }
    });
  }

  goToNextExercise(): void {
    const next = this.nextExercise();
    if (next) {
      this.onSelectExercise(next.id);
    }
  }

  onSelectExercise(id: string): void {
    this.selectedExerciseId.set(id);
    this.exerciseService.selectExercise(id);
    const ex = this.exerciseService.exercises().find(e => e.id === id);
    if (ex) {
      this.editorCode.set(ex.currentCode);
      this.consoleLogs.set([]);
      this.lastValidationStatus.set(null);
      this.showHints.set(false);
      this.showSolution.set(false);
    }
  }

  onCodeChanged(newCode: string): void {
    this.editorCode.set(newCode);
    this.exerciseService.updateCurrentCode(this.selectedExerciseId(), newCode);
  }

  toggleHints(): void {
    this.showHints.update(v => !v);
  }

  toggleSolution(): void {
    this.showSolution.update(v => !v);
  }

  injectSolution(): void {
    const ex = this.activeEx();
    if (ex) {
      this.editorCode.set(ex.solutionCode);
      this.exerciseService.injectSolution(ex.id);
    }
  }

  resetExercise(): void {
    const ex = this.activeEx();
    if (ex) {
      this.exerciseService.resetExercise(ex.id);
      this.editorCode.set(ex.initialCode);
      this.consoleLogs.set([]);
      this.lastValidationStatus.set(null);
    }
  }

  validate(): void {
    const ex = this.activeEx();
    const code = this.editorCode();
    const result = this.exerciseService.validateExercise(ex.id, code);

    this.consoleLogs.set(result.logs);
    this.lastValidationStatus.set(result.success);
  }

  clearLogs(): void {
    this.consoleLogs.set([]);
    this.lastValidationStatus.set(null);
  }
}
