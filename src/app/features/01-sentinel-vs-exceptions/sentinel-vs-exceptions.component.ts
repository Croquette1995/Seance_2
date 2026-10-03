import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LabRunnerComponent } from '../../shared/components/lab-runner/lab-runner.component';

@Component({
  selector: 'app-sentinel-vs-exceptions',
  standalone: true,
  imports: [CommonModule, FormsModule, LabRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag-row">
          <span class="module-tag">MODULE 01 · LE PROBLÈME HISTORIQUE</span>
          <span class="badge badge-rose">-1 vs throw</span>
        </div>
        <h2>Codes Sentinelles vs Rupture de Flux</h2>
        <p class="module-desc">
          Pourquoi les valeurs sentinelles procédurales (<code>-1</code>, <code>null</code>, <code>false</code>) échouent-elles inévitablement en POO ?
          Explorez la corruption silencieuse de données, l'ambiguïté sémantique et la traversée directe des couches par <code>throw</code>.
        </p>
      </div>

      <div class="section-mode-tabs">
        <button class="mode-tab-btn" [class.active]="activeMode() === 'interactive'" (click)="activeMode.set('interactive')">
          <span>💥 Simulateurs Interactifs (Sentinelles &amp; Labyrinthe)</span>
        </button>
        <button class="mode-tab-btn" [class.active]="activeMode() === 'lab'" (click)="activeMode.set('lab')">
          <span>💻 Atelier Monaco (Labo 1 · Invariants &amp; throw)</span>
        </button>
      </div>

      @if (activeMode() === 'interactive') {
        <!-- PARTIE 1 : SIMULATEUR D'ANTI-PATTERN -->
        <div class="card-panel demo-card">
          <div class="card-title-row">
            <span class="badge badge-rose">Simulateur 1</span>
            <h3>L'Anti-Pattern des « Codes de Retour Magiques »</h3>
          </div>
          <p class="section-intro">
            Observez comment un appelant distrait oublie de tester la valeur sentinelle <code>-1</code>, corrompant la mémoire en silence.
          </p>

          <div class="sim-grid">
            <!-- Panneau de Contrôle -->
            <div class="control-box">
              <div class="ctrl-title">Profil du Développeur Appelant :</div>
              <div class="dev-toggle">
                <button 
                  class="choice-btn" 
                  [class.active]="isCarefulCaller()" 
                  (click)="isCarefulCaller.set(true)"
                >
                  🛡️ Développeur Rigoureux (Teste if res === -1)
                </button>
                <button 
                  class="choice-btn" 
                  [class.active]="!isCarefulCaller()" 
                  (click)="isCarefulCaller.set(false)"
                >
                  ⚡ Développeur Distrait (Oublie le test -1)
                </button>
              </div>

              <div class="actions-group mt-3">
                <div class="ctrl-title">Simuler une opération de retrait :</div>
                <div class="buttons-row">
                  <button class="btn-secondary btn-sm" (click)="testerRetrait(40)">
                    Retirer 40 € (Nominal)
                  </button>
                  <button class="btn-primary btn-sm" (click)="testerRetrait(150)">
                    Retirer 150 € (Dépassement)
                  </button>
                  <button class="btn-ghost btn-sm" (click)="resetCompte()">
                    ↺ Réinitialiser
                  </button>
                </div>
              </div>

              <!-- État du Compte en Mémoire -->
              <div class="memory-state mt-3" [class.corrupted]="isMemoryCorrupted()">
                <div class="mem-label">État de la mémoire (CompteBancaire) :</div>
                <div class="mem-val">{{ soldeAffiche() }} €</div>
                @if (isMemoryCorrupted()) {
                  <div class="corrupt-alert">
                    💥 <strong>MÉMOIRE CORROMPUE !</strong> Le solde est devenu -1 € sans que personne ne s'en rende compte !
                    <div class="dim">Ambiguïté fatale : impossible de distinguer le code d'erreur -1 d'un solde réel de -1 € (découvert autorisé).</div>
                  </div>
                }
              </div>
            </div>

            <!-- Visualisation du Code Exécuté -->
            <div class="code-box">
              <div class="code-box-header">Code TypeScript exécuté au runtime :</div>
              <pre class="code-content"><code><span class="dim">// Méthode de la classe CompteBancaire :</span>
retirer(montant: number): number &#123;
  if (montant > this.solde) &#123;
    <span class="hl-red">return -1; // 🛑 Code sentinelle magique</span>
  &#125;
  this.solde -= montant;
  return this.solde;
&#125;

<span class="dim">// Code de l'appelant :</span>
const res = compte.retirer({{ dernierMontant() }});
@if (isCarefulCaller()) {
<span class="hl-green">if (res === -1) &#123;</span>
  alert("Erreur solde !");
<span class="hl-green">&#125; else &#123;</span>
  this.solde = res;
<span class="hl-green">&#125;</span>
} @else {
<span class="hl-red">// Le développeur a oublié le if (res === -1) :</span>
this.solde = res; <span class="hl-red">// 💥 Assigne directement -1 !</span>
}</code></pre>
            </div>
          </div>
        </div>

        <!-- PARTIE 2 : LE LABYRINTHE DE LA PROPAGATION MANUELLE -->
        <div class="card-panel demo-card mt-3">
          <div class="card-title-row">
            <span class="badge badge-indigo">Simulateur 2</span>
            <h3>Le Labyrinthe de la Propagation Manuelle vs Court-Circuit throw</h3>
          </div>
          <p class="section-intro">
            Comparez le calvaire des vérifications défensives à chaque étage et la puissance du court-circuit par exception.
          </p>

          <div class="mode-switch-row mb-3">
            <button 
              class="choice-btn" 
              [class.active]="propagationMode() === 'sentinel'" 
              (click)="propagationMode.set('sentinel')"
            >
              🛑 Mode Sentinelle (80% de code parasite intermédiaire)
            </button>
            <button 
              class="choice-btn" 
              [class.active]="propagationMode() === 'exception'" 
              (click)="propagationMode.set('exception')"
            >
              ⚡ Mode Exception (Saut direct vers le gestionnaire UI)
            </button>
          </div>

          <div class="layers-flow-container">
            <div class="layer-step" [class.highlight]="propagationStep() >= 4">
              <div class="layer-tag">Étage 4 : Interface Utilisateur (UI)</div>
              <div class="layer-code">
                @if (propagationMode() === 'sentinel') {
                  <code>const res = controller(); if (res &lt; 0) afficherErreur(res);</code>
                } @else {
                  <code>try &#123; controller(); &#125; catch (e) &#123; <span class="hl-green">afficherAlerte(e);</span> &#125;</code>
                }
              </div>
            </div>

            <div class="flow-arrow">▲ remonte</div>

            <div class="layer-step" [class.highlight]="propagationStep() >= 3" [class.parasite]="propagationMode() === 'sentinel'">
              <div class="layer-tag">Étage 3 : Contrôleur Applicatif</div>
              <div class="layer-code">
                @if (propagationMode() === 'sentinel') {
                  <code>const code = service(); <span class="hl-red">if (code &lt; 0) return code;</span> // Bruit parasite</code>
                } @else {
                  <code>return service(); <span class="hl-green">// Zéro bruit !</span></code>
                }
              </div>
            </div>

            <div class="flow-arrow">▲ remonte</div>

            <div class="layer-step" [class.highlight]="propagationStep() >= 2" [class.parasite]="propagationMode() === 'sentinel'">
              <div class="layer-tag">Étage 2 : Service Métier</div>
              <div class="layer-code">
                @if (propagationMode() === 'sentinel') {
                  <code>const code = base(); <span class="hl-red">if (code &lt; 0) return code;</span> // Bruit parasite</code>
                } @else {
                  <code>return base(); <span class="hl-green">// Zéro bruit !</span></code>
                }
              </div>
            </div>

            <div class="flow-arrow">▲ source de la panne</div>

            <div class="layer-step origin" [class.highlight]="propagationStep() >= 1">
              <div class="layer-tag">Étage 1 : Couche Données / Stockage</div>
              <div class="layer-code">
                @if (propagationMode() === 'sentinel') {
                  <code>if (disquePlein()) <span class="hl-red">return -5;</span></code>
                } @else {
                  <code>if (disquePlein()) <span class="hl-red">throw new DisquePleinError();</span></code>
                }
              </div>
            </div>
          </div>

          <div class="trigger-row mt-3">
            <button class="btn-primary" (click)="declencherPanne()">
              🚀 Déclencher la Panne Disque
            </button>
            <span class="trigger-result">
              {{ statusMessage() }}
            </span>
          </div>
        </div>
      } @else {
        <!-- ATELIER MONACO -->
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

    .sim-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .control-box, .code-box {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
    }

    .ctrl-title, .code-box-header {
      font-size: 0.78rem;
      font-weight: 700;
      text-transform: uppercase;
      color: var(--text-muted);
      margin-bottom: 8px;
    }

    .dev-toggle {
      display: flex;
      gap: 8px;
      flex-direction: column;
    }

    .choice-btn {
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 0.82rem;
      font-weight: 600;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      color: var(--text-muted);
      text-align: left;

      &.active {
        background: rgba(99, 102, 241, 0.15);
        color: #818cf8;
        border-color: #6366f1;
      }
    }

    .buttons-row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .memory-state {
      padding: 14px;
      border-radius: 8px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      text-align: center;

      .mem-label {
        font-size: 0.75rem;
        color: var(--text-muted);
        text-transform: uppercase;
        font-weight: 700;
      }

      .mem-val {
        font-size: 2rem;
        font-weight: 900;
        color: #34d399;
        font-family: var(--font-mono);
      }

      &.corrupted {
        border-color: #f43f5e;
        background: rgba(244, 63, 94, 0.08);

        .mem-val {
          color: #f43f5e;
        }
      }

      .corrupt-alert {
        margin-top: 8px;
        font-size: 0.8rem;
        color: #fca5a5;
        line-height: 1.4;

        .dim {
          font-size: 0.72rem;
          color: #94a3b8;
          margin-top: 4px;
        }
      }
    }

    .code-content {
      margin: 0;
      font-size: 0.8rem;
      line-height: 1.5;
      color: var(--text-code);
      font-family: var(--font-mono);
    }

    .dim { color: #64748b; }
    .hl-red { color: #f43f5e; font-weight: 700; }
    .hl-green { color: #34d399; font-weight: 700; }

    .mode-switch-row {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .layers-flow-container {
      display: flex;
      flex-direction: column;
      gap: 6px;
      max-width: 720px;
    }

    .layer-step {
      padding: 12px 16px;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      transition: all 0.3s;

      .layer-tag {
        font-size: 0.75rem;
        font-weight: 700;
        color: var(--text-muted);
        margin-bottom: 4px;
      }

      &.parasite {
        border-left: 4px solid #f59e0b;
      }

      &.origin {
        border-left: 4px solid #f43f5e;
      }

      &.highlight {
        border-color: #6366f1;
        background: rgba(99, 102, 241, 0.1);
      }
    }

    .flow-arrow {
      font-size: 0.72rem;
      font-family: var(--font-mono);
      color: var(--text-dim);
      padding-left: 20px;
    }

    .trigger-row {
      display: flex;
      align-items: center;
      gap: 16px;

      .trigger-result {
        font-size: 0.85rem;
        font-weight: 600;
        color: #818cf8;
      }
    }
  `]
})
export class SentinelVsExceptionsComponent {
  readonly activeMode = signal<'interactive' | 'lab'>('interactive');

  // Simulateur 1
  readonly isCarefulCaller = signal<boolean>(false);
  readonly soldeAffiche = signal<number>(100);
  readonly dernierMontant = signal<number>(40);
  readonly isMemoryCorrupted = signal<boolean>(false);

  // Simulateur 2
  readonly propagationMode = signal<'sentinel' | 'exception'>('sentinel');
  readonly propagationStep = signal<number>(0);
  readonly statusMessage = signal<string>('Cliquez sur le bouton pour observer la propagation.');

  testerRetrait(montant: number): void {
    this.dernierMontant.set(montant);

    if (montant > 100) {
      // Débit impossible
      if (this.isCarefulCaller()) {
        this.isMemoryCorrupted.set(false);
      } else {
        // Distrait : assigne -1
        this.soldeAffiche.set(-1);
        this.isMemoryCorrupted.set(true);
      }
    } else {
      this.soldeAffiche.set(100 - montant);
      this.isMemoryCorrupted.set(false);
    }
  }

  resetCompte(): void {
    this.soldeAffiche.set(100);
    this.isMemoryCorrupted.set(false);
    this.dernierMontant.set(40);
  }

  declencherPanne(): void {
    if (this.propagationMode() === 'sentinel') {
      this.statusMessage.set('🛑 Propagation manuelle : l\'erreur -5 a dû être relayée et testée à chaque étage !');
    } else {
      this.statusMessage.set('⚡ Court-circuit : throw new DisquePleinError() a sauté directement vers le catch de l\'UI !');
    }
    this.propagationStep.set(4);
  }
}
