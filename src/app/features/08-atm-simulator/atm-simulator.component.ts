import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LabRunnerComponent } from '../../shared/components/lab-runner/lab-runner.component';

// Exceptions Métier du Domaine Bancaire
export abstract class BanqueError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class SoldeInsuffisantError extends BanqueError {
  public readonly montantManquant: number;
  constructor(public readonly soldeActuel: number, public readonly montantDemande: number) {
    const manque = montantDemande - soldeActuel;
    super(
      `Solde insuffisant (${soldeActuel} €) pour retirer ${montantDemande} € ! Montant manquant : ${manque} €.`,
      'SOLDE_INSUFFISANT'
    );
    this.montantManquant = manque;
  }
}

export class MontantInvalideError extends BanqueError {
  constructor(public readonly montant: number) {
    super(
      `Le montant (${montant} €) doit être strictement supérieur à zéro !`,
      'MONTANT_INVALIDE'
    );
  }
}

@Component({
  selector: 'app-atm-simulator',
  standalone: true,
  imports: [CommonModule, FormsModule, LabRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag-row">
          <span class="module-tag">MODULE 08 · DÉMONSTRATEUR TEMPS RÉEL</span>
          <span class="badge badge-emerald">Signals &amp; Robustesse</span>
        </div>
        <h2>Simulateur Réactif d'ATM Bancaire (EAFC Bank)</h2>
        <p class="module-desc">
          Mise en pratique intégrale de la séance : observez la rupture de flux au sein du service, la préservation de l'intégrité du solde,
          l'interception typée dans le composant Angular et la garantie de déverrouillage de l'écran dans le bloc <code>finally</code>.
        </p>
      </div>

      <div class="section-mode-tabs">
        <button class="mode-tab-btn" [class.active]="activeMode() === 'interactive'" (click)="activeMode.set('interactive')">
          <span>🏧 Guichet Automatique en Direct &amp; Code Live</span>
        </button>
        <button class="mode-tab-btn" [class.active]="activeMode() === 'lab'" (click)="activeMode.set('lab')">
          <span>💻 Atelier Monaco (Labo 6 · Signaux &amp; Résilience UI)</span>
        </button>
      </div>

      @if (activeMode() === 'interactive') {
        <div class="atm-live-layout">
          <!-- GUICHET AUTOMATIQUE (COLONNE GAUCHE) -->
          <div class="atm-column">
            <div class="atm-device-frame">
              <!-- En-tête Guichet -->
              <div class="atm-screen-header">
                <div class="atm-brand">
                  <span>🏧</span>
                  <strong>EAFC Bank ATM</strong>
                </div>
                <div class="atm-online-badge">
                  <span class="pulse-dot"></span>
                  <span>EN LIGNE</span>
                </div>
              </div>

              <!-- Écran d'affichage réactif -->
              <div class="atm-screen-display">
                <div class="display-label">SOLDE DISPONIBLE EN COMPTE</div>
                <div class="display-balance">{{ solde() }} €</div>
                <div class="display-meta">Compte Courant Particulier · BE76 **** 4210</div>
              </div>

              <!-- Clavier & Boutons de Retrait Rapide -->
              <div class="atm-controls-area">
                <div class="area-label">Sélectionnez ou saisissez un montant :</div>
                
                <div class="quick-withdraw-grid">
                  <button 
                    class="atm-btn" 
                    [disabled]="enCours()" 
                    (click)="onRetirer(40)"
                  >
                    40 € <span class="tag">Nominal</span>
                  </button>
                  <button 
                    class="atm-btn danger-btn" 
                    [disabled]="enCours()" 
                    (click)="onRetirer(150)"
                  >
                    150 € <span class="tag">Dépassement</span>
                  </button>
                  <button 
                    class="atm-btn warn-btn" 
                    [disabled]="enCours()" 
                    (click)="onRetirer(-20)"
                  >
                    -20 € <span class="tag">Invalide</span>
                  </button>
                </div>

                <!-- Saisie personnalisée -->
                <div class="custom-input-row mt-3">
                  <input 
                    type="number" 
                    placeholder="Autre montant..." 
                    [(ngModel)]="customMontant" 
                    [disabled]="enCours()"
                  >
                  <button 
                    class="btn-primary" 
                    [disabled]="enCours() || !customMontant" 
                    (click)="onRetirer(customMontant!)"
                  >
                    Valider Retrait
                  </button>
                </div>

                <div class="reset-row mt-2">
                  <button class="btn-ghost btn-xs" (click)="resetAtm()">
                    ↺ Réinitialiser solde à 100 €
                  </button>
                </div>
              </div>

              <!-- Zone de Messages Réactifs (@if) -->
              <div class="atm-feedback-zone">
                @if (enCours()) {
                  <div class="feedback-banner loading">
                    <div class="spinner-small"></div>
                    <span>Communication avec le serveur bancaire...</span>
                  </div>
                }

                @if (succes()) {
                  <div class="feedback-banner success animate-slide">
                    <span class="icon">✅</span>
                    <span>{{ succes() }}</span>
                  </div>
                }

                @if (erreur(); as err) {
                  <div class="feedback-banner error animate-slide">
                    <div class="err-header">
                      <span>⚠️ Retrait Refusé</span>
                      <span class="code-pill">[{{ err.code }}]</span>
                    </div>
                    <p class="err-msg">{{ err.message }}</p>
                  </div>
                }
              </div>
            </div>
          </div>

          <!-- INSPECTEUR DE CODE EN DIRECT (COLONNE DROITE) -->
          <div class="code-column">
            <!-- Code du Service -->
            <div class="card-panel code-panel">
              <div class="code-panel-header">
                <span class="badge badge-indigo">Étage 2 : Service Métier</span>
                <strong>BanqueService.retirer()</strong>
              </div>
              <pre><code>retirer(soldeActuel: number, montant: number): number &#123;
  <span class="dim">// Invariant 1 : montant positif strict</span>
  if (montant &lt;= 0) &#123;
    <span class="hl-amber">throw new MontantInvalideError(montant);</span>
  &#125;
  <span class="dim">// Invariant 2 : interdiction de découvert non autorisé</span>
  if (montant > soldeActuel) &#123;
    <span class="hl-red">throw new SoldeInsuffisantError(soldeActuel, montant);</span>
  &#125;
  <span class="hl-green">return soldeActuel - montant;</span>
&#125;</code></pre>
            </div>

            <!-- Code du Composant -->
            <div class="card-panel code-panel mt-3">
              <div class="code-panel-header">
                <span class="badge badge-emerald">Étage 3 : Composant Angular</span>
                <strong>AtmComponent.onRetirer()</strong>
              </div>
              <pre><code>onRetirer(montant: number): void &#123;
  this.enCours.set(true);
  this.erreur.set(null);
  this.succes.set(null);

  try &#123;
    const nouveau = this.service.retirer(this.solde(), montant);
    <span class="hl-green">this.solde.set(nouveau); // ✅ Jamais atteint si exception !</span>
    this.succes.set(\`💵 Retrait de &#36;&#123;montant&#125; € validé !\`);
  &#125; catch (e: unknown) &#123;
    <span class="dim">// 🛡️ Typage strict &amp; Narrowing avec instanceof</span>
    if (e instanceof BanqueError) &#123;
      <span class="hl-amber">this.erreur.set(e); // Alimente le Signal UI sans crash</span>
    &#125;
  &#125; finally &#123;
    <span class="hl-green">this.enCours.set(false); // 🔒 Déverrouillage 100% garanti !</span>
  &#125;
&#125;</code></pre>
            </div>
          </div>
        </div>
      } @else {
        <!-- ATELIER MONACO LABO 6 -->
        <app-lab-runner [filterLabNumber]="6"></app-lab-runner>
      }
    </div>
  `,
  styles: [`
    .atm-live-layout {
      display: grid;
      grid-template-columns: 420px 1fr;
      gap: 20px;

      @media (max-width: 1050px) {
        grid-template-columns: 1fr;
      }
    }

    .atm-device-frame {
      background: var(--bg-card);
      border: 2px solid var(--border-color);
      border-radius: 18px;
      padding: 20px;
      box-shadow: var(--shadow-lg);
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .atm-screen-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 10px;

      .atm-brand {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.95rem;
        color: var(--text-main);
      }

      .atm-online-badge {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 0.7rem;
        font-weight: 700;
        color: #34d399;
        font-family: var(--font-mono);
      }
    }

    .pulse-dot {
      width: 7px;
      height: 7px;
      background: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 8px #10b981;
    }

    .atm-screen-display {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 16px;
      text-align: center;

      .display-label {
        font-size: 0.72rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--text-muted);
      }

      .display-balance {
        font-size: 2.6rem;
        font-weight: 900;
        color: #34d399;
        font-family: var(--font-mono);
        margin: 4px 0;
        text-shadow: 0 0 20px rgba(16, 185, 129, 0.25);
      }

      .display-meta {
        font-size: 0.72rem;
        color: var(--text-dim);
        font-family: var(--font-mono);
      }
    }

    .atm-controls-area {
      display: flex;
      flex-direction: column;
      gap: 10px;

      .area-label {
        font-size: 0.78rem;
        font-weight: 700;
        color: var(--text-muted);
      }
    }

    .quick-withdraw-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
    }

    .atm-btn {
      padding: 12px 6px;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 800;
      color: var(--text-main);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;

      .tag {
        font-size: 0.65rem;
        font-weight: 600;
        color: var(--text-muted);
      }

      &:hover:not(:disabled) {
        border-color: #6366f1;
        background: var(--bg-card-hover);
      }

      &.danger-btn {
        border-color: rgba(244, 63, 94, 0.4);
        &:hover:not(:disabled) {
          border-color: #f43f5e;
          background: rgba(244, 63, 94, 0.1);
        }
      }

      &.warn-btn {
        border-color: rgba(245, 158, 11, 0.4);
        &:hover:not(:disabled) {
          border-color: #f59e0b;
          background: rgba(245, 158, 11, 0.1);
        }
      }
    }

    .custom-input-row {
      display: flex;
      gap: 8px;

      input {
        flex: 1;
        background: var(--bg-subtle);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        padding: 8px 12px;
        color: var(--text-main);
        font-size: 0.85rem;
        font-family: inherit;

        &:focus {
          outline: none;
          border-color: #6366f1;
        }
      }
    }

    .reset-row {
      display: flex;
      justify-content: flex-end;
    }

    .atm-feedback-zone {
      min-height: 80px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .feedback-banner {
      padding: 12px 14px;
      border-radius: 8px;
      font-size: 0.82rem;
      display: flex;
      align-items: center;
      gap: 10px;

      &.loading {
        background: rgba(99, 102, 241, 0.12);
        border: 1px solid rgba(99, 102, 241, 0.3);
        color: #c7d2fe;
      }

      &.success {
        background: rgba(16, 185, 129, 0.15);
        border: 1px solid rgba(16, 185, 129, 0.35);
        color: #ecfdf5;
      }

      &.error {
        background: rgba(244, 63, 94, 0.15);
        border: 2px solid #f43f5e;
        color: #fef2f2;
        flex-direction: column;
        align-items: stretch;
        gap: 6px;

        .err-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-weight: 800;
          color: #fca5a5;

          .code-pill {
            font-family: var(--font-mono);
            font-size: 0.72rem;
            background: #be123c;
            color: #fff;
            padding: 1px 6px;
            border-radius: 4px;
          }
        }

        .err-msg {
          margin: 0;
          line-height: 1.4;
          font-size: 0.8rem;
        }
      }
    }

    .spinner-small {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(99, 102, 241, 0.3);
      border-top-color: #6366f1;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .code-panel {
      display: flex;
      flex-direction: column;
      gap: 10px;

      .code-panel-header {
        display: flex;
        align-items: center;
        gap: 10px;

        strong {
          font-family: var(--font-mono);
          font-size: 0.85rem;
          color: var(--text-main);
        }
      }

      pre {
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
    }

    .hl-green { color: #34d399; font-weight: 700; }
    .hl-red { color: #f43f5e; font-weight: 700; }
    .hl-amber { color: #f59e0b; font-weight: 700; }
    .dim { color: #64748b; }
  `]
})
export class AtmSimulatorComponent {
  readonly activeMode = signal<'interactive' | 'lab'>('interactive');

  // Signaux réactifs de l'automate
  readonly solde = signal<number>(100);
  readonly erreur = signal<BanqueError | null>(null);
  readonly succes = signal<string | null>(null);
  readonly enCours = signal<boolean>(false);

  customMontant: number | null = null;

  // Implémentation du service bancaire métier (Étage 2)
  private debiterCompte(soldeActuel: number, montant: number): number {
    if (montant <= 0) {
      throw new MontantInvalideError(montant);
    }
    if (montant > soldeActuel) {
      throw new SoldeInsuffisantError(soldeActuel, montant);
    }
    return soldeActuel - montant;
  }

  // Étage 3 : Gestionnaire d'action du composant Angular
  onRetirer(montant: number): void {
    this.enCours.set(true);
    this.erreur.set(null);
    this.succes.set(null);

    // Simulation de latence réseau pour observer le verrouillage
    setTimeout(() => {
      try {
        const nouveauSolde = this.debiterCompte(this.solde(), montant);
        // ✅ Mise à jour uniquement en cas de succès !
        this.solde.set(nouveauSolde);
        this.succes.set(`💵 Retrait de ${montant} € effectué avec succès. Récupérez vos billets.`);
      } catch (e: unknown) {
        // 🛡️ Typage strict : capture chirurgicale de l'anomalie métier
        if (e instanceof BanqueError) {
          this.erreur.set(e);
        } else {
          throw e; // Relance des bogues inattendus
        }
      } finally {
        // 🔒 Toujours exécuté : réactivation garantie des touches
        this.enCours.set(false);
      }
    }, 400);
  }

  resetAtm(): void {
    this.solde.set(100);
    this.erreur.set(null);
    this.succes.set(null);
    this.customMontant = null;
  }
}
