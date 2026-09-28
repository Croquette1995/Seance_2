import { Component, signal, computed } from '@angular/core';
import { LabRunnerComponent } from '../../shared/components/lab-runner/lab-runner.component';

@Component({
  selector: 'app-decision-tree-hybrid',
  standalone: true,
  imports: [LabRunnerComponent],
  template: `
    <div class="module-container">
      <header class="module-header">
        <div class="module-tag">Module 05 · Stratégie &amp; Choix d'Architecture</div>
        <h2>L'Arbre de Décision : « Est-un » vs « Capable-de »</h2>
        <p class="module-desc">
          L'une des plus grandes difficultés en POO moderne est de savoir quand utiliser une classe abstraite, une interface, ou combiner les deux.
          Ce sélecteur dynamique vous aide à faire le choix architectural optimal selon votre contexte métier.
        </p>

        <div class="section-mode-tabs mt-2">
          <button class="mode-tab-btn" [class.active]="activeView() === 'theory'" (click)="activeView.set('theory')">
            <span>🔬 Théorie &amp; Simulateurs Interactifs</span>
          </button>
          <button class="mode-tab-btn" [class.active]="activeView() === 'lab'" (click)="activeView.set('lab')">
            <span>💻 Labo Pratique Monaco (Labo 5)</span>
          </button>
        </div>
      </header>

      @if (activeView() === 'theory') {
        <!-- 1. Sélecteur d'Architecture Interactif -->
        <section class="card-panel interactive-section">
          <div class="section-title-row">
            <div class="icon-circle decision-icon">🌳</div>
            <div>
              <h3>1. Sélecteur d'Architecture Interactif (Arbre de Décision)</h3>
              <p class="section-subtitle">Répondez aux 4 questions pour déterminer la structure idéale.</p>
            </div>
          </div>

          <div class="decision-grid">
            <div class="questions-col">
              <!-- Q1 -->
              <div class="question-card">
                <span class="q-num">1. Partage d'état et de code réel (DRY) ?</span>
                <p class="q-desc">Avez-vous des propriétés concrètes ou des méthodes déjà écrites à mutualiser entre vos classes ?</p>
                <div class="btn-group-row">
                  <button class="btn-choice" [class.active]="qCodeSharing() === true" (click)="qCodeSharing.set(true)">OUI</button>
                  <button class="btn-choice" [class.active]="qCodeSharing() === false" (click)="qCodeSharing.set(false)">NON</button>
                </div>
              </div>

              <!-- Q2 -->
              <div class="question-card">
                <span class="q-num">2. Multiples capacités requises simultanément ?</span>
                <p class="q-desc">Vos objets doivent-ils combiner plusieurs rôles orthogonaux (ex: Volant, Nageant, Auditable) ?</p>
                <div class="btn-group-row">
                  <button class="btn-choice" [class.active]="qMultipleRoles() === true" (click)="qMultipleRoles.set(true)">OUI</button>
                  <button class="btn-choice" [class.active]="qMultipleRoles() === false" (click)="qMultipleRoles.set(false)">NON</button>
                </div>
              </div>

              <!-- Q3 -->
              <div class="question-card">
                <span class="q-num">3. Besoin de vérification instanceof au runtime ?</span>
                <p class="q-desc">Avez-vous besoin d'utiliser l'opérateur natif <code>instanceof</code> en JavaScript à l'exécution ?</p>
                <div class="btn-group-row">
                  <button class="btn-choice" [class.active]="qNeedsInstanceOf() === true" (click)="qNeedsInstanceOf.set(true)">OUI</button>
                  <button class="btn-choice" [class.active]="qNeedsInstanceOf() === false" (click)="qNeedsInstanceOf.set(false)">NON</button>
                </div>
              </div>

              <!-- Q4 -->
              <div class="question-card">
                <span class="q-num">4. S'agit-il uniquement de données réseau / API (DTO) ?</span>
                <p class="q-desc">Modélisez-vous des objets JSON sans aucune méthode métier ni logique ?</p>
                <div class="btn-group-row">
                  <button class="btn-choice" [class.active]="qIsPureDto() === true" (click)="qIsPureDto.set(true)">OUI</button>
                  <button class="btn-choice" [class.active]="qIsPureDto() === false" (click)="qIsPureDto.set(false)">NON</button>
                </div>
              </div>
            </div>

            <!-- Recommandation Dynamique -->
            <div class="result-col">
              <div class="verdict-card" [class]="recommendation().cardClass">
                <div class="rec-badge">{{ recommendation().badge }}</div>
                <h4 class="rec-title">{{ recommendation().title }}</h4>
                <p class="rec-summary">{{ recommendation().summary }}</p>

                <div class="rec-points-list">
                  <div class="point-item">
                    <span class="pt-icon">🎯</span>
                    <span><strong>Sémantique :</strong> {{ recommendation().semantic }}</span>
                  </div>
                  <div class="point-item">
                    <span class="pt-icon">⚡</span>
                    <span><strong>Impact Runtime :</strong> {{ recommendation().runtimeImpact }}</span>
                  </div>
                  <div class="point-item">
                    <span class="pt-icon">📐</span>
                    <span><strong>Syntaxe TypeScript :</strong> <code>{{ recommendation().syntaxExample }}</code></span>
                  </div>
                </div>

                <div class="rec-example-snippet">
                  <pre><code>{{ recommendation().codeSnippet }}</code></pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 2. Démonstrateur du Pattern Hybride Pro -->
        <section class="card-panel interactive-section">
          <div class="section-title-row">
            <div class="icon-circle hybrid-icon">⚙️</div>
            <div>
              <h3>2. Démonstrateur du Pattern Hybride Pro (Architecture d'Entreprise)</h3>
              <p class="section-subtitle">L'interface pour l'API publique découplée + la classe abstraite pour le boilerplate réutilisable.</p>
            </div>
          </div>

          <div class="hybrid-architecture-diagram">
            <div class="arch-layer client-layer">
              <div class="layer-tag">COUCHE CLIENT (Consommateurs)</div>
              <div class="layer-content">
                <code>function afficher(forme: <strong>Dessinable</strong>) &#123; ... &#125;</code>
                <p>Le consommateur ne dépend QUE du contrat pur <code>Dessinable</code>. Couplage minimal absolu !</p>
              </div>
            </div>

            <div class="arch-arrow">↓ Dépend uniquement de l'interface</div>

            <div class="arch-layer contract-layer">
              <div class="layer-tag">CONTRAT PUR (API Publique)</div>
              <div class="layer-content">
                <strong>interface Dessinable &#123; dessiner(): void; &#125;</strong>
                <p>0 octet en mémoire. Standard d'interopérabilité universel.</p>
              </div>
            </div>

            <div class="arch-arrow">↑ Implémente le contrat</div>

            <div class="arch-layer base-layer">
              <div class="layer-tag">SQUELETTE RÉUTILISABLE (Boilerplate DRY)</div>
              <div class="layer-content">
                <strong>abstract class FormeGraphique implements Dessinable &#123;</strong>
                <p>Centralise <code>id: string</code>, <code>couleur: string</code>, calcul de position.</p>
              </div>
            </div>

            <div class="arch-arrow">↑ extends</div>

            <div class="arch-layer concrete-layer">
              <div class="layer-tag">CLASSES CONCRÈTES (Spécialisations)</div>
              <div class="concrete-classes-row">
                <span class="c-badge">class Cercle extends FormeGraphique</span>
                <span class="c-badge">class Rectangle extends FormeGraphique</span>
                <span class="c-badge">class Triangle extends FormeGraphique</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Callout labo -->
        <div class="callout-footer card-panel">
          <div class="callout-text">
            <h4>Passez à la pratique de l'architecture hybride dans Monaco Editor</h4>
            <p>Le Labo 5 vous guide dans la création d'un moteur d'export massif polymorphe respectant le principe OCP.</p>
          </div>
          <button class="btn-primary" (click)="activeView.set('lab')">
            Accéder aux 4 Exercices du Labo 5 →
          </button>
        </div>
      } @else {
        <app-lab-runner [labFilter]="5"></app-lab-runner>
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

      &.decision-icon { background: rgba(147, 51, 234, 0.15); }
      &.hybrid-icon { background: rgba(59, 130, 246, 0.15); }
    }

    .decision-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .questions-col {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .question-card {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 12px 16px;
      display: flex;
      flex-direction: column;
      gap: 6px;

      .q-num {
        font-size: 0.82rem;
        font-weight: 700;
        color: var(--ts-blue-light);
      }

      .q-desc {
        font-size: 0.78rem;
        color: var(--text-muted);
      }
    }

    .btn-group-row {
      display: flex;
      gap: 8px;
      margin-top: 4px;

      .btn-choice {
        flex: 1;
        padding: 5px 12px;
        font-size: 0.76rem;
        font-weight: 700;
        border-radius: 6px;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        color: var(--text-muted);

        &.active {
          background: var(--ts-blue);
          color: #ffffff;
          border-color: var(--ts-blue);
        }
      }
    }

    .result-col {
      display: flex;
      flex-direction: column;
    }

    .verdict-card {
      background: var(--bg-subtle);
      border: 2px solid var(--border-color);
      border-radius: 10px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      height: 100%;

      &.card-interface {
        border-color: rgba(16, 185, 129, 0.4);
        background: rgba(16, 185, 129, 0.05);
        .rec-badge { background: rgba(16, 185, 129, 0.2); color: #34d399; }
        .rec-title { color: #34d399; }
      }

      &.card-abstract {
        border-color: rgba(59, 130, 246, 0.4);
        background: rgba(59, 130, 246, 0.05);
        .rec-badge { background: rgba(59, 130, 246, 0.2); color: #60a5fa; }
        .rec-title { color: #60a5fa; }
      }

      &.card-hybrid {
        border-color: rgba(168, 85, 247, 0.4);
        background: rgba(168, 85, 247, 0.05);
        .rec-badge { background: rgba(168, 85, 247, 0.2); color: #c084fc; }
        .rec-title { color: #c084fc; }
      }

      .rec-badge {
        font-size: 0.72rem;
        font-weight: 800;
        padding: 3px 8px;
        border-radius: 4px;
        width: fit-content;
      }

      .rec-title {
        font-size: 1.25rem;
        font-weight: 800;
      }

      .rec-summary {
        font-size: 0.85rem;
        color: var(--text-muted);
        line-height: 1.45;
      }
    }

    .rec-points-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      font-size: 0.8rem;

      .point-item {
        display: flex;
        align-items: center;
        gap: 8px;
      }
    }

    .rec-example-snippet {
      background: var(--bg-code);
      border-radius: 6px;
      padding: 10px;
      overflow-x: auto;
      margin-top: auto;

      pre {
        font-family: var(--font-mono);
        font-size: 0.75rem;
        color: #e2e8f0;
      }
    }

    .hybrid-architecture-diagram {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      background: var(--bg-subtle);
      border-radius: 8px;
      padding: 24px;
      border: 1px solid var(--border-color);
    }

    .arch-layer {
      width: 100%;
      max-width: 600px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 12px 18px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      transition: all 0.2s;

      .layer-tag {
        font-size: 0.68rem;
        font-weight: 800;
        color: var(--ts-blue-light);
        letter-spacing: 0.05em;
      }

      .layer-content {
        font-size: 0.82rem;
        color: var(--text-muted);
        strong { color: var(--text-main); }
      }

      &.contract-layer {
        border-color: #10b981;
        background: rgba(16, 185, 129, 0.06);
        .layer-tag { color: #34d399; }
      }

      &.base-layer {
        border-color: #3b82f6;
        background: rgba(59, 130, 246, 0.06);
        .layer-tag { color: #60a5fa; }
      }
    }

    .arch-arrow {
      font-family: var(--font-mono);
      font-size: 0.76rem;
      color: var(--text-dim);
      font-weight: 700;
    }

    .concrete-classes-row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-top: 4px;

      .c-badge {
        font-family: var(--font-mono);
        font-size: 0.74rem;
        background: var(--bg-subtle);
        border: 1px solid var(--border-color);
        padding: 3px 8px;
        border-radius: 4px;
        color: var(--text-main);
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

      h4 { font-size: 1rem; color: var(--text-main); }
      p { font-size: 0.84rem; color: var(--text-muted); }
    }
  `]
})
export class DecisionTreeHybridComponent {
  readonly activeView = signal<'theory' | 'lab'>('theory');

  readonly qCodeSharing = signal<boolean>(true);
  readonly qMultipleRoles = signal<boolean>(false);
  readonly qNeedsInstanceOf = signal<boolean>(true);
  readonly qIsPureDto = signal<boolean>(false);

  readonly recommendation = computed(() => {
    // Si c'est un DTO pur
    if (this.qIsPureDto()) {
      return {
        cardClass: 'card-interface',
        badge: 'CHOIX OPTIMAL : INTERFACE PURE',
        title: 'interface (DTO & Typage Léger)',
        summary: 'Pour modéliser des données d\'API ou des structures sans méthodes, l\'interface est incontournable. Elle offre un typage strict avec zéro octet au runtime.',
        semantic: 'Contrat de données pur (forme)',
        runtimeImpact: '0 octet (100% effacé en JS)',
        syntaxExample: 'interface UtilisateurDTO { id: string; email: string; }',
        codeSnippet: `interface UtilisateurDTO {
  id: string;
  email: string;
}`
      };
    }

    // Si on a à la fois du code à partager ET besoin d'interface publique/multi-implémentation
    if (this.qCodeSharing() && this.qMultipleRoles()) {
      return {
        cardClass: 'card-hybrid',
        badge: 'CHOIX PRO : PATTERN HYBRIDE',
        title: 'Pattern Hybride (interface + abstract class)',
        summary: 'Définissez une interface pour découpler l\'API publique et vos consommateurs, et créez une classe abstraite de base implémentant cette interface pour factoriser le boilerplate.',
        semantic: 'API publique découplée + factorisation DRY',
        runtimeImpact: 'Constructeur JS uniquement pour la classe de base',
        syntaxExample: 'abstract class FormeBase implements Dessinable',
        codeSnippet: `interface Dessinable { dessiner(): void; }
abstract class FormeBase implements Dessinable {
  constructor(public id: string) {}
  abstract dessiner(): void;
}`
      };
    }

    // Si on a du code à partager et besoin de instanceof
    if (this.qCodeSharing() || this.qNeedsInstanceOf()) {
      return {
        cardClass: 'card-abstract',
        badge: 'CHOIX OPTIMAL : CLASSE ABSTRAITE',
        title: 'abstract class (Hiérarchie Forte)',
        summary: 'La classe abstraite s\'impose dès que vous factorisez du code exécutable, gérez de l\'état partagé dans le constructeur ou devez vérifier instanceof à l\'exécution.',
        semantic: 'Relation « Est-un » forte (spécialisation)',
        runtimeImpact: 'Constructeur réel présent dans le bundle JS',
        syntaxExample: 'abstract class Vehicule { constructor(public marque: string) {} }',
        codeSnippet: `abstract class Vehicule {
  constructor(public marque: string) {}
  abstract demarrer(): string;
}`
      };
    }

    // Cas par défaut : Interface
    return {
      cardClass: 'card-interface',
      badge: 'CHOIX OPTIMAL : INTERFACE',
      title: 'interface (Contrat Pur)',
      summary: 'Pour modéliser des aptitudes « Capable-de », garantir le découplage et permettre la multi-implémentation sans collision.',
      semantic: 'Relation « Capable-de » (aptitude)',
      runtimeImpact: '0 octet en mémoire',
      syntaxExample: 'interface Imprimable { imprimer(): void; }',
      codeSnippet: `interface Imprimable {
  imprimer(doc: string): void;
}`
    };
  });
}
