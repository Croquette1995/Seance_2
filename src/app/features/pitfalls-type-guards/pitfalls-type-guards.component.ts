import { Component, signal } from '@angular/core';
import { LabRunnerComponent } from '../../shared/components/lab-runner/lab-runner.component';

@Component({
  selector: 'app-pitfalls-type-guards',
  standalone: true,
  imports: [LabRunnerComponent],
  template: `
    <div class="module-container">
      <header class="module-header">
        <div class="module-tag">Module 06 · Pièges &amp; Robustesse</div>
        <h2>Laboratoire des Pièges &amp; Anti-Patterns</h2>
        <p class="module-desc">
          Les interfaces sont puissantes, mais leur nature statique réserve des surprises aux développeurs habitués aux classes.
          Découvrez pourquoi <code>instanceof</code> échoue sur une interface, comment écrire un <em>User-Defined Type Guard</em>,
          et comment appliquer le principe ISP (Interface Segregation Principle).
        </p>

        <div class="section-mode-tabs mt-2">
          <button class="mode-tab-btn" [class.active]="activeView() === 'theory'" (click)="activeView.set('theory')">
            <span>🔬 Théorie &amp; Simulateurs Interactifs</span>
          </button>
          <button class="mode-tab-btn" [class.active]="activeView() === 'lab'" (click)="activeView.set('lab')">
            <span>💻 Labo Pratique Monaco (Labo 4)</span>
          </button>
        </div>
      </header>

      @if (activeView() === 'theory') {
        <!-- 1. Le Crash Test instanceof sur une Interface -->
        <section class="card-panel interactive-section">
          <div class="section-title-row">
            <div class="icon-circle crash-icon">💥</div>
            <div>
              <h3>1. Le Crash Test : <code>instanceof</code> sur une Interface (Erreur TS2693)</h3>
              <p class="section-subtitle">Pourquoi l'opérateur <code>instanceof</code> est voué à l'échec et comment le remplacer par un Type Guard.</p>
            </div>
          </div>

          <div class="crash-grid">
            <!-- Colonne Piège -->
            <div class="crash-card trap">
              <div class="card-tag red">❌ LE PIÈGE RÉCURRENT</div>
              <h4>Tenter instanceof sur un contrat pur</h4>
              <div class="code-box">
                <pre><code>interface Soigneur &#123;
  soigner(cible: Personnage): void;
&#125;

function guerir(perso: any) &#123;
  // 💣 ERREUR TS2693 DÈS LA FRAPPE !
  if (perso instanceof Soigneur) &#123;
    perso.soigner(...);
  &#125;
&#125;</code></pre>
              </div>

              <div class="ts-error-box">
                <div class="err-badge">TS2693 'Soigneur' only refers to a type, but is being used as a value here.</div>
                <p>
                  <strong>Pourquoi ?</strong> À l'exécution JavaScript, l'interface <code>Soigneur</code> n'existe plus (effacée à la compilation).
                  JavaScript ne peut pas tester le prototype d'un symbole inexistant !
                </p>
              </div>
            </div>

            <!-- Colonne Solution Type Guard -->
            <div class="crash-card fix">
              <div class="card-tag green">✔ LA SOLUTION PRO : User-Defined Type Guard</div>
              <h4>Le prédicat de type à la rescousse</h4>
              <div class="code-box">
                <pre><code>// 1. Fonction de garde avec prédicat de type :
function isSoigneur(cible: any): cible is Soigneur &#123;
  return cible &amp;&amp; typeof cible.soigner === "function";
&#125;

// 2. Utilisation sécurisée avec Narrowing automatique :
if (isSoigneur(perso)) &#123;
  // TypeScript SAIT que perso est un Soigneur ici !
  perso.soigner(cible); // Zéro cast 'as' nécessaire
&#125;</code></pre>
              </div>

              <div class="typeguard-tester-box">
                <div class="tg-title">Banc d'essai du Type Guard en direct :</div>
                <div class="hero-selector-btns">
                  <button class="btn-secondary" (click)="testObject('mage')">Tester Mage (avec soigner)</button>
                  <button class="btn-secondary" (click)="testObject('guerrier')">Tester Guerrier (sans soigner)</button>
                  <button class="btn-secondary" (click)="testObject('literal')">Tester Objet Anonyme</button>
                </div>

                @if (selectedTestResult()) {
                  <div class="tg-result-box" [class.success]="selectedTestResult()!.isSuccess" [class.failed]="!selectedTestResult()!.isSuccess">
                    <strong>Objet : {{ selectedTestResult()!.name }}</strong>
                    <div class="res-msg">{{ selectedTestResult()!.message }}</div>
                  </div>
                }
              </div>
            </div>
          </div>
        </section>

        <!-- 2. Visualiseur ISP (Interface Segregation Principle) -->
        <section class="card-panel interactive-section">
          <div class="section-title-row">
            <div class="icon-circle isp-icon">✂️</div>
            <div>
              <h3>2. Visualiseur ISP : Interface Obèse (« Fat Interface ») vs Micro-Interfaces Ciblées</h3>
              <p class="section-subtitle">Le principe de ségrégation des interfaces (le « I » de SOLID).</p>
            </div>
          </div>

          <div class="isp-mode-selector">
            <button class="btn-choice" [class.active]="ispMode() === 'fat'" (click)="ispMode.set('fat')">
              Anti-Pattern : Interface Obèse Monolithique
            </button>
            <button class="btn-choice" [class.active]="ispMode() === 'segregated'" (click)="ispMode.set('segregated')">
              Pattern Pro : Micro-Interfaces Spécialisées (ISP)
            </button>
          </div>

          <div class="isp-comparison-box mt-2">
            @if (ispMode() === 'fat') {
              <div class="fat-layout">
                <div class="fat-interface-card">
                  <span class="badge badge-red">Fat Interface</span>
                  <h4>interface TravailleurUniversel</h4>
                  <pre><code>interface TravailleurUniversel &#123;
  travailler(): void;
  manger(): void;
  dormir(): void;
&#125;</code></pre>
                </div>

                <div class="fat-classes-grid">
                  <div class="client-class ok">
                    <strong>class Humain implements TravailleurUniversel</strong>
                    <span class="status-pill green">✔ Tous les contrats ont du sens</span>
                  </div>
                  <div class="client-class broken">
                    <strong>class RobotIA implements TravailleurUniversel</strong>
                    <span class="status-pill red">💣 VIOLATION ISP &amp; CODE MORT</span>
                    <pre><code>manger(): void &#123;
  throw new Error("Un robot ne mange pas !");
&#125;
dormir(): void &#123;
  throw new Error("Un robot ne dort jamais !");
&#125;</code></pre>
                    <p class="critique">
                      Le Robot est tyrannisé par l'interface : il est forcé d'implémenter des méthodes aberrantes qui lèvent des erreurs au runtime !
                    </p>
                  </div>
                </div>
              </div>
            } @else {
              <div class="segregated-layout">
                <div class="seg-interfaces-row">
                  <div class="micro-card">
                    <span class="badge badge-success">Micro-contrat</span>
                    <strong>interface Travaillant</strong>
                    <code>travailler(): void;</code>
                  </div>
                  <div class="micro-card">
                    <span class="badge badge-success">Micro-contrat</span>
                    <strong>interface Mangeant</strong>
                    <code>manger(): void;</code>
                  </div>
                  <div class="micro-card">
                    <span class="badge badge-success">Micro-contrat</span>
                    <strong>interface Dormant</strong>
                    <code>dormir(): void;</code>
                  </div>
                </div>

                <div class="seg-classes-grid">
                  <div class="client-class ok">
                    <strong>class Humain implements Travaillant, Mangeant, Dormant</strong>
                    <p class="clean-p">L'Humain signe les 3 contrats légitimes pour son espèce.</p>
                  </div>
                  <div class="client-class ok">
                    <strong>class RobotIA implements Travaillant</strong>
                    <p class="clean-p">Le Robot ne signe QUE ce qu'il sait faire : 0 code mort, 0 exception, 100% de cohésion !</p>
                  </div>
                </div>
              </div>
            }
          </div>
        </section>

        <!-- Callout labo -->
        <div class="callout-footer card-panel">
          <div class="callout-text">
            <h4>Entraînez-vous à écrire des Type Guards et à refactoriser ISP</h4>
            <p>Le Labo 4 contient 4 exercices dédiés au diagnostic instanceof, aux Type Guards et à la ségrégation d'interfaces.</p>
          </div>
          <button class="btn-primary" (click)="activeView.set('lab')">
            Accéder aux 4 Exercices du Labo 4 →
          </button>
        </div>
      } @else {
        <app-lab-runner [labFilter]="4"></app-lab-runner>
      }
    </div>
  `,
  styles: [`
    .mt-2 { margin-top: 8px; }
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

      &.crash-icon { background: rgba(239, 68, 68, 0.15); }
      &.isp-icon { background: rgba(16, 185, 129, 0.15); }
    }

    .crash-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .crash-card {
      background: var(--bg-subtle);
      border-radius: 8px;
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 12px;

      &.trap {
        border: 1px solid rgba(239, 68, 68, 0.35);
      }

      &.fix {
        border: 1px solid rgba(16, 185, 129, 0.35);
      }

      .card-tag {
        font-size: 0.72rem;
        font-weight: 800;
        &.red { color: #f87171; }
        &.green { color: #34d399; }
      }

      h4 { font-size: 0.98rem; font-weight: 700; color: var(--text-main); }
    }

    .code-box {
      background: var(--bg-code);
      border-radius: 6px;
      padding: 10px 14px;
      overflow-x: auto;

      pre {
        font-family: var(--font-mono);
        font-size: 0.78rem;
        line-height: 1.45;
        color: #e2e8f0;
      }
    }

    .ts-error-box {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.4);
      border-radius: 6px;
      padding: 10px 12px;
      font-size: 0.8rem;
      line-height: 1.4;

      .err-badge {
        font-family: var(--font-mono);
        color: #fca5a5;
        font-weight: 700;
        margin-bottom: 4px;
        font-size: 0.75rem;
      }
    }

    .typeguard-tester-box {
      display: flex;
      flex-direction: column;
      gap: 8px;

      .tg-title {
        font-size: 0.78rem;
        font-weight: 700;
        color: var(--text-dim);
      }
    }

    .hero-selector-btns {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;

      button {
        font-size: 0.75rem;
        padding: 5px 10px;
      }
    }

    .tg-result-box {
      padding: 10px 12px;
      border-radius: 6px;
      font-size: 0.8rem;
      line-height: 1.4;

      &.success {
        background: rgba(16, 185, 129, 0.15);
        border: 1px solid rgba(16, 185, 129, 0.35);
        color: #a7f3d0;
      }

      &.failed {
        background: rgba(239, 68, 68, 0.15);
        border: 1px solid rgba(239, 68, 68, 0.35);
        color: #fca5a5;
      }
    }

    .isp-mode-selector {
      display: flex;
      gap: 8px;
      background: var(--bg-subtle);
      padding: 4px;
      border-radius: 8px;
      width: fit-content;

      .btn-choice {
        padding: 6px 14px;
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

    .isp-comparison-box {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 18px;
    }

    .fat-layout, .segregated-layout {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .fat-interface-card {
      background: var(--bg-card);
      border: 1px solid rgba(239, 68, 68, 0.4);
      border-radius: 8px;
      padding: 12px 16px;

      h4 { margin-top: 4px; font-size: 0.95rem; }
      pre { background: var(--bg-code); padding: 8px; border-radius: 6px; margin-top: 6px; font-size: 0.78rem; }
    }

    .fat-classes-grid, .seg-classes-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
    }

    .client-class {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 12px 14px;
      display: flex;
      flex-direction: column;
      gap: 6px;

      &.broken {
        border-color: rgba(239, 68, 68, 0.4);
      }

      .status-pill {
        font-size: 0.7rem;
        font-weight: 700;
        padding: 2px 6px;
        border-radius: 4px;
        width: fit-content;

        &.green { background: rgba(16, 185, 129, 0.2); color: #34d399; }
        &.red { background: rgba(239, 68, 68, 0.2); color: #f87171; }
      }

      pre { background: var(--bg-code); padding: 6px; border-radius: 4px; font-size: 0.75rem; }
      .critique { font-size: 0.76rem; color: #fca5a5; line-height: 1.35; }
      .clean-p { font-size: 0.78rem; color: var(--text-muted); }
    }

    .seg-interfaces-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
    }

    .micro-card {
      background: var(--bg-card);
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: 6px;
      padding: 10px 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 0.8rem;

      code { font-family: var(--font-mono); color: #34d399; font-size: 0.76rem; }
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
export class PitfallsTypeGuardsComponent {
  readonly activeView = signal<'theory' | 'lab'>('theory');
  readonly ispMode = signal<'fat' | 'segregated'>('fat');

  readonly selectedTestResult = signal<{ name: string; isSuccess: boolean; message: string } | null>({
    name: 'Mage (avec méthode soigner)',
    isSuccess: true,
    message: 'isSoigneur(mage) a renvoyé true ! TypeScript autorise mage.soigner(cible) sans aucun cast manuel.'
  });

  testObject(type: 'mage' | 'guerrier' | 'literal'): void {
    if (type === 'mage') {
      this.selectedTestResult.set({
        name: 'Mage Gandalf',
        isSuccess: true,
        message: '✔ isSoigneur(mage) === true. La méthode soigner(...) est présente. Type Narrowing activé !'
      });
    } else if (type === 'guerrier') {
      this.selectedTestResult.set({
        name: 'Guerrier Conan',
        isSuccess: false,
        message: '✖ isSoigneur(guerrier) === false. Aucune méthode soigner trouvée. L\'appel est évité avant tout crash runtime !'
      });
    } else {
      this.selectedTestResult.set({
        name: 'Objet anonyme { nom: "Potion", soigner: () => ... }',
        isSuccess: true,
        message: '✔ isSoigneur(potion) === true. Grâce au duck typing, même sans classe, la forme satisfait le Type Guard !'
      });
    }
  }
}
