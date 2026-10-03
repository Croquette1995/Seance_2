import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LabRunnerComponent } from '../../shared/components/lab-runner/lab-runner.component';

interface StackFrame {
  id: number;
  name: string;
  file: string;
  hasCatch: boolean;
  status: 'active' | 'throwing' | 'unwinding' | 'caught' | 'popped';
}

@Component({
  selector: 'app-stack-unwinding',
  standalone: true,
  imports: [CommonModule, FormsModule, LabRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag-row">
          <span class="module-tag">MODULE 02 · LE MÉCANISME DU RUNTIME</span>
          <span class="badge badge-indigo">Call Stack &amp; Invariants</span>
        </div>
        <h2>Déroulement de Pile (Stack Unwinding) &amp; Constructeurs</h2>
        <p class="module-desc">
          Lorsqu'une exception est lancée, le moteur d'exécution rembobine la pile d'appels étage par étage jusqu'à trouver un filet de sécurité.
          Découvrez ce mécanisme visuel et comprenez pourquoi <code>throw</code> est l'unique bouclier des constructeurs d'objets.
        </p>
      </div>

      <div class="section-mode-tabs">
        <button class="mode-tab-btn" [class.active]="activeMode() === 'interactive'" (click)="activeMode.set('interactive')">
          <span>💥 Simulateur de Pile &amp; Protection Constructeur</span>
        </button>
        <button class="mode-tab-btn" [class.active]="activeMode() === 'lab'" (click)="activeMode.set('lab')">
          <span>💻 Atelier Monaco (Labo 1 · Invariants &amp; throw)</span>
        </button>
      </div>

      @if (activeMode() === 'interactive') {
        <!-- PARTIE 1 : VISUALISEUR ANIMÉ DE CALL STACK -->
        <div class="card-panel demo-card">
          <div class="card-title-row">
            <span class="badge badge-indigo">Simulateur 1</span>
            <h3>Visualiseur Pas-à-Pas du Déroulement de Pile (Stack Unwinding)</h3>
          </div>
          <p class="section-intro">
            Déclenchez une exception au sommet de la pile et suivez le dépilement automatique des fonctions sans <code>catch</code>.
          </p>

          <div class="unwinding-controls">
            <button class="btn-primary btn-sm" (click)="declencherThrow()" [disabled]="isAnimating()">
              💥 Déclencher throw new Error() au sommet
            </button>
            <button class="btn-secondary btn-sm" (click)="stepForward()" [disabled]="!canStepForward()">
              ⏭ Étape Suivante
            </button>
            <button class="btn-ghost btn-sm" (click)="resetStack()">
              ↺ Réinitialiser la Pile
            </button>
            <div class="status-indicator">
              <strong>Statut :</strong> {{ currentStatusText() }}
            </div>
          </div>

          <!-- Pile Visuelle -->
          <div class="stack-visualizer mt-3">
            <div class="stack-label">Sommet de la pile (Top of Stack) ▲</div>

            <div class="frames-container">
              @for (frame of frames(); track frame.id) {
                <div class="stack-frame" [class]="'frame-' + frame.status">
                  <div class="frame-header">
                    <span class="frame-id">#{{ frame.id }}</span>
                    <span class="frame-fn">{{ frame.name }}</span>
                    <span class="frame-file">{{ frame.file }}</span>
                    <span class="frame-badge" [class.catcher]="frame.hasCatch">
                      {{ frame.hasCatch ? '🛡️ Bloc catch présent' : '❌ Aucun catch' }}
                    </span>
                  </div>
                  <div class="frame-status-text">
                    @switch (frame.status) {
                      @case ('active') {
                        <span>En attente d'exécution...</span>
                      }
                      @case ('throwing') {
                        <span class="text-rose">💥 throw new Error("Solde insuffisant") !</span>
                      }
                      @case ('unwinding') {
                        <span class="text-amber">⏳ Pas de catch : dépilement en cours, destruction des variables locales...</span>
                      }
                      @case ('popped') {
                        <span class="text-dim">💨 Fonction dépilée et retirée de la mémoire</span>
                      }
                      @case ('caught') {
                        <span class="text-emerald">✅ Exception interceptée ici ! Reprise nominale.</span>
                      }
                    }
                  </div>
                </div>
              }
            </div>

            <div class="stack-label">Base de la pile (Event Loop Root) ▼</div>
          </div>
        </div>

        <!-- PARTIE 2 : DÉMONSTRATEUR DE PROTECTION DES CONSTRUCTEURS -->
        <div class="card-panel demo-card mt-3">
          <div class="card-title-row">
            <span class="badge badge-emerald">Démonstrateur 2</span>
            <h3>L'Inviolabilité des Constructeurs POO</h3>
          </div>
          <p class="section-intro">
            Un constructeur ne peut rien renvoyer (pas de code <code>-1</code> ou <code>null</code>).
            <code>throw</code> est l'unique arme capable d'interdire l'allocation d'un objet corrompu en mémoire.
          </p>

          <div class="constructor-sim-grid">
            <div class="input-panel">
              <div class="ctrl-title">Paramètres de création : new CompteBancaire("Alice", soldeInitial)</div>
              
              <div class="slider-row mt-2">
                <label>Solde initial demandé : <strong>{{ soldeChoisi() }} €</strong></label>
                <input type="range" min="-100" max="200" step="10" [(ngModel)]="soldeChoisi">
              </div>

              <div class="quick-btns mt-2">
                <button class="btn-secondary btn-xs" (click)="soldeChoisi.set(-50)">-50 € (Invalide)</button>
                <button class="btn-secondary btn-xs" (click)="soldeChoisi.set(0)">0 € (Valide)</button>
                <button class="btn-secondary btn-xs" (click)="soldeChoisi.set(100)">100 € (Valide)</button>
              </div>

              <div class="action-btn mt-3">
                <button class="btn-primary btn-sm" (click)="tenterInstanciation()">
                  🏗️ Exécuter new CompteBancaire()
                </button>
              </div>
            </div>

            <div class="result-panel">
              <div class="ctrl-title">Résultat dans le tas mémoire (Heap RAM) :</div>
              
              @if (instantiationResult()) {
                <div class="heap-result" [class.success]="instantiationResult()?.success" [class.error]="!instantiationResult()?.success">
                  <div class="heap-icon">{{ instantiationResult()?.success ? '✅' : '🛑' }}</div>
                  <div>
                    <strong>{{ instantiationResult()?.title }}</strong>
                    <p>{{ instantiationResult()?.desc }}</p>
                  </div>
                </div>
              } @else {
                <div class="heap-empty">
                  Sélectionnez un montant et cliquez sur « Exécuter new CompteBancaire() ».
                </div>
              }
            </div>
          </div>
        </div>
      } @else {
        <!-- ATELIER MONACO LABO 1 -->
        <app-lab-runner [filterLabNumber]="1"></app-lab-runner>
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

    .unwinding-controls {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;

      .status-indicator {
        margin-left: auto;
        font-size: 0.82rem;
        color: #818cf8;
      }
    }

    .stack-visualizer {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .stack-label {
      font-size: 0.72rem;
      text-transform: uppercase;
      font-weight: 700;
      color: var(--text-dim);
      font-family: var(--font-mono);
      text-align: center;
    }

    .frames-container {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .stack-frame {
      padding: 12px 16px;
      border-radius: 8px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      .frame-header {
        display: flex;
        align-items: center;
        gap: 10px;
        font-family: var(--font-mono);
        font-size: 0.82rem;
      }

      .frame-id {
        font-weight: 800;
        color: var(--text-dim);
      }

      .frame-fn {
        font-weight: 700;
        color: var(--text-main);
      }

      .frame-file {
        font-size: 0.74rem;
        color: var(--text-muted);
      }

      .frame-badge {
        margin-left: auto;
        font-size: 0.7rem;
        padding: 2px 8px;
        border-radius: 4px;
        background: rgba(244, 63, 94, 0.12);
        color: #fca5a5;

        &.catcher {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          font-weight: 700;
        }
      }

      .frame-status-text {
        margin-top: 6px;
        font-size: 0.78rem;
      }

      &.frame-throwing {
        border-color: #f43f5e;
        background: rgba(244, 63, 94, 0.15);
        animation: error-pulse 1s infinite alternate;
      }

      &.frame-unwinding {
        border-color: #f59e0b;
        background: rgba(245, 158, 11, 0.1);
        transform: scale(0.98);
        opacity: 0.75;
      }

      &.frame-popped {
        opacity: 0.35;
        border-style: dashed;
        background: transparent;
      }

      &.frame-caught {
        border-color: #10b981;
        background: rgba(16, 185, 129, 0.15);
      }
    }

    .text-rose { color: #f43f5e; font-weight: 700; }
    .text-amber { color: #f59e0b; font-weight: 700; }
    .text-emerald { color: #34d399; font-weight: 700; }
    .text-dim { color: #64748b; }

    .constructor-sim-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;

      @media (max-width: 850px) {
        grid-template-columns: 1fr;
      }
    }

    .input-panel, .result-panel {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
    }

    .ctrl-title {
      font-size: 0.78rem;
      font-weight: 700;
      text-transform: uppercase;
      color: var(--text-muted);
      margin-bottom: 8px;
    }

    .slider-row {
      display: flex;
      flex-direction: column;
      gap: 6px;

      label {
        font-size: 0.85rem;
        color: var(--text-main);
      }

      input[type="range"] {
        width: 100%;
        accent-color: #6366f1;
      }
    }

    .quick-btns {
      display: flex;
      gap: 6px;
    }

    .heap-result {
      padding: 14px;
      border-radius: 8px;
      display: flex;
      gap: 12px;
      align-items: flex-start;
      font-size: 0.84rem;

      .heap-icon {
        font-size: 1.3rem;
      }

      &.success {
        background: rgba(16, 185, 129, 0.12);
        border: 1px solid rgba(16, 185, 129, 0.3);
        color: #ecfdf5;

        p { color: #a7f3d0; margin-top: 2px; }
      }

      &.error {
        background: rgba(244, 63, 94, 0.12);
        border: 1px solid rgba(244, 63, 94, 0.3);
        color: #fef2f2;

        p { color: #fca5a5; margin-top: 2px; }
      }
    }

    .heap-empty {
      font-size: 0.82rem;
      color: var(--text-dim);
      padding: 20px 0;
      text-align: center;
    }
  `]
})
export class StackUnwindingComponent {
  readonly activeMode = signal<'interactive' | 'lab'>('interactive');

  readonly frames = signal<StackFrame[]>([
    { id: 4, name: 'CompteBancaire.retirer()', file: 'compte.ts:18', hasCatch: false, status: 'active' },
    { id: 3, name: 'BanqueService.debiter()', file: 'banque.service.ts:42', hasCatch: false, status: 'active' },
    { id: 2, name: 'CommandeCtrl.valider()', file: 'commande.controller.ts:65', hasCatch: false, status: 'active' },
    { id: 1, name: 'UiComponent.onValider()', file: 'checkout.component.ts:12', hasCatch: true, status: 'active' }
  ]);

  readonly currentStep = signal<number>(0);
  readonly isAnimating = signal<boolean>(false);
  readonly currentStatusText = signal<string>('Pile nominale active. Cliquez sur "Déclencher throw" pour tester.');

  readonly canStepForward = signal<boolean>(false);

  // Constructeur
  readonly soldeChoisi = signal<number>(-50);
  readonly instantiationResult = signal<{ success: boolean; title: string; desc: string } | null>(null);

  declencherThrow(): void {
    this.currentStep.set(1);
    this.canStepForward.set(true);
    this.currentStatusText.set('Étape 1 : Exception levée au sommet de la pile !');

    this.frames.update(list => list.map(f => {
      if (f.id === 4) return { ...f, status: 'throwing' };
      return { ...f, status: 'active' };
    }));
  }

  stepForward(): void {
    const step = this.currentStep() + 1;
    this.currentStep.set(step);

    if (step === 2) {
      this.currentStatusText.set('Étape 2 : CompteBancaire.retirer() n\'a pas de catch -> Dépilée !');
      this.frames.update(list => list.map(f => {
        if (f.id === 4) return { ...f, status: 'popped' };
        if (f.id === 3) return { ...f, status: 'unwinding' };
        return f;
      }));
    } else if (step === 3) {
      this.currentStatusText.set('Étape 3 : BanqueService.debiter() n\'a pas de catch -> Dépilée !');
      this.frames.update(list => list.map(f => {
        if (f.id === 3) return { ...f, status: 'popped' };
        if (f.id === 2) return { ...f, status: 'unwinding' };
        return f;
      }));
    } else if (step === 4) {
      this.currentStatusText.set('Étape 4 : CommandeCtrl.valider() n\'a pas de catch -> Dépilée !');
      this.frames.update(list => list.map(f => {
        if (f.id === 2) return { ...f, status: 'popped' };
        if (f.id === 1) return { ...f, status: 'caught' };
        return f;
      }));
    } else if (step === 5) {
      this.currentStatusText.set('Étape 5 : Filet de sécurité atteint dans UiComponent ! Reprise normale.');
      this.canStepForward.set(false);
    }
  }

  resetStack(): void {
    this.currentStep.set(0);
    this.canStepForward.set(false);
    this.currentStatusText.set('Pile nominale réinitialisée.');
    this.frames.set([
      { id: 4, name: 'CompteBancaire.retirer()', file: 'compte.ts:18', hasCatch: false, status: 'active' },
      { id: 3, name: 'BanqueService.debiter()', file: 'banque.service.ts:42', hasCatch: false, status: 'active' },
      { id: 2, name: 'CommandeCtrl.valider()', file: 'commande.controller.ts:65', hasCatch: false, status: 'active' },
      { id: 1, name: 'UiComponent.onValider()', file: 'checkout.component.ts:12', hasCatch: true, status: 'active' }
    ]);
  }

  tenterInstanciation(): void {
    const s = this.soldeChoisi();
    if (s < 0) {
      this.instantiationResult.set({
        success: false,
        title: 'Instanciation Avortée par throw !',
        desc: `throw new Error("Solde initial négatif interdit : ${s} €") a immédiatement stoppé le constructeur. ZÉRO octet d'objet invalide alloué en RAM !`
      });
    } else {
      this.instantiationResult.set({
        success: true,
        title: 'Instance Allouée avec Succès !',
        desc: `CompteBancaire valide créé à l'adresse mémoire 0x7FFE9A avec un solde initial sain de ${s} €.`
      });
    }
  }
}
