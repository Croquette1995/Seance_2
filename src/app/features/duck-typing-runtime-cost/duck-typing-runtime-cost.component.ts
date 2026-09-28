import { Component, signal, computed } from '@angular/core';
import { LabRunnerComponent } from '../../shared/components/lab-runner/lab-runner.component';

@Component({
  selector: 'app-duck-typing-runtime-cost',
  standalone: true,
  imports: [LabRunnerComponent],
  template: `
    <div class="module-container">
      <header class="module-header">
        <div class="module-tag">Module 04 · Typage Structurel &amp; Performance</div>
        <h2>Le Typage Structurel (Duck Typing) &amp; Zéro Coût Runtime</h2>
        <p class="module-desc">
          En TypeScript, deux types sont compatibles s'ils ont les mêmes membres, peu importe leur nom de classe.
          De plus, les interfaces sont <strong>totalement effacées à la compilation (Type Erasure)</strong>, ne pesant strictement aucun octet dans votre bundle JavaScript final !
        </p>

        <div class="section-mode-tabs mt-2">
          <button class="mode-tab-btn" [class.active]="activeView() === 'theory'" (click)="activeView.set('theory')">
            <span>🔬 Théorie &amp; Simulateurs Interactifs</span>
          </button>
          <button class="mode-tab-btn" [class.active]="activeView() === 'lab'" (click)="activeView.set('lab')">
            <span>💻 Labo Pratique Monaco (Labo 3)</span>
          </button>
        </div>
      </header>

      @if (activeView() === 'theory') {
        <!-- 1. Le Banc d'essai Duck Typing -->
        <section class="card-panel interactive-section">
          <div class="section-title-row">
            <div class="icon-circle duck-icon">🦆</div>
            <div>
              <h3>1. Le Banc d'Essai Duck Typing : « Forme » plutôt que « Nom »</h3>
              <p class="section-subtitle">Construisez un objet littéral et observez si la fonction <code>tracerPoint(p: Coordonnees2D)</code> l'accepte.</p>
            </div>
          </div>

          <div class="duck-workbench-grid">
            <div class="duck-controls">
              <div class="ctrl-title">Propriétés de l'objet anonyme passé en paramètre :</div>
              
              <label class="switch-row">
                <input type="checkbox" [checked]="hasX()" (change)="hasX.set(!hasX())">
                <span>x: 15 (number) <span class="required-tag">Exigé par le contrat</span></span>
              </label>

              <label class="switch-row">
                <input type="checkbox" [checked]="hasY()" (change)="hasY.set(!hasY())">
                <span>y: 42 (number) <span class="required-tag">Exigé par le contrat</span></span>
              </label>

              <label class="switch-row surplus">
                <input type="checkbox" [checked]="hasColor()" (change)="hasColor.set(!hasColor())">
                <span>couleur: "#3b82f6" (string) <span class="surplus-tag">Surplus toléré</span></span>
              </label>

              <label class="switch-row surplus">
                <input type="checkbox" [checked]="hasZ()" (change)="hasZ.set(!hasZ())">
                <span>z: 100 (number) <span class="surplus-tag">Surplus toléré</span></span>
              </label>

              <div class="literal-mode-box mt-2">
                <span class="ctrl-sub">Mode de passage :</span>
                <div class="btn-group">
                  <button class="btn-choice" [class.active]="passingMode() === 'variable'" (click)="passingMode.set('variable')">
                    Via variable intermédiaire (Tolérance surplus)
                  </button>
                  <button class="btn-choice" [class.active]="passingMode() === 'inline'" (click)="passingMode.set('inline')">
                    Objet littéral direct (Excess Property Check)
                  </button>
                </div>
              </div>
            </div>

            <div class="duck-visualizer">
              <div class="visualizer-header">
                <span>Diagnostic Compilateur TypeScript</span>
                <span class="badge" [class.badge-success]="isCompatible()" [class.badge-red]="!isCompatible()">
                  {{ isCompatible() ? '✔ COMPATIBLE' : '✖ ERREUR DE TYPE' }}
                </span>
              </div>

              <div class="visualizer-body">
                <div class="code-snippet-box">
                  <pre><code>// Contrat attendu par la fonction :
interface Coordonnees2D &#123;
  x: number;
  y: number;
&#125;

// Code testé :
{{ testedCodeSnippet() }}</code></pre>
                </div>

                <div class="status-verdict-box" [class.valid]="isCompatible()" [class.invalid]="!isCompatible()">
                  @if (isCompatible()) {
                    <div class="verdict-title">✔ Contrat Validé avec Succès !</div>
                    <p>
                      L'objet possède bien les propriétés <code>x: number</code> et <code>y: number</code>.
                      Les propriétés excédentaires (s'il y en a) sont ignorées par la fonction : TypeScript valide la compatibilité par sous-typage structurel.
                    </p>
                  } @else {
                    <div class="verdict-title">🔴 {{ incompatibilityReason().title }}</div>
                    <p>{{ incompatibilityReason().message }}</p>
                  }
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 2. Split-Screen Type Erasure (0 octet runtime) -->
        <section class="card-panel interactive-section">
          <div class="section-title-row">
            <div class="icon-circle ghost-bytes-icon">⚡</div>
            <div>
              <h3>2. Split-Screen : TypeScript vs JavaScript Transpilé (Type Erasure)</h3>
              <p class="section-subtitle">Observez en direct l'évaporation totale de l'interface comparée à la classe abstraite.</p>
            </div>
          </div>

          <div class="erasure-stats-bar">
            <div class="stat-box">
              <span class="stat-label">Taille Runtime de l'Interface</span>
              <span class="stat-value green">0 octet (0 bytes)</span>
              <span class="stat-sub">Disparaît à 100% lors du build</span>
            </div>
            <div class="stat-box">
              <span class="stat-label">Taille Runtime de la Classe Abstraite</span>
              <span class="stat-value blue">~240 octets</span>
              <span class="stat-sub">Génère un constructeur réel en mémoire</span>
            </div>
          </div>

          <div class="split-screen-grid mt-2">
            <!-- Colonne Gauche TS -->
            <div class="split-col">
              <div class="col-bar ts-bar">
                <span>Code Source TypeScript (Compilation)</span>
                <span class="badge badge-ts">.ts</span>
              </div>
              <pre class="split-pre"><code>// 1. L'INTERFACE : Pur contrat statique
interface UtilisateurDTO &#123;
  id: string;
  email: string;
  roles: string[];
&#125;

// 2. LA CLASSE ABSTRAITE : Boilerplate &amp; État
abstract class EntiteBase &#123;
  constructor(public id: string) &#123;&#125;
  
  obtenirId(): string &#123;
    return this.id;
  &#125;
  
  abstract valider(): boolean;
&#125;</code></pre>
            </div>

            <!-- Colonne Droite JS -->
            <div class="split-col">
              <div class="col-bar js-bar">
                <span>Code JavaScript Émis dans le Bundle (Runtime)</span>
                <span class="badge badge-warning">.js (tsc)</span>
              </div>
              <pre class="split-pre"><code>// 💨 POOF ! L'interface UtilisateurDTO
// s'est totalement évaporée dans la nature !
// (Aucune fonction, aucun objet, 0 trace en RAM)

// La classe abstraite génère un constructeur réel :
class EntiteBase &#123;
  constructor(id) &#123;
    this.id = id;
  &#125;
  obtenirId() &#123;
    return this.id;
  &#125;
  // La méthode abstraite valider() n'émet aucun corps
&#125;</code></pre>
            </div>
          </div>

          <div class="erasure-conclusion-box">
            <h4>💡 Enseignement Architectural Capital :</h4>
            <p>
              Pour typer des données transitant via des API REST/GraphQL (DTOs, payloads JSON),
              <strong>utilisez TOUJOURS des <code>interface</code></strong> plutôt que des <code>class</code>.
              Vous bénéficiez ainsi d'une sécurité de typage maximale pendant le développement, avec un impact absolument nul sur les performances et le poids du bundle de vos utilisateurs.
            </p>
          </div>
        </section>

        <!-- Callout labo -->
        <div class="callout-footer card-panel">
          <div class="callout-text">
            <h4>Pratiquez le Duck Typing et les DTOs dans Monaco Editor</h4>
            <p>Le Labo 3 propose 4 exercices sur les objets anonymes, les payloads API et l'Excess Property Check.</p>
          </div>
          <button class="btn-primary" (click)="activeView.set('lab')">
            Passer aux 4 Exercices du Labo 3 →
          </button>
        </div>
      } @else {
        <app-lab-runner [labFilter]="3"></app-lab-runner>
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

      &.duck-icon { background: rgba(245, 158, 11, 0.15); }
      &.ghost-bytes-icon { background: rgba(16, 185, 129, 0.15); }
    }

    .duck-workbench-grid {
      display: grid;
      grid-template-columns: 360px 1fr;
      gap: 20px;
    }

    .duck-controls {
      display: flex;
      flex-direction: column;
      gap: 10px;

      .ctrl-title {
        font-size: 0.8rem;
        font-weight: 700;
        color: var(--text-dim);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
    }

    .switch-row {
      display: flex;
      align-items: center;
      gap: 10px;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 10px 12px;
      cursor: pointer;
      font-family: var(--font-mono);
      font-size: 0.8rem;
      color: var(--text-main);

      .required-tag {
        font-size: 0.68rem;
        background: rgba(49, 120, 198, 0.2);
        color: var(--ts-blue-light);
        padding: 1px 6px;
        border-radius: 4px;
        margin-left: 6px;
      }

      .surplus-tag {
        font-size: 0.68rem;
        background: rgba(245, 158, 11, 0.15);
        color: #fbbf24;
        padding: 1px 6px;
        border-radius: 4px;
        margin-left: 6px;
      }
    }

    .literal-mode-box {
      display: flex;
      flex-direction: column;
      gap: 6px;

      .ctrl-sub {
        font-size: 0.78rem;
        font-weight: 600;
        color: var(--text-dim);
      }
    }

    .btn-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
      background: var(--bg-subtle);
      padding: 4px;
      border-radius: 8px;

      .btn-choice {
        padding: 6px 10px;
        font-size: 0.76rem;
        font-weight: 600;
        color: var(--text-muted);
        border-radius: 6px;
        text-align: left;

        &.active {
          background: var(--ts-blue);
          color: #ffffff;
        }
      }
    }

    .duck-visualizer {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      overflow: hidden;

      .visualizer-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 14px;
        background: var(--bg-card);
        border-bottom: 1px solid var(--border-color);
        font-size: 0.82rem;
        font-weight: 600;
      }

      .visualizer-body {
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
    }

    .code-snippet-box {
      background: var(--bg-code);
      border-radius: 6px;
      padding: 12px;
      overflow-x: auto;

      pre {
        font-family: var(--font-mono);
        font-size: 0.8rem;
        color: #e2e8f0;
        line-height: 1.45;
      }
    }

    .status-verdict-box {
      padding: 12px 14px;
      border-radius: 8px;
      font-size: 0.84rem;
      line-height: 1.45;

      &.valid {
        background: rgba(16, 185, 129, 0.1);
        border: 1px solid rgba(16, 185, 129, 0.35);
        color: #a7f3d0;
        .verdict-title { font-weight: 700; color: #34d399; margin-bottom: 4px; }
      }

      &.invalid {
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.35);
        color: #fca5a5;
        .verdict-title { font-weight: 700; color: #f87171; margin-bottom: 4px; }
      }
    }

    .erasure-stats-bar {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .stat-box {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 14px 18px;
      display: flex;
      flex-direction: column;
      gap: 4px;

      .stat-label { font-size: 0.78rem; color: var(--text-dim); text-transform: uppercase; font-weight: 700; }
      .stat-value { font-size: 1.35rem; font-weight: 800; font-family: var(--font-mono); }
      .stat-value.green { color: #34d399; }
      .stat-value.blue { color: #60a5fa; }
      .stat-sub { font-size: 0.74rem; color: var(--text-muted); }
    }

    .split-screen-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .split-col {
      background: var(--bg-code);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      overflow: hidden;

      .col-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 12px;
        font-family: var(--font-mono);
        font-size: 0.76rem;
        font-weight: 600;
        border-bottom: 1px solid var(--border-color);

        &.ts-bar { background: rgba(49, 120, 198, 0.15); color: var(--ts-blue-light); }
        &.js-bar { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }
      }

      .split-pre {
        padding: 14px;
        font-family: var(--font-mono);
        font-size: 0.8rem;
        line-height: 1.5;
        color: #e2e8f0;
      }
    }

    .erasure-conclusion-box {
      background: rgba(49, 120, 198, 0.08);
      border: 1px solid rgba(49, 120, 198, 0.3);
      border-radius: 8px;
      padding: 14px 18px;
      font-size: 0.85rem;
      line-height: 1.45;

      h4 { font-size: 0.95rem; color: var(--ts-blue-light); margin-bottom: 6px; }
      p { color: var(--text-main); }
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
export class DuckTypingRuntimeCostComponent {
  readonly activeView = signal<'theory' | 'lab'>('theory');

  readonly hasX = signal<boolean>(true);
  readonly hasY = signal<boolean>(true);
  readonly hasColor = signal<boolean>(false);
  readonly hasZ = signal<boolean>(false);
  readonly passingMode = signal<'variable' | 'inline'>('variable');

  readonly isCompatible = computed(() => {
    // Mode inline avec surplus -> TS2353 Excess property check !
    if (this.passingMode() === 'inline' && (this.hasColor() || this.hasZ())) {
      return false;
    }
    // Doit posséder x et y
    return this.hasX() && this.hasY();
  });

  readonly incompatibilityReason = computed(() => {
    if (!this.hasX()) {
      return {
        title: 'Propriété x manquante (TS2741)',
        message: 'L\'interface Coordonnees2D exige obligatoirement une coordonnée x de type number.'
      };
    }
    if (!this.hasY()) {
      return {
        title: 'Propriété y manquante (TS2741)',
        message: 'L\'interface Coordonnees2D exige obligatoirement une coordonnée y de type number.'
      };
    }
    if (this.passingMode() === 'inline' && (this.hasColor() || this.hasZ())) {
      return {
        title: 'Excess Property Check déclenché (TS2353)',
        message: 'Lors de l\'assignation d\'un objet littéral direct, TypeScript interdit tout surplus pour éviter les fautes de frappe ! Passez par une variable intermédiaire pour tolérer le surplus.'
      };
    }
    return { title: '', message: '' };
  });

  readonly testedCodeSnippet = computed(() => {
    const props: string[] = [];
    if (this.hasX()) props.push('x: 15');
    if (this.hasY()) props.push('y: 42');
    if (this.hasColor()) props.push('couleur: "#3b82f6"');
    if (this.hasZ()) props.push('z: 100');

    const objStr = `{ ${props.join(', ')} }`;

    if (this.passingMode() === 'inline') {
      return `function tracer(p: Coordonnees2D) { ... }\n\n// Affectation directe d'objet littéral :\ntracer(${objStr});`;
    } else {
      return `function tracer(p: Coordonnees2D) { ... }\n\n// Passage via variable intermédiaire :\nconst pointBrut = ${objStr};\ntracer(pointBrut);`;
    }
  });
}
