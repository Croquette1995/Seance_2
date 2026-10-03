import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LabRunnerComponent } from '../../shared/components/lab-runner/lab-runner.component';

@Component({
  selector: 'app-custom-domain-errors',
  standalone: true,
  imports: [CommonModule, FormsModule, LabRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag-row">
          <span class="module-tag">MODULE 05 · MODÉLISATION DU DOMAINE</span>
          <span class="badge badge-purple">Taxonomie POO</span>
        </div>
        <h2>Concevoir des Exceptions Métier Typées (extends Error)</h2>
        <p class="module-desc">
          Bannissez définitivement les tests fragiles sur le texte <code>error.message.includes(...)</code>.
          Découvrez la puissance de l'héritage d'erreurs : classe socle <code>AppError</code>, codes constants immuables et enrichissement contextuel typé.
        </p>
      </div>

      <div class="section-mode-tabs">
        <button class="mode-tab-btn" [class.active]="activeMode() === 'interactive'" (click)="activeMode.set('interactive')">
          <span>💥 Fragile Code Demo &amp; Arbre Taxonomique</span>
        </button>
        <button class="mode-tab-btn" [class.active]="activeMode() === 'lab'" (click)="activeMode.set('lab')">
          <span>💻 Atelier Monaco (Labo 4 · Exceptions Métier)</span>
        </button>
      </div>

      @if (activeMode() === 'interactive') {
        <!-- PARTIE 1 : POURQUOI BANNIR MESSAGE.INCLUDES -->
        <div class="card-panel demo-card">
          <div class="card-title-row">
            <span class="badge badge-rose">Anti-Pattern Fragile Code</span>
            <h3>Pourquoi bannir if (error.message.includes("...")) ?</h3>
          </div>
          <p class="section-intro">
            Simulez un changement de langue (i18n) ou une retouche de texte dans l'application et observez la rupture silencieuse :
          </p>

          <div class="fragile-demo-grid">
            <div class="fragile-controls">
              <div class="ctrl-title">Configuration de l'application :</div>
              
              <div class="lang-toggle mt-2">
                <button 
                  class="choice-btn" 
                  [class.active]="selectedLang() === 'fr'"
                  (click)="selectedLang.set('fr')"
                >
                  🇫🇷 Français (message = "Le créneau est déjà réservé")
                </button>
                <button 
                  class="choice-btn" 
                  [class.active]="selectedLang() === 'en'"
                  (click)="selectedLang.set('en')"
                >
                  🇬🇧 Anglais (message = "Slot is already booked")
                </button>
                <button 
                  class="choice-btn" 
                  [class.active]="selectedLang() === 'typo'"
                  (click)="selectedLang.set('typo')"
                >
                  ✏️ Retouche texte (message = "Créneau indisponible")
                </button>
              </div>

              <div class="result-badge mt-3" [class.broken]="isFragileCheckBroken()">
                <div class="badge-title">Résultat du test UI : <code>error.message.includes('déjà réservé')</code></div>
                <div class="badge-val">{{ isFragileCheckBroken() ? '❌ FALSE (Alerte non affichée !)' : '✅ TRUE (Alerte affichée)' }}</div>
                <p class="badge-explanation">
                  {{ fragileExplanation() }}
                </p>
              </div>
            </div>

            <div class="code-preview-col">
              <div class="ctrl-title">Comparaison des deux approches :</div>
              <pre class="code-box"><code><span class="dim">// ❌ APPROCHE FRAGILE PAR CHAÎNE DE TEXTE :</span>
if (error.message.includes('déjà réservé')) &#123;
  afficherModalCreneauOccupe(); <span class="hl-red">// Casse si anglais ou retouche !</span>
&#125;

<span class="dim">// ✅ APPROCHE ROBUSTE ORIENTÉE OBJET (POO) :</span>
if (error instanceof <span class="hl-green">SlotUnavailableError</span>) &#123;
  afficherModalCreneauOccupe(); <span class="hl-green">// 100% stable en toute langue !</span>
&#125;</code></pre>
            </div>
          </div>
        </div>

        <!-- PARTIE 2 : ARBRE TAXONOMIQUE & CLASSE DE BASE APPERROR -->
        <div class="card-panel demo-card mt-3">
          <div class="card-title-row">
            <span class="badge badge-indigo">Architecture POO</span>
            <h3>Taxonomie d'Exceptions Métier &amp; Socle AppError</h3>
          </div>
          <p class="section-intro">
            Explorez l'arborescence d'héritage de votre domaine. Cliquez sur une classe pour inspecter sa signature et ses métadonnées.
          </p>

          <div class="taxonomy-layout">
            <!-- Arbre Visuel -->
            <div class="tree-container">
              <div class="tree-node root">
                <span class="node-badge">Standard JS</span>
                <strong>class Error</strong>
              </div>

              <div class="tree-branch">
                <div class="tree-node base" (click)="selectedClass.set('AppError')" [class.active]="selectedClass() === 'AppError'">
                  <span class="node-badge">Socle</span>
                  <strong>abstract class AppError</strong>
                </div>

                <div class="tree-children">
                  <!-- Branche Réservation -->
                  <div class="tree-group">
                    <div class="tree-node domain" (click)="selectedClass.set('ReservationError')" [class.active]="selectedClass() === 'ReservationError'">
                      <strong>class ReservationError</strong>
                    </div>
                    <div class="tree-leaf" (click)="selectedClass.set('SlotUnavailableError')" [class.active]="selectedClass() === 'SlotUnavailableError'">
                      ↳ SlotUnavailableError
                    </div>
                    <div class="tree-leaf" (click)="selectedClass.set('PastDateError')" [class.active]="selectedClass() === 'PastDateError'">
                      ↳ PastDateError
                    </div>
                  </div>

                  <!-- Branche Banque -->
                  <div class="tree-group">
                    <div class="tree-node domain" (click)="selectedClass.set('BanqueError')" [class.active]="selectedClass() === 'BanqueError'">
                      <strong>class BanqueError</strong>
                    </div>
                    <div class="tree-leaf" (click)="selectedClass.set('SoldeInsuffisantError')" [class.active]="selectedClass() === 'SoldeInsuffisantError'">
                      ↳ SoldeInsuffisantError
                    </div>
                    <div class="tree-leaf" (click)="selectedClass.set('MontantInvalideError')" [class.active]="selectedClass() === 'MontantInvalideError'">
                      ↳ MontantInvalideError
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Fiche d'identité de la classe sélectionnée -->
            <div class="class-inspector card-panel">
              <div class="inspector-header">
                <span class="badge badge-purple">{{ inspectorData().category }}</span>
                <h4>{{ inspectorData().name }}</h4>
              </div>
              <p class="inspector-desc">{{ inspectorData().desc }}</p>

              <div class="inspector-code mt-2">
                <div class="code-title">Déclaration TypeScript :</div>
                <pre><code>{{ inspectorData().codeSnippet }}</code></pre>
              </div>

              <div class="inspector-proof mt-2">
                <strong>Vérifications de polymorphisme :</strong>
                <div class="proof-list">
                  @for (rel of inspectorData().relations; track rel) {
                    <div class="proof-item">✔ {{ rel }}</div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      } @else {
        <!-- ATELIER MONACO LABO 4 -->
        <app-lab-runner [filterLabNumber]="4"></app-lab-runner>
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

    .fragile-demo-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .fragile-controls {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .ctrl-title {
      font-size: 0.78rem;
      font-weight: 700;
      text-transform: uppercase;
      color: var(--text-muted);
    }

    .lang-toggle {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .choice-btn {
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 0.8rem;
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

    .result-badge {
      padding: 14px;
      border-radius: 8px;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.3);

      .badge-title {
        font-size: 0.75rem;
        font-family: var(--font-mono);
        color: var(--text-muted);
      }

      .badge-val {
        font-size: 1.1rem;
        font-weight: 800;
        color: #34d399;
        margin: 4px 0;
      }

      .badge-explanation {
        font-size: 0.78rem;
        color: var(--text-muted);
        line-height: 1.4;
      }

      &.broken {
        background: rgba(244, 63, 94, 0.1);
        border-color: rgba(244, 63, 94, 0.3);

        .badge-val {
          color: #f43f5e;
        }
      }
    }

    .code-box {
      margin: 0;
      padding: 14px;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      font-family: var(--font-mono);
      font-size: 0.8rem;
      line-height: 1.5;
      color: var(--text-code);
    }

    .dim { color: #64748b; }
    .hl-red { color: #f43f5e; font-weight: 700; }
    .hl-green { color: #34d399; font-weight: 700; }

    .taxonomy-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;

      @media (max-width: 950px) {
        grid-template-columns: 1fr;
      }
    }

    .tree-container {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      font-family: var(--font-mono);
    }

    .tree-node, .tree-leaf {
      padding: 8px 12px;
      border-radius: 6px;
      border: 1px solid var(--border-color);
      background: var(--bg-card);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.82rem;
      transition: all 0.2s;

      &:hover {
        border-color: #6366f1;
        background: var(--bg-card-hover);
      }

      &.active {
        border-color: #6366f1;
        background: rgba(99, 102, 241, 0.15);
        color: #818cf8;
      }
    }

    .tree-leaf {
      margin-left: 20px;
      font-size: 0.76rem;
      color: var(--text-muted);
    }

    .node-badge {
      font-size: 0.65rem;
      padding: 1px 6px;
      border-radius: 4px;
      background: var(--bg-subtle);
      color: var(--text-dim);
    }

    .tree-children {
      margin-left: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 8px;
    }

    .tree-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .class-inspector {
      display: flex;
      flex-direction: column;
      gap: 10px;

      .inspector-header {
        display: flex;
        align-items: center;
        gap: 10px;

        h4 {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-main);
          font-family: var(--font-mono);
        }
      }

      .inspector-desc {
        font-size: 0.84rem;
        color: var(--text-muted);
        line-height: 1.45;
      }

      .code-title {
        font-size: 0.74rem;
        text-transform: uppercase;
        font-weight: 700;
        color: var(--text-dim);
        margin-bottom: 4px;
      }

      pre {
        margin: 0;
        padding: 10px;
        background: var(--bg-code);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        font-size: 0.78rem;
        color: var(--text-code);
      }

      .proof-list {
        display: flex;
        flex-direction: column;
        gap: 4px;
        font-size: 0.78rem;
        color: #34d399;
        font-family: var(--font-mono);
        margin-top: 4px;
      }
    }
  `]
})
export class CustomDomainErrorsComponent {
  readonly activeMode = signal<'interactive' | 'lab'>('interactive');

  // Fragile demo
  readonly selectedLang = signal<'fr' | 'en' | 'typo'>('fr');

  // Arbre
  readonly selectedClass = signal<string>('SoldeInsuffisantError');

  isFragileCheckBroken(): boolean {
    return this.selectedLang() !== 'fr';
  }

  fragileExplanation(): string {
    const l = this.selectedLang();
    if (l === 'fr') {
      return 'En français avec le texte d\'origine, le test .includes("déjà réservé") fonctionne miraculeusement.';
    } else if (l === 'en') {
      return 'Catastrophe i18n : l\'application a été traduite en anglais ("Slot is already booked"). Le test renvoie FALSE et l\'utilisateur ne reçoit aucune alerte !';
    } else {
      return 'Catastrophe de remaniement : un développeur a corrigé le texte en "Créneau indisponible". Le test renvoie FALSE et la logique de l\'écran s\'écroule !';
    }
  }

  inspectorData(): { name: string; category: string; desc: string; codeSnippet: string; relations: string[] } {
    const sc = this.selectedClass();
    if (sc === 'AppError') {
      return {
        name: 'abstract class AppError extends Error',
        category: 'Socle d\'Architecture',
        desc: 'Classe abstraite socle commune à toutes les erreurs métier. Elle capture le timestamp, réassigne this.name et répare le prototype.',
        codeSnippet: `export abstract class AppError extends Error {
  public readonly timestamp = new Date();
  constructor(message: string, public readonly code: string, public readonly httpStatus = 400) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}`,
        relations: [
          'new AppError() -> Interdit (classe abstraite)',
          'err instanceof AppError === true',
          'err instanceof Error === true'
        ]
      };
    } else if (sc === 'ReservationError') {
      return {
        name: 'class ReservationError extends AppError',
        category: 'Sous-Domaine Réservations',
        desc: 'Regroupe toutes les erreurs liées aux plannings, créneaux et réservations de salles.',
        codeSnippet: `export class ReservationError extends AppError {}`,
        relations: [
          'err instanceof ReservationError === true',
          'err instanceof AppError === true',
          'err instanceof Error === true'
        ]
      };
    } else if (sc === 'SlotUnavailableError') {
      return {
        name: 'class SlotUnavailableError extends ReservationError',
        category: 'Exception Concrète Spécialisée',
        desc: 'Levée lorsqu\'un utilisateur tente de réserver un créneau déjà occupé par un tiers.',
        codeSnippet: `export class SlotUnavailableError extends ReservationError {
  constructor(public readonly slotId: string, public readonly date: Date) {
    super(\`Le créneau \${slotId} est déjà réservé.\`, 'ERR_SLOT_UNAVAILABLE', 409);
  }
}`,
        relations: [
          'err instanceof SlotUnavailableError === true',
          'err instanceof ReservationError === true',
          'err instanceof AppError === true',
          'err instanceof Error === true'
        ]
      };
    } else if (sc === 'PastDateError') {
      return {
        name: 'class PastDateError extends ReservationError',
        category: 'Exception Concrète Spécialisée',
        desc: 'Levée si la date sélectionnée est déjà échue dans le passé.',
        codeSnippet: `export class PastDateError extends ReservationError {
  constructor(public readonly date: Date) {
    super(\`Date échue : \${date.toLocaleDateString()}.\`, 'ERR_PAST_DATE', 422);
  }
}`,
        relations: [
          'err instanceof PastDateError === true',
          'err instanceof ReservationError === true',
          'err instanceof AppError === true'
        ]
      };
    } else if (sc === 'BanqueError') {
      return {
        name: 'abstract class BanqueError extends AppError',
        category: 'Sous-Domaine Bancaire',
        desc: 'Classe mère de toutes les anomalies transactionnelles et financières.',
        codeSnippet: `export abstract class BanqueError extends AppError {}`,
        relations: [
          'err instanceof BanqueError === true',
          'err instanceof AppError === true'
        ]
      };
    } else if (sc === 'MontantInvalideError') {
      return {
        name: 'class MontantInvalideError extends BanqueError',
        category: 'Exception Concrète Spécialisée',
        desc: 'Levée lorsqu\'un montant transmis est inférieur ou égal à zéro.',
        codeSnippet: `export class MontantInvalideError extends BanqueError {
  constructor(public readonly montant: number) {
    super(\`Montant invalide : \${montant} €.\`, 'MONTANT_INVALIDE', 400);
  }
}`,
        relations: [
          'err instanceof MontantInvalideError === true',
          'err instanceof BanqueError === true'
        ]
      };
    } else {
      return {
        name: 'class SoldeInsuffisantError extends BanqueError',
        category: 'Exception Concrète Spécialisée',
        desc: 'Exception riche portant le solde courant, le montant demandé et le montant manquant calculé.',
        codeSnippet: `export class SoldeInsuffisantError extends BanqueError {
  public readonly montantManquant: number;
  constructor(public readonly soldeActuel: number, public readonly montantDemande: number) {
    super(\`Solde insuffisant (\${soldeActuel} €) pour \${montantDemande} €.\`, 'SOLDE_INSUFFISANT', 402);
    this.montantManquant = montantDemande - soldeActuel;
  }
}`,
        relations: [
          'err instanceof SoldeInsuffisantError === true',
          'err instanceof BanqueError === true',
          'err instanceof AppError === true',
          'err instanceof Error === true'
        ]
      };
    }
  }
}
