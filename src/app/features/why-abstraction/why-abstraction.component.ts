import { Component, signal, inject } from '@angular/core';
import { NavigationService } from '../../core/services/navigation.service';
import { LabRunnerComponent } from '../../shared/components/lab-runner/lab-runner.component';

@Component({
  selector: 'app-why-abstraction',
  standalone: true,
  imports: [LabRunnerComponent],
  template: `
    <div class="module-container">
      <!-- En-tête du module -->
      <header class="module-header">
        <div class="module-tag">Module 01 · Fondations Conceptuelles</div>
        <h2>Pourquoi l'Abstraction ? (Fin des objets fantômes et du code bouchon)</h2>
        <p class="module-desc">
          En programmation orientée objet, certaines classes décrivent des concepts purs qui n'ont aucun sens à être instanciés tels quels.
          Découvrez pourquoi le compilateur TypeScript doit interdire <code>new</code> sur ces classes et comment déléguer rigoureusement les signatures aux sous-classes.
        </p>

        <div class="section-mode-tabs mt-2">
          <button class="mode-tab-btn" [class.active]="activeView() === 'theory'" (click)="activeView.set('theory')">
            <span>🔬 Théorie &amp; Simulateurs Interactifs</span>
          </button>
          <button class="mode-tab-btn" [class.active]="activeView() === 'lab'" (click)="activeView.set('lab')">
            <span>💻 Labo Pratique Monaco (Labo 1)</span>
          </button>
        </div>
      </header>

      @if (activeView() === 'theory') {
        <!-- 1. Simulateur d'objets fantômes -->
        <section class="card-panel interactive-section">
          <div class="section-title-row">
            <div class="icon-circle ghost-icon">👻</div>
            <div>
              <h3>1. Le Simulateur d'Objets Fantômes (Fin du <code>new Forme()</code>)</h3>
              <p class="section-subtitle">Observez l'aberration de créer une Forme générique sans dimensions et comment <code>abstract</code> protège la mémoire.</p>
            </div>
          </div>

          <div class="grid-2-cols">
            <div class="controls-col">
              <div class="toggle-control-box">
                <span class="ctrl-label">Statut de la classe Forme :</span>
                <div class="btn-group">
                  <button class="btn-choice" [class.active]="!isAbstractMode()" (click)="isAbstractMode.set(false)">
                    Classe Concrète classique
                  </button>
                  <button class="btn-choice" [class.active]="isAbstractMode()" (click)="isAbstractMode.set(true)">
                    Classe Abstraite (abstract)
                  </button>
                </div>
              </div>

              <div class="code-preview-box">
                <div class="code-header">
                  <span>forme.ts</span>
                  <span class="badge" [class.badge-warning]="!isAbstractMode()" [class.badge-success]="isAbstractMode()">
                    {{ isAbstractMode() ? 'abstract class Forme' : 'class Forme' }}
                  </span>
                </div>
                <pre><code>{{ isAbstractMode() ? abstractClassCode : concreteClassCode }}</code></pre>
              </div>

              <button class="btn-primary w-full" (click)="instantiateShape()">
                ⚙️ Exécuter : <code>const f = new Forme("Gris");</code>
              </button>
            </div>

            <div class="simulator-col">
              <div class="memory-arena-box" [class.blocked]="isBlocked()">
                <div class="arena-header">
                  <span>État du Tas (Heap Memory)</span>
                  <span class="badge" [class.badge-red]="isBlocked()" [class.badge-purple]="!isBlocked() && ghostCreated()">
                    {{ isBlocked() ? 'Instanciation Bloquée' : (ghostCreated() ? 'Objet Fantôme Présent' : 'En attente') }}
                  </span>
                </div>

                <div class="arena-content">
                  @if (isBlocked()) {
                    <div class="error-ts-shield">
                      <div class="shield-badge">🔴 TS2511 COMPILER SHIELD</div>
                      <div class="shield-code">Cannot create an instance of an abstract class.</div>
                      <p class="shield-desc">
                        Le compilateur TypeScript a intercepté l'aberration avant l'exécution.
                        Aucun octet n'est alloué dans le tas. L'intégrité du domaine métier est préservée !
                      </p>
                    </div>
                  } @else if (ghostCreated()) {
                    <div class="ghost-shape-box animate-pulse-gentle">
                      <div class="ghost-visual">
                        <svg width="80" height="80" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-dasharray="4,4">
                          <polygon points="50,10 90,90 10,90" stroke="#f43f5e" stroke-width="3"></polygon>
                          <circle cx="50" cy="50" r="30" stroke="#fbbf24" stroke-width="2"></circle>
                        </svg>
                      </div>
                      <div class="ghost-info">
                        <div class="ghost-badge">⚠️ OBJET FANTÔME DÉTECTÉ</div>
                        <div class="ghost-meta">Adresse : <code>0x7FA30</code> · Type : <code>Forme</code></div>
                        <div class="ghost-meta">Surface : <code>NaN</code> · Périmètre : <code>0</code></div>
                        <p class="ghost-warning">
                          Qu'est-ce qu'une « Forme » sans sommets ni rayon ?
                          Si un développeur appelle <code>f.calculerAire()</code>, le système plante ou produit un bug silencieux !
                        </p>
                      </div>
                    </div>
                  } @else {
                    <div class="idle-state">
                      <span>Cliquez sur « Exécuter » pour simuler l'instanciation de la classe.</span>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 2. Comparateur Code Bouchon vs Signature Pure -->
        <section class="card-panel interactive-section">
          <div class="section-title-row">
            <div class="icon-circle compare-icon">⚖️</div>
            <div>
              <h3>2. Comparateur : « Code Bouchon » (Dette Technique) vs « Signature Pure » (Rigueur OO)</h3>
              <p class="section-subtitle">Pourquoi renvoyer <code>return 0;</code> ou lever une exception tardive au runtime est une faute de conception.</p>
            </div>
          </div>

          <div class="grid-2-cols">
            <!-- Mauvaise pratique -->
            <div class="contrast-card bad">
              <div class="card-badge-bad">❌ ANTI-PATTERN : Code Bouchon</div>
              <h4>La méthode mère leurre</h4>
              <pre><code>class Forme &#123;
  calculerAire(): number &#123;
    return 0; // 💣 Bouchon sournois !
    // Ou pire : throw new Error("TODO");
  &#125;
&#125;

class Cercle extends Forme &#123;
  // Oups ! Le dev junior a oublié
  // de redéfinir calculerAire() !
&#125;</code></pre>
              <div class="consequence-box bad">
                <strong>Conséquence désastreuse :</strong>
                <span>Le code compile sans broncher ! L'erreur survient en pleine production lors de la facturation ou de l'affichage.</span>
              </div>
              <button class="btn-secondary w-full mt-2" (click)="testStubCode()">
                Simuler le bogue silencieux
              </button>
              @if (stubResult()) {
                <div class="stub-log-output">
                  <code>Résultat : {{ stubResult() }}</code>
                </div>
              }
            </div>

            <!-- Bonne pratique -->
            <div class="contrast-card good">
              <div class="card-badge-good">✔ PATTERN PRO : Signature Pure</div>
              <h4>Le contrat strict par abstract</h4>
              <pre><code>abstract class Forme &#123;
  // Signature pure sans aucun corps &#123;&#125; :
  abstract calculerAire(): number;
&#125;

class Cercle extends Forme &#123;
  // 🔴 ERREUR DE COMPILATION IMMÉDIATE (TS2515)
  // Tant que calculerAire() n'est pas codée !
&#125;</code></pre>
              <div class="consequence-box good">
                <strong>Garantie absolue :</strong>
                <span>Zéro code mort. Zéro oubli possible. Si le développeur oublie la méthode, le projet refuse de compiler dès la frappe.</span>
              </div>
              <button class="btn-primary w-full mt-2" (click)="testPureSignature()">
                Tester la protection compilateur
              </button>
              @if (pureSignatureResult()) {
                <div class="pure-log-output">
                  <code>{{ pureSignatureResult() }}</code>
                </div>
              }
            </div>
          </div>
        </section>

        <!-- 3. Visualiseur du problème du diamant -->
        <section class="card-panel interactive-section">
          <div class="section-title-row">
            <div class="icon-circle diamond-icon">💎</div>
            <div>
              <h3>3. Pourquoi l'Héritage Multiple de Classes est Bloqué (Le Problème du Diamant)</h3>
              <p class="section-subtitle">Visualisez pourquoi TypeScript interdit <code>class D extends B, C</code> et pourquoi l'interface résout le problème sans collision.</p>
            </div>
          </div>

          <div class="diamond-interactive-layout">
            <div class="diamond-diagram">
              <div class="diamond-node root-node">
                <span class="node-tag">Classe Mère</span>
                <strong>Appareil</strong>
                <code>tension: number</code>
                <code>demarrer() &#123; ... &#125;</code>
              </div>

              <div class="diamond-mid-row">
                <div class="diamond-node left-node" [class.highlight]="diamondStep() >= 1">
                  <span class="node-tag">extends Appareil</span>
                  <strong>Scanner</strong>
                  <code>demarrer() &#123; initLaser(); &#125;</code>
                </div>
                <div class="diamond-node right-node" [class.highlight]="diamondStep() >= 1">
                  <span class="node-tag">extends Appareil</span>
                  <strong>Imprimante</strong>
                  <code>demarrer() &#123; chaufferEncre(); &#125;</code>
                </div>
              </div>

              <div class="diamond-node bottom-node" [class.conflict]="diamondStep() >= 2">
                <span class="node-tag">Hypothétique : extends Scanner, Imprimante</span>
                <strong>Photocopieuse</strong>
                @if (diamondStep() < 2) {
                  <code>Quel demarrer() hériter ?</code>
                } @else {
                  <span class="conflict-badge">💥 COLLISION D'ÉTAT ET DE CODE !</span>
                }
              </div>
            </div>

            <div class="diamond-explainer-box">
              <h4>L'Impasse de l'Héritage Multiple d'Implémentations</h4>
              <p>
                Si <code>Photocopieuse</code> pouvait étendre à la fois <code>Scanner</code> et <code>Imprimante</code>, laquelle des deux méthodes <code>demarrer()</code> le compilateur devrait-il choisir lors de <code>copieuse.demarrer()</code> ?
                Et combien de copies de la propriété <code>tension</code> la mémoire contiendrait-elle ?
              </p>

              <div class="solution-switch-box">
                <div class="sol-title">💡 La Solution Universelle en TypeScript :</div>
                <p>
                  <strong>Héritage simple de classe</strong> (au maximum 1 <code>extends</code>) pour la factorisation de code, combiné à la <strong>multi-implémentation d'interfaces</strong> (<code>implements Scannable, Imprimable</code>) car les interfaces ne transportent aucun corps de méthode conflictuel.
                </p>
              </div>

              <div class="mt-3 flex gap-2">
                <button class="btn-secondary" (click)="advanceDiamondStep()">
                  {{ diamondStep() === 0 ? '▶ Étape 1 : Spécialisation' : (diamondStep() === 1 ? '▶ Étape 2 : Conflit en D' : '↺ Réinitialiser') }}
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Passer au labo -->
        <div class="callout-footer card-panel">
          <div class="callout-text">
            <h4>Prêt à mettre ces concepts en pratique dans Monaco Editor ?</h4>
            <p>Le Labo 1 contient 5 exercices progressifs sur les classes abstraites, l'interdiction de new et les signatures pures.</p>
          </div>
          <button class="btn-primary" (click)="activeView.set('lab')">
            Accéder aux 5 Exercices du Labo 1 →
          </button>
        </div>
      } @else {
        <!-- Vue Labo Monaco filtrée sur le Labo 1 -->
        <app-lab-runner [labFilter]="1"></app-lab-runner>
      }
    </div>
  `,
  styles: [`
    .mt-2 { margin-top: 8px; }
    .mt-3 { margin-top: 12px; }
    .w-full { width: 100%; }

    .interactive-section {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .section-title-row {
      display: flex;
      align-items: center;
      gap: 14px;

      h3 {
        font-size: 1.15rem;
        font-weight: 700;
        color: var(--text-main);
      }
      .section-subtitle {
        font-size: 0.82rem;
        color: var(--text-muted);
      }
    }

    .icon-circle {
      width: 42px;
      height: 42px;
      min-width: 42px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;

      &.ghost-icon { background: rgba(244, 63, 94, 0.15); }
      &.compare-icon { background: rgba(59, 130, 246, 0.15); }
      &.diamond-icon { background: rgba(147, 51, 234, 0.15); }
    }

    .grid-2-cols {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .controls-col {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .toggle-control-box {
      display: flex;
      flex-direction: column;
      gap: 6px;

      .ctrl-label {
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--text-dim);
      }
    }

    .btn-group {
      display: flex;
      gap: 8px;
      background: var(--bg-subtle);
      padding: 4px;
      border-radius: 8px;

      .btn-choice {
        flex: 1;
        padding: 6px 12px;
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--text-muted);
        border-radius: 6px;

        &.active {
          background: var(--ts-blue);
          color: #ffffff;
        }
      }
    }

    .code-preview-box {
      background: var(--bg-code);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      overflow: hidden;

      .code-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 6px 12px;
        background: var(--terminal-header);
        border-bottom: 1px solid var(--border-color);
        font-family: var(--font-mono);
        font-size: 0.76rem;
        color: var(--text-dim);
      }

      pre {
        padding: 12px;
        font-family: var(--font-mono);
        font-size: 0.8rem;
        line-height: 1.45;
        color: #e2e8f0;
        overflow-x: auto;
      }
    }

    .memory-arena-box {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      height: 100%;
      min-height: 240px;
      display: flex;
      flex-direction: column;
      overflow: hidden;

      &.blocked {
        border-color: rgba(239, 68, 68, 0.4);
      }

      .arena-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 14px;
        background: var(--bg-card);
        border-bottom: 1px solid var(--border-color);
        font-size: 0.8rem;
        font-weight: 600;
      }

      .arena-content {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
      }
    }

    .error-ts-shield {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.35);
      border-radius: 8px;
      padding: 16px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;

      .shield-badge {
        font-size: 0.72rem;
        font-weight: 800;
        background: #ef4444;
        color: #ffffff;
        padding: 2px 8px;
        border-radius: 4px;
        letter-spacing: 0.05em;
      }

      .shield-code {
        font-family: var(--font-mono);
        font-weight: 700;
        color: #fca5a5;
        font-size: 0.85rem;
      }

      .shield-desc {
        font-size: 0.78rem;
        color: var(--text-muted);
        line-height: 1.4;
      }
    }

    .ghost-shape-box {
      display: flex;
      align-items: center;
      gap: 16px;
      background: rgba(244, 63, 94, 0.08);
      border: 1px dashed rgba(244, 63, 94, 0.35);
      border-radius: 8px;
      padding: 16px;

      .ghost-badge {
        font-size: 0.72rem;
        font-weight: 800;
        color: #f43f5e;
      }

      .ghost-meta {
        font-size: 0.78rem;
        color: var(--text-muted);
        font-family: var(--font-mono);
      }

      .ghost-warning {
        font-size: 0.76rem;
        color: #fb7185;
        margin-top: 4px;
        line-height: 1.35;
      }
    }

    .idle-state {
      color: var(--text-dim);
      font-size: 0.82rem;
      text-align: center;
    }

    .contrast-card {
      background: var(--bg-subtle);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;

      &.bad {
        border: 1px solid rgba(239, 68, 68, 0.3);
      }
      &.good {
        border: 1px solid rgba(16, 185, 129, 0.3);
      }

      .card-badge-bad {
        font-size: 0.72rem;
        font-weight: 800;
        color: #f87171;
      }

      .card-badge-good {
        font-size: 0.72rem;
        font-weight: 800;
        color: #34d399;
      }

      h4 {
        font-size: 0.95rem;
        font-weight: 700;
      }

      pre {
        background: var(--bg-code);
        padding: 10px;
        border-radius: 6px;
        font-family: var(--font-mono);
        font-size: 0.78rem;
        color: #e2e8f0;
      }

      .consequence-box {
        font-size: 0.8rem;
        line-height: 1.4;
        padding: 8px 10px;
        border-radius: 6px;

        &.bad {
          background: rgba(239, 68, 68, 0.1);
          color: #fca5a5;
        }
        &.good {
          background: rgba(16, 185, 129, 0.1);
          color: #a7f3d0;
        }
      }
    }

    .stub-log-output, .pure-log-output {
      padding: 8px 12px;
      border-radius: 6px;
      font-family: var(--font-mono);
      font-size: 0.78rem;
    }

    .stub-log-output {
      background: rgba(245, 158, 11, 0.15);
      color: #fbbf24;
      border: 1px solid rgba(245, 158, 11, 0.3);
    }

    .pure-log-output {
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }

    .diamond-interactive-layout {
      display: grid;
      grid-template-columns: 360px 1fr;
      gap: 24px;
      align-items: center;
    }

    .diamond-diagram {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background: var(--bg-subtle);
      border-radius: 8px;
      border: 1px solid var(--border-color);
    }

    .diamond-node {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 8px 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      width: 140px;
      font-size: 0.78rem;
      text-align: center;
      transition: all 0.2s;

      .node-tag {
        font-size: 0.65rem;
        color: var(--ts-blue-light);
        font-weight: 700;
      }

      &.highlight {
        border-color: #a855f7;
        box-shadow: 0 0 10px rgba(168, 85, 247, 0.3);
      }

      &.conflict {
        border-color: #ef4444;
        background: rgba(239, 68, 68, 0.1);
        width: 220px;
      }

      .conflict-badge {
        font-size: 0.7rem;
        font-weight: 800;
        color: #f87171;
      }
    }

    .diamond-mid-row {
      display: flex;
      justify-content: space-between;
      width: 100%;
      padding: 0 20px;
    }

    .diamond-explainer-box {
      display: flex;
      flex-direction: column;
      gap: 12px;
      font-size: 0.88rem;
      line-height: 1.5;

      h4 {
        font-size: 1.05rem;
        color: var(--text-main);
      }

      p {
        color: var(--text-muted);
      }
    }

    .solution-switch-box {
      background: rgba(59, 130, 246, 0.1);
      border: 1px solid rgba(59, 130, 246, 0.3);
      border-radius: 8px;
      padding: 12px 14px;
      font-size: 0.82rem;

      .sol-title {
        font-weight: 700;
        color: var(--ts-blue-light);
        margin-bottom: 4px;
      }

      p {
        color: #dbeafe;
      }
    }

    .callout-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      padding: 18px 24px;
      background: linear-gradient(135deg, rgba(49, 120, 198, 0.12), rgba(30, 41, 59, 0.5));
      border-color: rgba(49, 120, 198, 0.3);

      h4 {
        font-size: 1rem;
        color: var(--text-main);
      }

      p {
        font-size: 0.84rem;
        color: var(--text-muted);
      }
    }
  `]
})
export class WhyAbstractionComponent {
  readonly activeView = signal<'theory' | 'lab'>('theory');
  readonly isAbstractMode = signal<boolean>(true);
  readonly ghostCreated = signal<boolean>(false);
  readonly isBlocked = signal<boolean>(false);

  readonly stubResult = signal<string | null>(null);
  readonly pureSignatureResult = signal<string | null>(null);
  readonly diamondStep = signal<number>(0);

  readonly concreteClassCode = `class Forme {
  constructor(public couleur: string) {}
  calculerAire(): number {
    return 0; // Mauvaise pratique !
  }
}

// L'instanciation est hélas permise :
const f = new Forme("Gris");`;

  readonly abstractClassCode = `abstract class Forme {
  constructor(public couleur: string) {}
  abstract calculerAire(): number;
}

// Rejeté par tsc : TS2511
const f = new Forme("Gris");`;

  instantiateShape(): void {
    if (this.isAbstractMode()) {
      this.isBlocked.set(true);
      this.ghostCreated.set(false);
    } else {
      this.isBlocked.set(false);
      this.ghostCreated.set(true);
    }
  }

  testStubCode(): void {
    this.stubResult.set("aire = 0 (Bogue silencieux ! Le cercle a calculé une surface de 0)");
  }

  testPureSignature(): void {
    this.pureSignatureResult.set("TS2515: Non-abstract class 'Cercle' does not implement inherited abstract member 'calculerAire'. Bloqué net à la compilation !");
  }

  advanceDiamondStep(): void {
    this.diamondStep.update(s => (s + 1) % 3);
  }
}
