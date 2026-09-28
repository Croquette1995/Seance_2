import { Component, signal } from '@angular/core';
import { LabRunnerComponent } from '../../shared/components/lab-runner/lab-runner.component';

@Component({
  selector: 'app-abstract-class-anatomy',
  standalone: true,
  imports: [LabRunnerComponent],
  template: `
    <div class="module-container">
      <header class="module-header">
        <div class="module-tag">Module 02 · Anatomie &amp; Règles Strictes</div>
        <h2>L'Anatomie d'une Classe Abstraite (abstract class)</h2>
        <p class="module-desc">
          Une classe abstraite est une entité hybride unique en POO : elle a le pouvoir de factoriser du code réel (DRY)
          tout en imposant des obligations contractuelles strictes sans implémentation.
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
        <!-- 1. Inspecteur de structure (Les 3 Piliers) -->
        <section class="card-panel interactive-section">
          <div class="section-title-row">
            <div class="icon-circle pillars-icon">🏛️</div>
            <div>
              <h3>1. L'Inspecteur de Structure : Les 3 Piliers d'une Classe Abstraite</h3>
              <p class="section-subtitle">Cliquez sur chaque pilier pour mettre en surbrillance sa responsabilité dans le code.</p>
            </div>
          </div>

          <div class="pillars-selector">
            <button class="pillar-tab" [class.active]="selectedPillar() === 1" (click)="selectedPillar.set(1)">
              <span class="p-num">1</span>
              <span>Constructeur &amp; Factorisation d'État (super)</span>
            </button>
            <button class="pillar-tab" [class.active]="selectedPillar() === 2" (click)="selectedPillar.set(2)">
              <span class="p-num">2</span>
              <span>Méthodes Concrètes Partagées (Code DRY)</span>
            </button>
            <button class="pillar-tab" [class.active]="selectedPillar() === 3" (click)="selectedPillar.set(3)">
              <span class="p-num">3</span>
              <span>Méthodes Abstraites (Promesses Contractuelles)</span>
            </button>
          </div>

          <div class="grid-2-cols mt-2">
            <div class="code-preview-box">
              <div class="code-header">
                <span>animal-hierarchie.ts</span>
                <span class="badge badge-ts">Pilier {{ selectedPillar() }} actif</span>
              </div>
              <pre><code><span [class.code-highlight]="selectedPillar() === 1">abstract class Animal &#123;
  // 🏛️ PILIER 1 : Constructeur factorisant l'état commun
  constructor(public nom: string, public age: number) &#123;&#125;</span>

<span [class.code-highlight]="selectedPillar() === 2">  // 🏛️ PILIER 2 : Méthode concrète (100% mutualisée, 0 duplication)
  dormir(): void &#123;
    console.log(this.nom + " s'endort paisiblement...");
  &#125;</span>

<span [class.code-highlight]="selectedPillar() === 3">  // 🏛️ PILIER 3 : Obligation contractuelle sans aucun corps
  abstract crier(): string;
&#125;</span>

class Chien extends Animal &#123;
  constructor(nom: string, age: number, public race: string) &#123;
    super(nom, age); // Délègue au constructeur abstrait
  &#125;
  crier(): string &#123; return "Ouaf ouaf !"; &#125;
&#125;</code></pre>
            </div>

            <div class="pillar-explanation-card">
              @switch (selectedPillar()) {
                @case (1) {
                  <div class="p-card-content">
                    <div class="badge badge-ts">PILIER 1 : Constructeur &amp; État Partagé</div>
                    <h4>Le constructeur sans <code>new</code></h4>
                    <p>
                      Même si <code>new Animal()</code> est interdit, la classe possède un <strong>constructeur réel</strong>.
                      Lorsqu'une sous-classe concrète (ex: <code>Chien</code>) est instanciée avec <code>new Chien("Rex", 3, "Labrador")</code>,
                      l'instruction <code>super(nom, age)</code> invoque le constructeur de la classe abstraite pour initialiser les propriétés partagées.
                    </p>
                    <div class="tip-box">
                      💡 <strong>Règle d'or :</strong> Ne dupliquez jamais les propriétés d'état dans chaque sous-classe. Centralisez-les dans le constructeur abstrait.
                    </div>
                  </div>
                }
                @case (2) {
                  <div class="p-card-content">
                    <div class="badge badge-success">PILIER 2 : Méthodes Concrètes Partagées</div>
                    <h4>Le principe DRY (Don't Repeat Yourself)</h4>
                    <p>
                      Tous les animaux dorment de la même manière. Il serait absurde de recoder la méthode <code>dormir()</code>
                      dans <code>Chien</code>, <code>Chat</code>, <code>Oiseau</code>.
                      La classe abstraite fournit l'implémentation par défaut que toutes les sous-classes héritent gratuitement.
                    </p>
                    <div class="tip-box">
                      💡 <strong>Règle d'or :</strong> Une classe abstraite peut contenir 90% de méthodes concrètes et seulement 1 méthode abstraite !
                    </div>
                  </div>
                }
                @case (3) {
                  <div class="p-card-content">
                    <div class="badge badge-purple">PILIER 3 : Méthodes Abstraites Pures</div>
                    <h4>Le verrou contractuel</h4>
                    <p>
                      Comment crie un « Animal » en général ? C'est impossible à définir !
                      En déclarant <code>abstract crier(): string;</code>, vous déléguez l'obligation stricte à chaque classe enfant.
                      Le compilateur empêche toute instanciation tant que cette méthode n'est pas concrétisée.
                    </p>
                    <div class="tip-box">
                      💡 <strong>Règle d'or :</strong> Aucune accolade <code>&#123;&#125;</code> après la signature abstraite, juste un point-virgule <code>;</code>.
                    </div>
                  </div>
                }
              }
            </div>
          </div>
        </section>

        <!-- 2. Laboratoire des Modificateurs d'accès -->
        <section class="card-panel interactive-section">
          <div class="section-title-row">
            <div class="icon-circle lock-icon">🔒</div>
            <div>
              <h3>2. Laboratoire des Modificateurs d'Accès : Le Paradoxe de <code>private abstract</code></h3>
              <p class="section-subtitle">Comprendre la matrice de visibilité et l'impossibilité logique de masquer une obligation.</p>
            </div>
          </div>

          <div class="modifiers-grid">
            <div class="matrix-card">
              <h4>Matrice des Visibilités Abstraites</h4>
              <table class="matrix-table">
                <thead>
                  <tr>
                    <th>Modificateur</th>
                    <th>Sous-classes</th>
                    <th>Extérieur</th>
                    <th>Validité TypeScript</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="valid-row">
                    <td><code>public abstract</code></td>
                    <td>✔ Accès direct</td>
                    <td>✔ API publique</td>
                    <td><span class="badge badge-success">Valide (Défaut)</span></td>
                  </tr>
                  <tr class="valid-row">
                    <td><code>protected abstract</code></td>
                    <td>✔ Redéfinition</td>
                    <td>✖ Interdit</td>
                    <td><span class="badge badge-ts">Valide (Template Method)</span></td>
                  </tr>
                  <tr class="invalid-row">
                    <td><code>private abstract</code></td>
                    <td>✖ Invisibilité</td>
                    <td>✖ Interdit</td>
                    <td><span class="badge badge-red">INTERDIT (TS18010)</span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="paradox-card">
              <div class="paradox-header">
                <span>Démonstrateur de Paradoxe Logique</span>
                <button class="btn-ghost" (click)="triggerParadoxAnimation()">
                  💥 Tester <code>private abstract</code>
                </button>
              </div>

              @if (showParadox()) {
                <div class="paradox-alert animate-shake">
                  <div class="error-badge">🔴 ERREUR COMPILATEUR TS18010</div>
                  <div class="error-text">'abstract' modifier cannot be used in conjunction with 'private'.</div>
                  <div class="paradox-schema">
                    <div class="paradox-col">
                      <span class="p-tag red">Mot-clé private :</span>
                      <span>« Personne en dehors de cette classe ne peut voir ni toucher cette méthode. »</span>
                    </div>
                    <div class="vs-badge">VS</div>
                    <div class="paradox-col">
                      <span class="p-tag blue">Mot-clé abstract :</span>
                      <span>« Les classes enfants sont FORCÉES de voir et réécrire cette méthode. »</span>
                    </div>
                  </div>
                  <p class="paradox-conclusion">
                    👉 C'est une contradiction sémantique totale : on ne peut pas exiger de redéfinir quelque chose qu'on interdit de voir !
                  </p>
                </div>
              } @else {
                <div class="paradox-idle">
                  <p>Cliquez sur le bouton ci-dessus pour observer pourquoi TypeScript rejette catégoriquement cette syntaxe.</p>
                </div>
              }
            </div>
          </div>
        </section>

        <!-- 3. Explorateur d'Abstractions en Cascade -->
        <section class="card-panel interactive-section">
          <div class="section-title-row">
            <div class="icon-circle tree-icon">🌲</div>
            <div>
              <h3>3. Explorateur d'Abstractions en Cascade (Accumulation des Dettes Contractuelles)</h3>
              <p class="section-subtitle">Visualisez comment une classe abstraite intermédiaire enrichit le contrat sans être obligée de le solder.</p>
            </div>
          </div>

          <div class="stepper-controls mb-2">
            <button class="btn-choice" [class.active]="cascadeLevel() === 1" (click)="cascadeLevel.set(1)">
              Niveau 1 : Animal (Abstrait Racine)
            </button>
            <button class="btn-choice" [class.active]="cascadeLevel() === 2" (click)="cascadeLevel.set(2)">
              Niveau 2 : Mammifere (Abstrait Intermédiaire)
            </button>
            <button class="btn-choice" [class.active]="cascadeLevel() === 3" (click)="cascadeLevel.set(3)">
              Niveau 3 : Vache (Feuille Concrète)
            </button>
          </div>

          <div class="cascade-tree-view">
            <!-- Niveau 1 -->
            <div class="tree-tier tier-1" [class.active]="cascadeLevel() >= 1">
              <div class="tier-header">
                <span class="tier-tag">Niveau 1 · Racine</span>
                <strong>abstract class Animal</strong>
              </div>
              <div class="tier-body">
                <div class="prop-item">Propriété : <code>nom: string</code></div>
                <div class="obligation-item pending">
                  <span class="dot-red"></span>
                  <code>abstract crier(): string;</code> (Dette ouverte)
                </div>
              </div>
            </div>

            <div class="tree-connector">↓ extends</div>

            <!-- Niveau 2 -->
            <div class="tree-tier tier-2" [class.active]="cascadeLevel() >= 2">
              <div class="tier-header">
                <span class="tier-tag">Niveau 2 · Intermédiaire</span>
                <strong>abstract class Mammifere extends Animal</strong>
              </div>
              <div class="tier-body">
                <div class="prop-item">Ajout : <code>capaciteLait: number</code></div>
                <div class="obligation-item pending">
                  <span class="dot-red"></span>
                  <code>crier(): string</code> (Toujours non soldée !)
                </div>
                <div class="obligation-item pending">
                  <span class="dot-red"></span>
                  <code>abstract allaiter(): void;</code> (Nouvelle dette ajoutée)
                </div>
              </div>
            </div>

            <div class="tree-connector">↓ extends</div>

            <!-- Niveau 3 -->
            <div class="tree-tier tier-3" [class.active]="cascadeLevel() >= 3">
              <div class="tier-header">
                <span class="tier-tag">Niveau 3 · Feuille Concrète</span>
                <strong>class Vache extends Mammifere</strong>
              </div>
              <div class="tier-body">
                <div class="obligation-item resolved">
                  <span class="dot-green"></span>
                  <code>crier() &#123; return "Meuh !"; &#125;</code> (Soldé !)
                </div>
                <div class="obligation-item resolved">
                  <span class="dot-green"></span>
                  <code>allaiter() &#123; ... &#125;</code> (Soldé !)
                </div>
                <div class="tier-success-badge">
                  ✔ 100% des obligations soldées · <code>new Vache()</code> AUTORISÉ !
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Callout labo -->
        <div class="callout-footer card-panel">
          <div class="callout-text">
            <h4>Mettez en pratique les 3 Piliers et les abstractions en cascade</h4>
            <p>Dans le Labo 1, vous construirez vous-même la chaîne Vehicule -&gt; VehiculeElectrique -&gt; Tesla.</p>
          </div>
          <button class="btn-primary" (click)="activeView.set('lab')">
            Ouvrir le Labo 1 dans Monaco →
          </button>
        </div>
      } @else {
        <app-lab-runner [labFilter]="1"></app-lab-runner>
      }
    </div>
  `,
  styles: [`
    .mt-2 { margin-top: 8px; }
    .mb-2 { margin-bottom: 8px; }
    .interactive-section {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .section-title-row {
      display: flex;
      align-items: center;
      gap: 14px;

      h3 { font-size: 1.15rem; font-weight: 700; color: var(--text-main); }
      .section-subtitle { font-size: 0.82rem; color: var(--text-muted); }
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

      &.pillars-icon { background: rgba(59, 130, 246, 0.15); }
      &.lock-icon { background: rgba(239, 68, 68, 0.15); }
      &.tree-icon { background: rgba(16, 185, 129, 0.15); }
    }

    .pillars-selector {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
    }

    .pillar-tab {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      color: var(--text-muted);
      font-size: 0.82rem;
      font-weight: 600;
      text-align: left;

      .p-num {
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: var(--font-mono);
      }

      &.active {
        background: var(--ts-blue-bg);
        border-color: var(--ts-blue);
        color: var(--ts-blue-light);

        .p-num {
          background: var(--ts-blue);
          color: #ffffff;
        }
      }
    }

    .grid-2-cols {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
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
        font-size: 0.78rem;
        line-height: 1.45;
        color: #e2e8f0;
      }
    }

    .code-highlight {
      background: rgba(59, 130, 246, 0.22);
      border-left: 3px solid #3b82f6;
      display: inline-block;
      width: 100%;
      padding: 2px 4px;
    }

    .pillar-explanation-card {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 18px;
      display: flex;
      flex-direction: column;
      justify-content: center;

      .p-card-content {
        display: flex;
        flex-direction: column;
        gap: 10px;

        h4 { font-size: 1.05rem; color: var(--text-main); font-weight: 700; }
        p { font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; }
      }
    }

    .tip-box {
      background: rgba(49, 120, 198, 0.1);
      border: 1px solid rgba(49, 120, 198, 0.3);
      padding: 10px 12px;
      border-radius: 6px;
      font-size: 0.8rem;
      color: #bfdbfe;
    }

    .modifiers-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .matrix-card {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;

      h4 { font-size: 0.95rem; margin-bottom: 12px; }
    }

    .matrix-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.78rem;

      th {
        text-align: left;
        padding: 8px;
        color: var(--text-dim);
        border-bottom: 1px solid var(--border-color);
      }

      td {
        padding: 8px;
        border-bottom: 1px solid var(--border-subtle);
      }

      .invalid-row td {
        background: rgba(239, 68, 68, 0.05);
      }
    }

    .paradox-card {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;

      .paradox-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 0.85rem;
        font-weight: 700;
      }
    }

    .paradox-alert {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.4);
      border-radius: 8px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 10px;

      .error-badge {
        font-size: 0.7rem;
        font-weight: 800;
        background: #ef4444;
        color: white;
        padding: 2px 6px;
        border-radius: 4px;
        width: fit-content;
      }

      .error-text {
        font-family: var(--font-mono);
        color: #fca5a5;
        font-size: 0.82rem;
        font-weight: 700;
      }
    }

    .paradox-schema {
      display: flex;
      align-items: center;
      gap: 10px;
      background: var(--bg-card);
      padding: 10px;
      border-radius: 6px;
      font-size: 0.76rem;

      .paradox-col {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .p-tag {
        font-weight: 700;
        font-family: var(--font-mono);

        &.red { color: #f87171; }
        &.blue { color: #60a5fa; }
      }

      .vs-badge {
        font-weight: 800;
        color: var(--text-dim);
      }
    }

    .paradox-conclusion {
      font-size: 0.8rem;
      color: #fecdd3;
      line-height: 1.4;
    }

    .paradox-idle {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
      color: var(--text-dim);
      font-size: 0.82rem;
      text-align: center;
    }

    .stepper-controls {
      display: flex;
      gap: 10px;

      .btn-choice {
        padding: 6px 14px;
        background: var(--bg-subtle);
        border: 1px solid var(--border-color);
        color: var(--text-muted);
        border-radius: 6px;
        font-size: 0.8rem;
        font-weight: 600;

        &.active {
          background: var(--ts-blue);
          color: white;
          border-color: var(--ts-blue);
        }
      }
    }

    .cascade-tree-view {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      background: var(--bg-subtle);
      padding: 20px;
      border-radius: 8px;
      border: 1px solid var(--border-color);
    }

    .tree-tier {
      width: 100%;
      max-width: 550px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 12px 16px;
      opacity: 0.45;
      transition: all 0.25s;

      &.active {
        opacity: 1;
        border-color: var(--ts-blue);
        box-shadow: 0 2px 12px rgba(49, 120, 198, 0.2);
      }

      .tier-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 6px;

        .tier-tag {
          font-size: 0.68rem;
          color: var(--ts-blue-light);
          font-weight: 700;
        }

        strong { font-family: var(--font-mono); font-size: 0.88rem; }
      }

      .tier-body {
        display: flex;
        flex-direction: column;
        gap: 4px;
        font-size: 0.78rem;
        font-family: var(--font-mono);
      }
    }

    .tree-connector {
      font-family: var(--font-mono);
      font-size: 0.78rem;
      color: var(--text-dim);
      font-weight: 700;
    }

    .obligation-item {
      display: flex;
      align-items: center;
      gap: 8px;

      .dot-red {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #ef4444;
      }

      .dot-green {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #10b981;
      }

      &.resolved code {
        color: #34d399;
      }
    }

    .tier-success-badge {
      margin-top: 6px;
      padding: 4px 8px;
      border-radius: 4px;
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
      font-size: 0.74rem;
      font-weight: 700;
      text-align: center;
    }

    .callout-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      padding: 18px 24px;
      background: linear-gradient(135deg, rgba(49, 120, 198, 0.12), rgba(30, 41, 59, 0.5));
      border-color: rgba(49, 120, 198, 0.3);

      h4 { font-size: 1rem; color: var(--text-main); }
      p { font-size: 0.84rem; color: var(--text-muted); }
    }
  `]
})
export class AbstractClassAnatomyComponent {
  readonly activeView = signal<'theory' | 'lab'>('theory');
  readonly selectedPillar = signal<number>(1);
  readonly showParadox = signal<boolean>(false);
  readonly cascadeLevel = signal<number>(3);

  triggerParadoxAnimation(): void {
    this.showParadox.set(true);
  }
}
