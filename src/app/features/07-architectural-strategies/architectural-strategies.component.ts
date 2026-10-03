import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LabRunnerComponent } from '../../shared/components/lab-runner/lab-runner.component';

@Component({
  selector: 'app-architectural-strategies',
  standalone: true,
  imports: [CommonModule, FormsModule, LabRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag-row">
          <span class="module-tag">MODULE 07 · ARCHITECTURE LOGICIELLE</span>
          <span class="badge badge-emerald">Domaine / Service / UI</span>
        </div>
        <h2>La Règle des Trois Étages &amp; Error Wrapping</h2>
        <p class="module-desc">
          Une gestion saine des exceptions repose sur une division stricte des responsabilités.
          Découvrez la règle des 3 étages, la technique de l'englobement d'erreur (<em>Error Wrapping</em>) et le tableau d'arbitrage <code>throw</code> vs <code>Signal</code>.
        </p>
      </div>

      <div class="section-mode-tabs">
        <button class="mode-tab-btn" [class.active]="activeMode() === 'interactive'" (click)="activeMode.set('interactive')">
          <span>💥 Schéma des 3 Étages &amp; Tableau Décisionnel</span>
        </button>
        <button class="mode-tab-btn" [class.active]="activeMode() === 'lab'" (click)="activeMode.set('lab')">
          <span>💻 Atelier Monaco (Labo 5 · Architecture &amp; Couches)</span>
        </button>
      </div>

      @if (activeMode() === 'interactive') {
        <!-- PARTIE 1 : SCHÉMA DES 3 ÉTAGES -->
        <div class="card-panel demo-card">
          <div class="card-title-row">
            <span class="badge badge-indigo">Architecture Modulaire</span>
            <h3>La Règle d'Or des Trois Étages</h3>
          </div>
          <p class="section-intro">
            Cliquez sur un étage pour visualiser son code source, son rôle et sa discipline de gestion :
          </p>

          <div class="tiers-layout">
            <div class="tiers-stack">
              <!-- Étage 3 -->
              <div 
                class="tier-box tier-3" 
                [class.selected]="selectedTier() === 3"
                (click)="selectedTier.set(3)"
              >
                <div class="tier-badge">ÉTAGE 3 : PRÉSENTATION (Composants Angular)</div>
                <div class="tier-title">Composant UI &amp; Signals Réactifs</div>
                <div class="tier-action">🛡️ try / catch / finally ➔ Alimente signal(erreur), libère le loader.</div>
              </div>

              <div class="tier-arrow">▲ Exceptions métier propagées (ex: SlotUnavailableError)</div>

              <!-- Étage 2 -->
              <div 
                class="tier-box tier-2" 
                [class.selected]="selectedTier() === 2"
                (click)="selectedTier.set(2)"
              >
                <div class="tier-badge">ÉTAGE 2 : SERVICES APPLICATIFS</div>
                <div class="tier-title">Services Métier &amp; Orchestration</div>
                <div class="tier-action">🔄 Error Wrapping : Traduit HTTP 409 en SlotUnavailableError avec cause.</div>
              </div>

              <div class="tier-arrow">▲ Invariants purs violés</div>

              <!-- Étage 1 -->
              <div 
                class="tier-box tier-1" 
                [class.selected]="selectedTier() === 1"
                (click)="selectedTier.set(1)"
              >
                <div class="tier-badge">ÉTAGE 1 : DOMAINE MÉTIER (Entités &amp; Modèles)</div>
                <div class="tier-title">Entités Pures &amp; Constructeurs</div>
                <div class="tier-action">💥 throw new Error(...) immédiat. ZÉRO try / catch !</div>
              </div>
            </div>

            <!-- Fiche descriptive de l'étage sélectionné -->
            <div class="tier-details-card card-panel">
              <div class="details-header">
                <span class="badge" [class]="tierData().badgeClass">{{ tierData().tierName }}</span>
                <h4>{{ tierData().title }}</h4>
              </div>

              <div class="rules-block mt-2">
                <div class="rule-row">
                  <strong>🎯 Rôle :</strong> {{ tierData().role }}
                </div>
                <div class="rule-row">
                  <strong>⚡ Action :</strong> {{ tierData().action }}
                </div>
                <div class="rule-row highlight">
                  <strong>🔒 Règle de Discipline :</strong> {{ tierData().discipline }}
                </div>
              </div>

              <div class="code-preview-box mt-3">
                <div class="code-title">Exemple de code type :</div>
                <pre><code>{{ tierData().code }}</code></pre>
              </div>
            </div>
          </div>
        </div>

        <!-- PARTIE 2 : TABLEAU DÉCISIONNEL INTERACTIF -->
        <div class="card-panel demo-card mt-3">
          <div class="card-title-row">
            <span class="badge badge-emerald">Matrice Décisionnelle</span>
            <h3>Quand utiliser une Exception (throw) vs une Valeur de retour / Signal ?</h3>
          </div>
          <p class="section-intro">
            Les exceptions coûtent cher en mémoire (construction de la stack trace) et perturbent le flux séquentiel.
            Utilisez ce guide d'arbitrage pour faire le bon choix d'ingénierie :
          </p>

          <div class="decision-table-wrapper">
            <table class="decision-table">
              <thead>
                <tr>
                  <th>Situation Rencontrée</th>
                  <th>Choix Recommandé</th>
                  <th>Justification d'Ingénierie Logicielle</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Violation d'un invariant d'objet</strong><br>
                    <span class="dim">Ex: solde négatif dans le constructeur</span>
                  </td>
                  <td><span class="badge badge-rose">💥 Exception (throw)</span></td>
                  <td>L'objet refuse catégoriquement d'exister dans un état corrompu en RAM.</td>
                </tr>
                <tr>
                  <td>
                    <strong>Saisie utilisateur incomplète dans un formulaire</strong><br>
                    <span class="dim">Ex: email sans caractère &#64;</span>
                  </td>
                  <td><span class="badge badge-indigo">📝 Valeur / Signal</span></td>
                  <td>Un oubli humain est un comportement normal et prévisible, pas une panne système !</td>
                </tr>
                <tr>
                  <td>
                    <strong>Recherche dans une liste retournant 0 élément</strong><br>
                    <span class="dim">Ex: trouverUtilisateurParEmail(liste)</span>
                  </td>
                  <td><span class="badge badge-emerald">🔍 Retourner null ou []</span></td>
                  <td>Ne rien trouver est une issue légitime d'une recherche, pas un dysfonctionnement.</td>
                </tr>
                <tr>
                  <td>
                    <strong>Fichier de configuration vital introuvable au boot</strong><br>
                    <span class="dim">Ex: app-config.json manquant</span>
                  </td>
                  <td><span class="badge badge-rose">💥 Exception (throw)</span></td>
                  <td>L'application ne peut physiquement pas démarrer sans ce fichier : arrêt impératif.</td>
                </tr>
                <tr>
                  <td>
                    <strong>Panne réseau HTTP 503 ou coupure de base de données</strong><br>
                    <span class="dim">Ex: serveur distant injoignable</span>
                  </td>
                  <td><span class="badge badge-rose">💥 Exception (throw)</span></td>
                  <td>Incident extérieur imprévisible rendant l'accomplissement du contrat impossible.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      } @else {
        <!-- ATELIER MONACO LABO 5 -->
        <app-lab-runner [filterLabNumber]="5"></app-lab-runner>
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

    .tiers-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;

      @media (max-width: 950px) {
        grid-template-columns: 1fr;
      }
    }

    .tiers-stack {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .tier-box {
      padding: 14px 18px;
      border-radius: 8px;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      cursor: pointer;
      transition: all 0.25s;

      .tier-badge {
        font-size: 0.7rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        margin-bottom: 4px;
      }

      .tier-title {
        font-size: 0.95rem;
        font-weight: 700;
        color: var(--text-main);
        margin-bottom: 4px;
      }

      .tier-action {
        font-size: 0.78rem;
        color: var(--text-muted);
      }

      &.tier-3 {
        border-left: 4px solid #10b981;
        .tier-badge { color: #34d399; }
      }

      &.tier-2 {
        border-left: 4px solid #6366f1;
        .tier-badge { color: #818cf8; }
      }

      &.tier-1 {
        border-left: 4px solid #f43f5e;
        .tier-badge { color: #f43f5e; }
      }

      &:hover {
        background: var(--bg-card-hover);
        border-color: #6366f1;
      }

      &.selected {
        background: var(--bg-card);
        border-color: #6366f1;
        box-shadow: 0 4px 14px rgba(99, 102, 241, 0.25);
      }
    }

    .tier-arrow {
      text-align: center;
      font-size: 0.74rem;
      font-family: var(--font-mono);
      color: var(--text-dim);
    }

    .tier-details-card {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .details-header {
        display: flex;
        align-items: center;
        gap: 10px;

        h4 {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-main);
        }
      }

      .rules-block {
        display: flex;
        flex-direction: column;
        gap: 6px;
        font-size: 0.82rem;

        .rule-row {
          color: var(--text-muted);
          strong { color: var(--text-main); }

          &.highlight {
            padding: 8px 12px;
            background: rgba(99, 102, 241, 0.1);
            border-radius: 6px;
            border-left: 3px solid #6366f1;
            color: #c7d2fe;
          }
        }
      }

      .code-preview-box {
        .code-title {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--text-dim);
          margin-bottom: 4px;
        }

        pre {
          margin: 0;
          padding: 12px;
          background: var(--bg-code);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          font-family: var(--font-mono);
          font-size: 0.78rem;
          color: var(--text-code);
          line-height: 1.5;
        }
      }
    }

    .decision-table-wrapper {
      overflow-x: auto;
    }

    .decision-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.82rem;

      th, td {
        padding: 12px 14px;
        border-bottom: 1px solid var(--border-color);
        text-align: left;
      }

      th {
        background: var(--bg-subtle);
        color: var(--text-dim);
        font-weight: 700;
        text-transform: uppercase;
        font-size: 0.72rem;
      }

      td {
        color: var(--text-main);
        .dim {
          font-size: 0.74rem;
          color: var(--text-muted);
        }
      }

      tr:hover td {
        background: var(--bg-subtle);
      }
    }
  `]
})
export class ArchitecturalStrategiesComponent {
  readonly activeMode = signal<'interactive' | 'lab'>('interactive');

  readonly selectedTier = signal<number>(2);

  tierData(): {
    tierName: string;
    badgeClass: string;
    title: string;
    role: string;
    action: string;
    discipline: string;
    code: string;
  } {
    const t = this.selectedTier();
    if (t === 1) {
      return {
        tierName: 'Étage 1 · Modèle / Domaine',
        badgeClass: 'badge-rose',
        title: 'Entités Métier & Invariants Purs',
        role: 'Garantir la conformité absolue des règles métier de l\'entreprise.',
        action: 'throw new ... immédiat dès qu\'une précondition ou un invariant est violé.',
        discipline: 'Le domaine ne contient JAMAIS de try / catch ! Il dénonce l\'anomalie sans masquer la faute.',
        code: `class CompteBancaire {
  constructor(public titulaire: string, private solde: number) {
    if (solde < 0) {
      throw new Error("Solde initial négatif interdit");
    }
  }
}`
      };
    } else if (t === 2) {
      return {
        tierName: 'Étage 2 · Services Applicatifs',
        badgeClass: 'badge-indigo',
        title: 'Orchestration & Error Wrapping',
        role: 'Orchestrer les règles d\'affaires, contacter les APIs et persister les données.',
        action: 'Traduit les pannes techniques (HTTP 409, coupure DB) en exceptions de domaine avec { cause } et relance.',
        discipline: 'Ne manipule aucun composant UI ni Signal. Journalise l\'erreur et la propage vers le haut.',
        code: `async reserver(slotId: string): Promise<void> {
  try {
    await this.http.post(\`/slots/\${slotId}\`);
  } catch (err: any) {
    if (err.status === 409) {
      throw new SlotUnavailableError(slotId, new Date(), { cause: err });
    }
    throw err;
  }
}`
      };
    } else {
      return {
        tierName: 'Étage 3 · Présentation UI',
        badgeClass: 'badge-emerald',
        title: 'Composants Angular & Signals Réactifs',
        role: 'Interagir avec l\'utilisateur humain et piloter l\'affichage visuel.',
        action: 'try / catch pour alimenter un Signal d\'erreur. finally pour désactiver les loaders.',
        discipline: 'Ne laisse jamais fuiter d\'erreur brute dans la console. Transforme toute panne en message clair.',
        code: `@Component(...)
export class AtmComponent {
  solde = signal(100);
  erreur = signal<AppError | null>(null);

  onRetirer(m: number) {
    try {
      this.solde.set(this.service.retirer(this.solde(), m));
    } catch (e: unknown) {
      if (e instanceof AppError) this.erreur.set(e);
    }
  }
}`
      };
    }
  }
}
