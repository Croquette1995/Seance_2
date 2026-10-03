import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LabRunnerComponent } from '../../shared/components/lab-runner/lab-runner.component';

@Component({
  selector: 'app-try-catch-finally',
  standalone: true,
  imports: [CommonModule, FormsModule, LabRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag-row">
          <span class="module-tag">MODULE 03 · SYNTAXE &amp; SÉMANTIQUE</span>
          <span class="badge badge-emerald">Garantie 100%</span>
        </div>
        <h2>Anatomie de try / catch / finally &amp; Libération de Ressources</h2>
        <p class="module-desc">
          Le bloc <code>finally</code> possède une garantie indestructible : il s'exécute dans 100% des cas, que le bloc <code>try</code> réussisse, échoue ou contienne un <code>return</code> prématuré.
          Explorez les 3 flux d'exécution et protégez vos ressources critiques.
        </p>
      </div>

      <div class="section-mode-tabs">
        <button class="mode-tab-btn" [class.active]="activeMode() === 'interactive'" (click)="activeMode.set('interactive')">
          <span>💥 Traqueur de Flux &amp; Bac à Sable de Libération</span>
        </button>
        <button class="mode-tab-btn" [class.active]="activeMode() === 'lab'" (click)="activeMode.set('lab')">
          <span>💻 Atelier Monaco (Labo 2 · Syntaxe &amp; Libération)</span>
        </button>
      </div>

      @if (activeMode() === 'interactive') {
        <!-- PARTIE 1 : TRAQUEUR DE FLUX PAS-À-PAS -->
        <div class="card-panel demo-card">
          <div class="card-title-row">
            <span class="badge badge-indigo">Traqueur Interactif</span>
            <h3>Les 3 Chemins d'Exécution de try / catch / finally</h3>
          </div>
          <p class="section-intro">
            Choisissez un scénario et observez le tracé surligné en direct dans le code source.
          </p>

          <div class="scenario-selector-row">
            <button 
              class="choice-btn" 
              [class.active]="currentScenario() === 'nominal'"
              (click)="selectScenario('nominal')"
            >
              1. Scénario Nominal (try ➔ finally ➔ suite)
            </button>
            <button 
              class="choice-btn" 
              [class.active]="currentScenario() === 'error'"
              (click)="selectScenario('error')"
            >
              2. Scénario d'Erreur (try ➔ catch ➔ finally ➔ suite)
            </button>
            <button 
              class="choice-btn" 
              [class.active]="currentScenario() === 'return'"
              (click)="selectScenario('return')"
            >
              3. Return Anticipé (try ➔ return intercepté par finally !)
            </button>
          </div>

          <div class="code-execution-tracker mt-3">
            <pre class="tracked-code"><code><span [class.active-line]="isLineActive(1)">function executer() &#123;</span>
<span [class.active-line]="isLineActive(2)">  try &#123;</span>
<span [class.active-line]="isLineActive(3)">    console.log("A. Début de l'opération");</span>
<span [class.active-line]="isLineActive(4)" [class.danger-line]="currentScenario() === 'error'">    {{ line4Code() }}</span>
<span [class.active-line]="isLineActive(5)" [class.skipped-line]="currentScenario() === 'error'">    {{ line5Code() }}</span>
<span [class.active-line]="isLineActive(6)">  &#125; catch (error: unknown) &#123;</span>
<span [class.active-line]="isLineActive(7)" [class.skipped-line]="currentScenario() !== 'error'">    console.warn("C. Exception interceptée !");</span>
<span [class.active-line]="isLineActive(8)">  &#125; finally &#123;</span>
<span [class.active-line]="isLineActive(9)" class="highlight-finally">    console.log("D. FINALLY : Toujours exécuté dans 100% des cas !");</span>
<span [class.active-line]="isLineActive(10)">  &#125;</span>
<span [class.active-line]="isLineActive(11)" [class.skipped-line]="currentScenario() === 'return'">  console.log("E. Reprise normale du flux");</span>
<span [class.active-line]="isLineActive(12)">&#125;</span></code></pre>

            <div class="execution-log-box">
              <div class="log-title">Tracé d'exécution constaté dans la console :</div>
              <div class="trace-sequence">
                @for (entry of currentTrace(); track $index) {
                  <div class="trace-pill" [class.rose]="entry.includes('Exception')" [class.emerald]="entry.includes('FINALLY')">
                    {{ entry }}
                  </div>
                }
              </div>
              <div class="scenario-explanation mt-3">
                <strong>💡 Analyse :</strong> {{ scenarioExplanation() }}
              </div>
            </div>
          </div>
        </div>

        <!-- PARTIE 2 : BAC À SABLE DE LIBÉRATION DE RESSOURCE -->
        <div class="card-panel demo-card mt-3">
          <div class="card-title-row">
            <span class="badge badge-emerald">Bac à Sable</span>
            <h3>Garantie de Libération de Ressources (Resource Cleanup)</h3>
          </div>
          <p class="section-intro">
            Simulez un incident sur une ressource critique (fichier ou bouton de paiement UI).
            Découvrez comment un oubli de <code>finally</code> paralyse l'application.
          </p>

          <div class="cleanup-grid">
            <div class="config-col">
              <div class="ctrl-title">Configuration de la protection :</div>
              
              <div class="toggle-group mt-2">
                <button 
                  class="choice-btn" 
                  [class.active]="useFinally()" 
                  (click)="useFinally.set(true)"
                >
                  🛡️ Avec bloc finally (Fermeture inconditionnelle garantie)
                </button>
                <button 
                  class="choice-btn" 
                  [class.active]="!useFinally()" 
                  (click)="useFinally.set(false)"
                >
                  ❌ Sans bloc finally (Nettoyage placé après le try)
                </button>
              </div>

              <div class="action-btn mt-3">
                <button class="btn-primary" (click)="lancerOperationRisquee()">
                  ⚡ Lancer l'opération avec panne inattendue
                </button>
              </div>
            </div>

            <div class="status-col">
              <div class="resource-card" [class.locked]="isResourceLocked()">
                <div class="res-header">
                  <span>Indicateur d'État de la Ressource</span>
                  <span class="res-badge">{{ isResourceLocked() ? '🔒 BLOQUÉE (LEAK)' : '🔓 LIBÉRÉE' }}</span>
                </div>
                <div class="res-body">
                  <div class="res-metric">
                    <span>Curseur de chargement (isLoading) :</span>
                    <strong [class.red]="isLoadingFlag()">{{ isLoadingFlag() ? 'true (En cours...)' : 'false (Prêt)' }}</strong>
                  </div>
                  <div class="res-metric">
                    <span>Descripteur de fichier :</span>
                    <strong [class.red]="isResourceLocked()">{{ isResourceLocked() ? 'OUVERT (Mémoire occupée)' : 'FERMÉ (Libéré)' }}</strong>
                  </div>
                </div>
                <div class="res-comment mt-2">
                  {{ cleanupComment() }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- PARTIE 3 : ANTI-PATTERN DÉTECTEUR -->
        <div class="card-panel demo-card mt-3 danger-border">
          <div class="card-title-row">
            <span class="badge badge-rose">Alerte Anti-Pattern</span>
            <h3>⚠️ Ne JAMAIS mettre de return ou de throw dans finally</h3>
          </div>
          <p class="section-intro">
            Placer une instruction <code>return</code> ou <code>throw</code> dans un bloc <code>finally</code> écrase et détruit silencieusement tout ce qui a été calculé ou levé dans le <code>try</code> ou le <code>catch</code> !
          </p>
          <div class="anti-pattern-code-box">
            <code>try &#123; throw new Error("Erreur vitale !"); &#125; finally &#123; <span class="hl-red">return false; // ☠️ L'erreur est effacée de l'univers !</span> &#125;</code>
          </div>
        </div>
      } @else {
        <!-- ATELIER MONACO LABO 2 -->
        <app-lab-runner [filterLabNumber]="2"></app-lab-runner>
      }
    </div>
  `,
  styles: [`
    .demo-card {
      display: flex;
      flex-direction: column;
      gap: 12px;

      &.danger-border {
        border-color: rgba(244, 63, 94, 0.4);
        background: rgba(244, 63, 94, 0.04);
      }
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

    .scenario-selector-row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .choice-btn {
      padding: 8px 14px;
      border-radius: 6px;
      font-size: 0.82rem;
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

    .code-execution-tracker {
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 16px;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .tracked-code {
      margin: 0;
      padding: 16px;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      font-family: var(--font-mono);
      font-size: 0.82rem;
      line-height: 1.6;
      color: var(--text-code);

      span {
        display: block;
        transition: all 0.2s;
      }

      .active-line {
        background: rgba(99, 102, 241, 0.2);
        color: #c7d2fe;
        font-weight: 700;
        border-left: 3px solid #6366f1;
        padding-left: 6px;
      }

      .danger-line {
        color: #f43f5e;
      }

      .skipped-line {
        opacity: 0.35;
        text-decoration: line-through;
      }

      .highlight-finally {
        color: #34d399;
        font-weight: 700;
      }
    }

    .execution-log-box {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;

      .log-title {
        font-size: 0.78rem;
        font-weight: 700;
        text-transform: uppercase;
        color: var(--text-muted);
      }

      .trace-sequence {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .trace-pill {
        padding: 6px 12px;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        font-family: var(--font-mono);
        font-size: 0.8rem;
        color: var(--text-main);

        &.rose {
          border-color: #f43f5e;
          background: rgba(244, 63, 94, 0.1);
          color: #fca5a5;
        }

        &.emerald {
          border-color: #10b981;
          background: rgba(16, 185, 129, 0.1);
          color: #34d399;
          font-weight: 700;
        }
      }

      .scenario-explanation {
        font-size: 0.82rem;
        color: var(--text-muted);
        line-height: 1.45;
        padding-top: 8px;
        border-top: 1px solid var(--border-color);
      }
    }

    .cleanup-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;

      @media (max-width: 850px) {
        grid-template-columns: 1fr;
      }
    }

    .config-col {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .ctrl-title {
      font-size: 0.78rem;
      font-weight: 700;
      text-transform: uppercase;
      color: var(--text-muted);
    }

    .toggle-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .resource-card {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;

      .res-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.82rem;
        font-weight: 700;
        color: var(--text-main);
      }

      .res-badge {
        font-size: 0.72rem;
        padding: 2px 8px;
        border-radius: 4px;
        background: rgba(16, 185, 129, 0.15);
        color: #34d399;
      }

      .res-body {
        display: flex;
        flex-direction: column;
        gap: 6px;
        font-size: 0.82rem;
        margin-top: 4px;
      }

      .res-metric {
        display: flex;
        justify-content: space-between;
        color: var(--text-muted);

        strong {
          color: var(--text-main);

          &.red {
            color: #f43f5e;
          }
        }
      }

      &.locked {
        border-color: #f43f5e;
        background: rgba(244, 63, 94, 0.08);

        .res-badge {
          background: rgba(244, 63, 94, 0.15);
          color: #f87171;
        }
      }

      .res-comment {
        font-size: 0.78rem;
        color: var(--text-dim);
        line-height: 1.4;
      }
    }

    .anti-pattern-code-box {
      padding: 12px 16px;
      background: var(--bg-subtle);
      border-radius: 6px;
      font-family: var(--font-mono);
      font-size: 0.84rem;

      .hl-red {
        color: #f43f5e;
        font-weight: 700;
      }
    }
  `]
})
export class TryCatchFinallyComponent {
  readonly activeMode = signal<'interactive' | 'lab'>('interactive');

  // Traqueur
  readonly currentScenario = signal<'nominal' | 'error' | 'return'>('nominal');

  // Libération
  readonly useFinally = signal<boolean>(true);
  readonly isLoadingFlag = signal<boolean>(false);
  readonly isResourceLocked = signal<boolean>(false);
  readonly cleanupComment = signal<string>('Cliquez sur le bouton pour tester la libération sous incident.');

  selectScenario(sc: 'nominal' | 'error' | 'return'): void {
    this.currentScenario.set(sc);
  }

  isLineActive(line: number): boolean {
    const sc = this.currentScenario();
    if (sc === 'nominal') {
      return [1, 2, 3, 4, 5, 8, 9, 10, 11, 12].includes(line);
    } else if (sc === 'error') {
      return [1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12].includes(line);
    } else {
      return [1, 2, 3, 4, 8, 9, 10, 12].includes(line);
    }
  }

  line4Code(): string {
    const sc = this.currentScenario();
    if (sc === 'nominal') return '    effectuerCalcul(); // Succès';
    if (sc === 'error') return '    throw new Error("Panne critique !"); // 💥 Exception';
    return '    return "Résultat immédiat"; // ⚠️ Return anticipé';
  }

  line5Code(): string {
    const sc = this.currentScenario();
    if (sc === 'nominal') return '    console.log("B. Calcul validé");';
    if (sc === 'error') return '    console.log("B. Cette ligne n\'est JAMAIS atteinte");';
    return '    console.log("B. Non atteint suite au return");';
  }

  currentTrace(): string[] {
    const sc = this.currentScenario();
    if (sc === 'nominal') {
      return [
        'A. Début de l\'opération',
        'B. Calcul validé',
        'D. FINALLY : Toujours exécuté dans 100% des cas !',
        'E. Reprise normale du flux'
      ];
    } else if (sc === 'error') {
      return [
        'A. Début de l\'opération',
        'C. Exception interceptée !',
        'D. FINALLY : Toujours exécuté dans 100% des cas !',
        'E. Reprise normale du flux'
      ];
    } else {
      return [
        'A. Début de l\'opération',
        'D. FINALLY : Exécuté AVANT le return de sortie !'
      ];
    }
  }

  scenarioExplanation(): string {
    const sc = this.currentScenario();
    if (sc === 'nominal') {
      return 'Chemin heureux complet : le try se termine, finally garantit le nettoyage, puis le programme poursuit son cours après le bloc.';
    } else if (sc === 'error') {
      return 'Rupture de séquence : l\'instruction suivante dans le try est court-circuitée. catch prend le relais, puis finally s\'exécute sans faute.';
    } else {
      return 'Garantie magique : même en cas de return prématuré, la machine virtuelle suspend la sortie effective pour exécuter obligatoirement le bloc finally d\'abord !';
    }
  }

  lancerOperationRisquee(): void {
    if (this.useFinally()) {
      this.isLoadingFlag.set(false);
      this.isResourceLocked.set(false);
      this.cleanupComment.set('✅ Succès de la résilience : la panne est survenue mais le bloc finally a libéré le fichier et réinitialisé le loader !');
    } else {
      this.isLoadingFlag.set(true);
      this.isResourceLocked.set(true);
      this.cleanupComment.set('💥 CATASTROPHE : Le crash a court-circuité la ligne de fermeture située après le try ! Le loader tourne à l\'infini et le fichier est verrouillé.');
    }
  }
}
