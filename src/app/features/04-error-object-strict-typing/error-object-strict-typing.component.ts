import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LabRunnerComponent } from '../../shared/components/lab-runner/lab-runner.component';

@Component({
  selector: 'app-error-object-strict-typing',
  standalone: true,
  imports: [CommonModule, FormsModule, LabRunnerComponent],
  template: `
    <div class="module-container">
      <div class="module-header">
        <div class="module-tag-row">
          <span class="module-tag">MODULE 04 · TYPAGE STRICT &amp; JS RUNTIME</span>
          <span class="badge badge-purple">unknown vs any</span>
        </div>
        <h2>L'Objet Error &amp; Typage Strict TypeScript</h2>
        <p class="module-desc">
          En JavaScript, on peut jeter absolument n'importe quoi (<code>throw null</code>, <code>throw "texte"</code>).
          Comprenez pourquoi <code>catch (e: any)</code> provoque un second crash fatal et comment le typage strict <code>unknown</code> avec <em>narrowing</em> rend votre code invulnérable.
        </p>
      </div>

      <div class="section-mode-tabs">
        <button class="mode-tab-btn" [class.active]="activeMode() === 'interactive'" (click)="activeMode.set('interactive')">
          <span>💥 Inspecteur d'Erreur &amp; Laboratoire any vs unknown</span>
        </button>
        <button class="mode-tab-btn" [class.active]="activeMode() === 'lab'" (click)="activeMode.set('lab')">
          <span>💻 Atelier Monaco (Labo 3 · Typage Strict &amp; Narrowing)</span>
        </button>
      </div>

      @if (activeMode() === 'interactive') {
        <!-- PARTIE 1 : COMPARATEUR DANGER DE ANY VS SÉCURITÉ DE UNKNOWN -->
        <div class="card-panel demo-card">
          <div class="card-title-row">
            <span class="badge badge-rose">Laboratoire de Résilience</span>
            <h3>Le Danger Mortel de any vs La Sécurité de unknown</h3>
          </div>
          <p class="section-intro">
            Sélectionnez un type d'élément jeté par <code>throw</code> et observez la réaction des deux gestionnaires d'erreurs :
          </p>

          <div class="throw-selection-row">
            <span class="ctrl-title">Sélectionnez la valeur lancée par throw :</span>
            <div class="buttons-row mt-1">
              <button 
                class="choice-btn" 
                [class.active]="thrownValueType() === 'error'"
                (click)="setThrownType('error')"
              >
                1. throw new Error("Connexion perdue")
              </button>
              <button 
                class="choice-btn" 
                [class.active]="thrownValueType() === 'string'"
                (click)="setThrownType('string')"
              >
                2. throw "Oups, simple chaîne brute"
              </button>
              <button 
                class="choice-btn" 
                [class.active]="thrownValueType() === 'number'"
                (click)="setThrownType('number')"
              >
                3. throw 503
              </button>
              <button 
                class="choice-btn" 
                [class.active]="thrownValueType() === 'null'"
                (click)="setThrownType('null')"
              >
                4. throw null (Le crash fatal)
              </button>
            </div>
          </div>

          <div class="comparison-grid mt-3">
            <!-- Colonne 1 : Le piège de any -->
            <div class="comparison-col col-any">
              <div class="col-header">
                <span class="badge badge-rose">❌ Anti-pattern</span>
                <h4>catch (error: any)</h4>
              </div>
              <pre class="code-box"><code>try &#123;
  lancerOperation();
&#125; catch (error: <span class="hl-red">any</span>) &#123;
  <span class="dim">// Accès aveugle sans vérification :</span>
  console.log(error.message.toUpperCase());
&#125;</code></pre>
              <div class="runtime-verdict" [class.crash]="isAnyCrashing()">
                <div class="verdict-title">{{ isAnyCrashing() ? '💥 SECOND CRASH FATAL (TypeError) !' : '✅ Exécution sans plantage' }}</div>
                <div class="verdict-desc">{{ anyExplanation() }}</div>
              </div>
            </div>

            <!-- Colonne 2 : La sécurité de unknown -->
            <div class="comparison-col col-unknown">
              <div class="col-header">
                <span class="badge badge-emerald">🛡️ Pratique Recommandée</span>
                <h4>catch (error: unknown) + Narrowing</h4>
              </div>
              <pre class="code-box"><code>try &#123;
  lancerOperation();
&#125; catch (error: <span class="hl-green">unknown</span>) &#123;
  if (error instanceof Error) &#123;
    console.error(error.message.toUpperCase());
  &#125; else if (typeof error === 'string') &#123;
    console.error(error.toUpperCase());
  &#125; else &#123;
    console.error("Erreur inconnue :", String(error));
  &#125;
&#125;</code></pre>
              <div class="runtime-verdict safe">
                <div class="verdict-title">🛡️ 100% SÉCURISÉ AU RUNTIME</div>
                <div class="verdict-desc">{{ unknownExplanation() }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- PARTIE 2 : INSPECTEUR DE L'OBJET ERROR & ERREURS NATIVES -->
        <div class="card-panel demo-card mt-3">
          <div class="card-title-row">
            <span class="badge badge-indigo">Inspecteur Standard</span>
            <h3>Anatomie de l'Objet Error &amp; Spécialisations Natives JS</h3>
          </div>
          <p class="section-intro">
            Décomposition interactive des propriétés d'une exception moderne (avec ES2022 <code>cause</code>).
          </p>

          <div class="error-inspector-layout">
            <div class="props-list">
              <div class="prop-item">
                <div class="prop-name">error.name</div>
                <div class="prop-val text-indigo font-bold">"Error" (ou "TypeError", "SoldeInsuffisantError")</div>
                <div class="prop-desc">Identifiant du type ou nom de la classe d'anomalie.</div>
              </div>

              <div class="prop-item">
                <div class="prop-name">error.message</div>
                <div class="prop-val text-emerald font-bold">"Impossible de joindre le serveur API"</div>
                <div class="prop-desc">Description compréhensible transmise au constructeur.</div>
              </div>

              <div class="prop-item">
                <div class="prop-name">error.stack</div>
                <div class="prop-val font-mono text-dim text-xs">
                  Error: Impossible de joindre le serveur<br>
                  &nbsp;&nbsp;at ApiService.fetchData (api.service.ts:42:15)<br>
                  &nbsp;&nbsp;at ProfileComponent.ngOnInit (profile.component.ts:18:22)
                </div>
                <div class="prop-desc">Photographie exacte de la pile d'appels au moment de new Error().</div>
              </div>

              <div class="prop-item">
                <div class="prop-name">error.cause (ES2022+)</div>
                <div class="prop-val text-amber font-bold">&#123; status: 503, statusText: "Service Unavailable" &#125;</div>
                <div class="prop-desc">L'erreur technique originelle encapsulée sans écraser la preuve.</div>
              </div>
            </div>

            <!-- Tableau des erreurs natives JS -->
            <div class="native-errors-table card-panel">
              <div class="table-title">Sous-classes d'Error intégrées au moteur JavaScript :</div>
              <div class="table-rows">
                <div class="table-row">
                  <span class="badge badge-rose">TypeError</span>
                  <span>Opération sur null/undefined ou incompatibilité de type runtime.</span>
                </div>
                <div class="table-row">
                  <span class="badge badge-amber">RangeError</span>
                  <span>Nombre hors bornes (ex: <code>new Array(-1)</code> ou récursion infinie).</span>
                </div>
                <div class="table-row">
                  <span class="badge badge-purple">ReferenceError</span>
                  <span>Accès à une variable inconnue ou non déclarée dans la portée.</span>
                </div>
                <div class="table-row">
                  <span class="badge badge-indigo">SyntaxError</span>
                  <span>Analyse grammaticale échouée (ex: <code>JSON.parse("...")</code> invalide).</span>
                </div>
                <div class="table-row">
                  <span class="badge badge-cyan">URIError</span>
                  <span>Paramètre invalide dans <code>decodeURIComponent()</code>.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      } @else {
        <!-- ATELIER MONACO LABO 3 -->
        <app-lab-runner [filterLabNumber]="3"></app-lab-runner>
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

    .throw-selection-row {
      display: flex;
      flex-direction: column;
      gap: 6px;

      .ctrl-title {
        font-size: 0.78rem;
        font-weight: 700;
        text-transform: uppercase;
        color: var(--text-muted);
      }
    }

    .buttons-row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .choice-btn {
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 0.8rem;
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

    .comparison-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .comparison-col {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;

      .col-header {
        display: flex;
        align-items: center;
        gap: 10px;

        h4 {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-main);
          font-family: var(--font-mono);
        }
      }

      .code-box {
        margin: 0;
        padding: 12px;
        background: var(--bg-code);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        font-size: 0.8rem;
        font-family: var(--font-mono);
        line-height: 1.5;
        color: var(--text-code);
      }
    }

    .runtime-verdict {
      padding: 12px;
      border-radius: 6px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);

      .verdict-title {
        font-size: 0.84rem;
        font-weight: 800;
        margin-bottom: 4px;
      }

      .verdict-desc {
        font-size: 0.8rem;
        line-height: 1.4;
      }

      &.crash {
        border-color: #f43f5e;
        background: rgba(244, 63, 94, 0.12);
        color: #fca5a5;
      }

      &.safe {
        border-color: #10b981;
        background: rgba(16, 185, 129, 0.12);
        color: #86efac;
      }
    }

    .hl-red { color: #f43f5e; font-weight: 700; }
    .hl-green { color: #34d399; font-weight: 700; }
    .dim { color: #64748b; }

    .error-inspector-layout {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 16px;

      @media (max-width: 950px) {
        grid-template-columns: 1fr;
      }
    }

    .props-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .prop-item {
      padding: 10px 14px;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 6px;

      .prop-name {
        font-size: 0.76rem;
        font-family: var(--font-mono);
        color: #818cf8;
        font-weight: 700;
        margin-bottom: 2px;
      }

      .prop-val {
        font-size: 0.84rem;
        margin-bottom: 2px;
      }

      .prop-desc {
        font-size: 0.74rem;
        color: var(--text-muted);
      }
    }

    .text-indigo { color: #818cf8; }
    .text-emerald { color: #34d399; }
    .text-amber { color: #fbbf24; }
    .text-dim { color: #94a3b8; }

    .native-errors-table {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;

      .table-title {
        font-size: 0.8rem;
        font-weight: 700;
        text-transform: uppercase;
        color: var(--text-muted);
      }

      .table-rows {
        display: flex;
        flex-direction: column;
        gap: 8px;
        font-size: 0.8rem;
      }

      .table-row {
        display: flex;
        align-items: center;
        gap: 10px;
        color: var(--text-muted);
      }
    }
  `]
})
export class ErrorObjectStrictTypingComponent {
  readonly activeMode = signal<'interactive' | 'lab'>('interactive');

  readonly thrownValueType = signal<'error' | 'string' | 'number' | 'null'>('string');

  setThrownType(type: 'error' | 'string' | 'number' | 'null'): void {
    this.thrownValueType.set(type);
  }

  isAnyCrashing(): boolean {
    const t = this.thrownValueType();
    return t === 'string' || t === 'number' || t === 'null';
  }

  anyExplanation(): string {
    const t = this.thrownValueType();
    if (t === 'error') {
      return 'error possède bien .message, donc toUpperCase() fonctionne par chance.';
    } else if (t === 'string') {
      return 'error est une simple string ("Oups"). Accéder à error.message renvoie undefined. Exécuter undefined.toUpperCase() déclenche un SECOND CRASH irrémédiable !';
    } else if (t === 'number') {
      return 'error vaut 503. 503.message vaut undefined -> crash fatal immédiat.';
    } else {
      return 'error vaut null. Accéder à error.message déclenche : TypeError: Cannot read properties of null ! Le gestionnaire d\'erreurs plante lui-même !';
    }
  }

  unknownExplanation(): string {
    const t = this.thrownValueType();
    if (t === 'error') {
      return 'Le garde if (error instanceof Error) est franchi avec succès : TypeScript autorise l\'accès à .message en toute sécurité.';
    } else if (t === 'string') {
      return 'La branche else if (typeof error === "string") intercepte la chaîne et applique toUpperCase() directement sur la variable affinée en string !';
    } else if (t === 'number') {
      return 'La branche else résiduelle convertit le nombre en texte String(503) sans aucun plantage.';
    } else {
      return 'La branche else résiduelle convertit null en String(null) -> "null". ZÉRO crash, résilience absolue garantie !';
    }
  }
}
