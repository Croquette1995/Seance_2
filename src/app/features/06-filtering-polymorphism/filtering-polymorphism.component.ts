import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LabRunnerComponent } from '../../shared/components/lab-runner/lab-runner.component';

@Component({
  selector: 'app-filtering-polymorphism',
  standalone: true,
  imports: [CommonModule, FormsModule, LabRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag-row">
          <span class="module-tag">MODULE 06 · POLYMORPHISME D'INTERCEPTION</span>
          <span class="badge badge-purple">Ordre &amp; Rethrow</span>
        </div>
        <h2>Filtrage Chirurgical &amp; Polymorphisme avec instanceof</h2>
        <p class="module-desc">
          En POO, intercepter une classe mère capture automatiquement toutes ses classes dérivées.
          Comprenez l'impératif de l'ordre d'évaluation (du plus spécifique au plus général) et la relance obligatoire (<code>rethrow</code>) des anomalies inattendues.
        </p>
      </div>

      <div class="section-mode-tabs">
        <button class="mode-tab-btn" [class.active]="activeMode() === 'interactive'" (click)="activeMode.set('interactive')">
          <span>💥 Simulateur d'Aiguillage &amp; Ordre d'Évaluation</span>
        </button>
        <button class="mode-tab-btn" [class.active]="activeMode() === 'lab'" (click)="activeMode.set('lab')">
          <span>💻 Atelier Monaco (Labo 5 · Filtrage &amp; Couches)</span>
        </button>
      </div>

      @if (activeMode() === 'interactive') {
        <!-- PARTIE 1 : SIMULATEUR D'AIGUILLAGE -->
        <div class="card-panel demo-card">
          <div class="card-title-row">
            <span class="badge badge-indigo">Simulateur d'Aiguillage</span>
            <h3>Polymorphisme d'Interception en Action</h3>
          </div>
          <p class="section-intro">
            Sélectionnez une exception levée et observez quelle branche conditionnelle s'allume pour l'intercepter :
          </p>

          <div class="router-controls">
            <span class="ctrl-title">Sélectionnez l'exception à déclencher :</span>
            <div class="buttons-row mt-1">
              <button 
                class="choice-btn" 
                [class.active]="selectedException() === 'slot'"
                (click)="selectedException.set('slot')"
              >
                1. new SlotUnavailableError("S12", new Date())
              </button>
              <button 
                class="choice-btn" 
                [class.active]="selectedException() === 'past'"
                (click)="selectedException.set('past')"
              >
                2. new PastDateError(hier)
              </button>
              <button 
                class="choice-btn" 
                [class.active]="selectedException() === 'solde'"
                (click)="selectedException.set('solde')"
              >
                3. new SoldeInsuffisantError(50, 100)
              </button>
              <button 
                class="choice-btn" 
                [class.active]="selectedException() === 'type'"
                (click)="selectedException.set('type')"
              >
                4. new TypeError("Cannot read prop") (Bogue de code)
              </button>
            </div>
          </div>

          <!-- Aiguillage Visuel -->
          <div class="router-flow-box mt-3">
            <div class="flow-step" [class.matched]="isBranchMatched(1)">
              <div class="step-condition">1. if (error instanceof SlotUnavailableError)</div>
              <div class="step-action">
                👉 Traitement chirurgical : <em>« Le créneau est complet. Voulez-vous une alerte désistement ? »</em>
              </div>
            </div>

            <div class="flow-step" [class.matched]="isBranchMatched(2)">
              <div class="step-condition">2. else if (error instanceof ReservationError)</div>
              <div class="step-action">
                👉 Polymorphisme de sous-domaine : <em>« Incident de réservation [{{ '{' }}error.code{{ '}' }}] »</em>
                <div class="dim">Attrape automatiquement PastDateError ou toute autre classe fille !</div>
              </div>
            </div>

            <div class="flow-step" [class.matched]="isBranchMatched(3)">
              <div class="step-condition">3. else if (error instanceof AppError)</div>
              <div class="step-action">
                👉 Gestionnaire applicatif global : <em>« Panne métier [{{ '{' }}error.code{{ '}' }}] »</em>
                <div class="dim">Attrape SoldeInsuffisantError, BanqueError, etc.</div>
              </div>
            </div>

            <div class="flow-step danger-step" [class.matched]="isBranchMatched(4)">
              <div class="step-condition">4. else &#123; throw error; &#125; // ⚠️ RELANCE OBLIGATOIRE</div>
              <div class="step-action">
                💥 Bogue imprévu non métier (TypeError) relancé pour alerte DevOps Sentry / Crash console !
              </div>
            </div>
          </div>
        </div>

        <!-- PARTIE 2 : VISUALISEUR DE L'ORDRE D'ÉVALUATION -->
        <div class="card-panel demo-card mt-3">
          <div class="card-title-row">
            <span class="badge badge-amber">Piège de l'Ordre</span>
            <h3>L'Ordre d'Évaluation : Spécifique avant Général</h3>
          </div>
          <p class="section-intro">
            Inversez l'ordre des conditions pour observer comment la classe mère "avale" tout avant l'enfant :
          </p>

          <div class="order-toggle-row">
            <button 
              class="choice-btn" 
              [class.active]="orderMode() === 'correct'"
              (click)="orderMode.set('correct')"
            >
              ✅ Ordre Correct : Enfant (SlotUnavailableError) avant Parent (ReservationError)
            </button>
            <button 
              class="choice-btn" 
              [class.active]="orderMode() === 'inverted'"
              (click)="orderMode.set('inverted')"
            >
              ❌ Ordre Erroné : Parent (ReservationError) placé avant Enfant
            </button>
          </div>

          <div class="order-visualization-grid mt-3">
            <div class="order-code-panel">
              <pre><code>@if (orderMode() === 'correct') {
<span class="hl-green">// 1. L'enfant spécifique en premier :</span>
if (error instanceof <span class="text-emerald">SlotUnavailableError</span>) &#123;
  proposerListeAttente();
&#125; 
<span class="hl-green">// 2. Le parent général ensuite :</span>
else if (error instanceof <span class="text-indigo">ReservationError</span>) &#123;
  afficherErreurReservationGenerale();
&#125;
} @else {
<span class="hl-red">// 1. Le parent en premier intercepte TOUT :</span>
if (error instanceof <span class="text-indigo">ReservationError</span>) &#123;
  afficherErreurReservationGenerale();
&#125; 
<span class="hl-red">// 2. CODE MORT (JAMAIS ATTEINT !) :</span>
else if (error instanceof <span class="text-emerald">SlotUnavailableError</span>) &#123;
  proposerListeAttente(); <span class="hl-red">// ☠️ LIGNE MORTE !</span>
&#125;
}</code></pre>
            </div>

            <div class="order-explanation-panel card-panel">
              <div class="exp-title">{{ orderMode() === 'correct' ? '✅ Logique Saine' : '💥 Code Mort Détecté !' }}</div>
              <p class="exp-desc">
                {{ orderExplanation() }}
              </p>
            </div>
          </div>
        </div>
      } @else {
        <!-- ATELIER MONACO LABO 5 -->
        <app-lab-runner [filterLabNumber]="5"></app-lab-runner>
      }
    </div>
  `,
  styles: [`
    .demo-card {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .card-title-row {
      display: flex;
      align-items: center;
      gap: 10px;

      h3 {
        font-size: 1.15rem;
        font-weight: 700;
        color: var(--text-main);
      }
    }

    .section-intro {
      font-size: 0.88rem;
      color: var(--text-muted);
    }

    .router-controls {
      display: flex;
      flex-direction: column;
      gap: 6px;

      .ctrl-title {
        font-size: 0.78rem;
        font-weight: 700;
        text-transform: uppercase;
        color: var(--text-muted);
      }
    }

    .buttons-row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .choice-btn {
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 600;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      color: var(--text-muted);

      &.active {
        background: rgba(99, 102, 241, 0.15);
        color: #818cf8;
        border-color: #6366f1;
      }
    }

    .router-flow-box {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .flow-step {
      padding: 12px 16px;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      .step-condition {
        font-size: 0.82rem;
        font-family: var(--font-mono);
        font-weight: 700;
        color: var(--text-muted);
        margin-bottom: 4px;
      }

      .step-action {
        font-size: 0.82rem;
        color: var(--text-dim);

        .dim {
          font-size: 0.72rem;
          margin-top: 3px;
        }
      }

      &.matched {
        border-color: #10b981;
        background: rgba(16, 185, 129, 0.12);

        .step-condition {
          color: #34d399;
        }

        .step-action {
          color: #ecfdf5;
          font-weight: 600;
        }
      }

      &.danger-step.matched {
        border-color: #f43f5e;
        background: rgba(244, 63, 94, 0.12);

        .step-condition {
          color: #f43f5e;
        }

        .step-action {
          color: #fca5a5;
        }
      }
    }

    .order-toggle-row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .order-visualization-grid {
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 16px;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .order-code-panel pre {
      margin: 0;
      padding: 14px;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      font-family: var(--font-mono);
      font-size: 0.82rem;
      line-height: 1.6;
      color: var(--text-code);
    }

    .hl-green { color: #34d399; font-weight: 700; }
    .hl-red { color: #f43f5e; font-weight: 700; }
    .text-emerald { color: #34d399; font-weight: 700; }
    .text-indigo { color: #818cf8; font-weight: 700; }

    .order-explanation-panel {
      display: flex;
      flex-direction: column;
      gap: 8px;

      .exp-title {
        font-size: 0.95rem;
        font-weight: 800;
        color: var(--text-main);
      }

      .exp-desc {
        font-size: 0.82rem;
        color: var(--text-muted);
        line-height: 1.45;
      }
    }
  `]
})
export class FilteringPolymorphismComponent {
  readonly activeMode = signal<'interactive' | 'lab'>('interactive');

  readonly selectedException = signal<'slot' | 'past' | 'solde' | 'type'>('slot');
  readonly orderMode = signal<'correct' | 'inverted'>('correct');

  isBranchMatched(branchIndex: number): boolean {
    const ex = this.selectedException();
    if (branchIndex === 1) {
      return ex === 'slot';
    } else if (branchIndex === 2) {
      // pastDateError est une ReservationError
      return ex === 'past';
    } else if (branchIndex === 3) {
      // soldeInsuffisantError est une AppError
      return ex === 'solde';
    } else {
      // TypeError n'est pas une AppError -> rethrow !
      return ex === 'type';
    }
  }

  orderExplanation(): string {
    if (this.orderMode() === 'correct') {
      return 'En testant SlotUnavailableError en premier, la machine virtuelle lui applique le traitement sur mesure. Les autres erreurs de réservation (ex: PastDateError) se replient ensuite naturellement sur ReservationError.';
    } else {
      return 'Puisque SlotUnavailableError hérite de ReservationError, l\'expression (err instanceof ReservationError) renvoie TRUE pour SlotUnavailableError ! La branche parente intercepte l\'anomalie et la seconde branche devient du CODE MORT impossible à exécuter.';
    }
  }
}
