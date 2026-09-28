import { Component, signal, computed } from '@angular/core';
import { LabRunnerComponent } from '../../shared/components/lab-runner/lab-runner.component';

@Component({
  selector: 'app-interface-pure-contract',
  standalone: true,
  imports: [LabRunnerComponent],
  template: `
    <div class="module-container">
      <header class="module-header">
        <div class="module-tag">Module 03 · Contrats Purs &amp; Composition</div>
        <h2>L'Interface (interface) : Le Contrat Pur</h2>
        <p class="module-desc">
          Une interface est la forme la plus pure d'abstraction en informatique : aucun constructeur, aucun état alloué,
          aucun corps de méthode. Elle définit ce qu'un objet est <em>capable de faire</em>, permettant de relier des objets totalement disparates.
        </p>

        <div class="section-mode-tabs mt-2">
          <button class="mode-tab-btn" [class.active]="activeView() === 'theory'" (click)="activeView.set('theory')">
            <span>🔬 Théorie &amp; Simulateurs Interactifs</span>
          </button>
          <button class="mode-tab-btn" [class.active]="activeView() === 'lab'" (click)="activeView.set('lab')">
            <span>💻 Labo Pratique Monaco (Labo 2)</span>
          </button>
        </div>
      </header>

      @if (activeView() === 'theory') {
        <!-- 1. Métaphore de la prise murale -->
        <section class="card-panel interactive-section">
          <div class="section-title-row">
            <div class="icon-circle plug-icon">🔌</div>
            <div>
              <h3>1. La Métaphore de la Prise Murale (Norme Universelle)</h3>
              <p class="section-subtitle">Branchez différents appareils sur la prise murale <code>interface Alimentable230V</code>.</p>
            </div>
          </div>

          <div class="socket-interactive-grid">
            <div class="socket-left">
              <div class="device-picker-title">Choisissez un appareil à brancher :</div>
              <div class="device-buttons">
                @for (d of devices; track d.name) {
                  <button 
                    class="device-card-btn" 
                    [class.active]="selectedDevice().name === d.name"
                    (click)="selectedDevice.set(d)"
                  >
                    <span class="device-icon">{{ d.icon }}</span>
                    <div class="device-texts">
                      <strong>{{ d.name }}</strong>
                      <span>Consommation : {{ d.watts }} W</span>
                    </div>
                  </button>
                }
              </div>
            </div>

            <div class="socket-display-box">
              <div class="wall-socket">
                <div class="socket-label">PRISE CONTRACTUELLE : interface Alimentable230V</div>
                <div class="socket-holes">
                  <div class="hole"></div>
                  <div class="hole"></div>
                  <div class="earth-pin"></div>
                </div>
              </div>

              <div class="plug-connection-wire">
                <div class="wire-flow" [class.active]="true"></div>
                <span class="plug-status">🔌 Connecté au contrat : <code>appareil.brancher()</code></span>
              </div>

              <div class="device-result-box">
                <div class="device-active-header">
                  <span class="badge badge-success">Objet Conforme au Contrat</span>
                  <strong>{{ selectedDevice().name }}</strong>
                </div>
                <p class="device-output-text">
                  Action : <code>"{{ selectedDevice().action }}"</code>
                </p>
                <div class="device-meta-note">
                  💡 <strong>Constat OO :</strong> Un <em>Grille-pain</em> et un <em>PC Gamer</em> n'ont STRICTEMENT AUCUN ancêtre commun en terme d'héritage de classe.
                  C'est uniquement grâce à l'interface <code>Alimentable230V</code> qu'une fonction <code>alimenter(appareil: Alimentable230V)</code> peut les alimenter tous les deux sans distinction !
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 2. Démonstrateur de Multi-implémentation -->
        <section class="card-panel interactive-section">
          <div class="section-title-row">
            <div class="icon-circle multi-icon">🧩</div>
            <div>
              <h3>2. Démonstrateur de Multi-implémentation (Zéro Collision)</h3>
              <p class="section-subtitle">Comment une classe peut signer plusieurs contrats simultanément sans conflit.</p>
            </div>
          </div>

          <div class="multi-grid">
            <div class="code-preview-box">
              <div class="code-header">
                <span>canard.ts</span>
                <span class="badge badge-ts">class Canard implements Volant, Nageant, Marchant</span>
              </div>
              <pre><code>interface Volant &#123; voler(): string; &#125;
interface Nageant &#123; nager(): string; &#125;
interface Marchant &#123; marcher(): string; &#125;

// La classe signe les 3 contrats sans collision :
class Canard implements Volant, Nageant, Marchant &#123;
  constructor(public nom: string) &#123;&#125;

  voler(): string &#123;
    return this.nom + " déploie ses ailes et s'envole.";
  &#125;

  nager(): string &#123;
    return this.nom + " barbote à la surface de l'eau.";
  &#125;

  marcher(): string &#123;
    return this.nom + " avance en dandinant sur la terre ferme.";
  &#125;
&#125;</code></pre>
            </div>

            <div class="contracts-checklist-card">
              <h4>Contrats Signés par <code>Canard</code> :</h4>
              <div class="contracts-list">
                <div class="contract-badge-item">
                  <span class="badge badge-ts">interface Volant</span>
                  <span class="c-desc">Exige <code>voler(): string</code> · Concrétisé ✔</span>
                </div>
                <div class="contract-badge-item">
                  <span class="badge badge-ts">interface Nageant</span>
                  <span class="c-desc">Exige <code>nager(): string</code> · Concrétisé ✔</span>
                </div>
                <div class="contract-badge-item">
                  <span class="badge badge-ts">interface Marchant</span>
                  <span class="c-desc">Exige <code>marcher(): string</code> · Concrétisé ✔</span>
                </div>
              </div>

              <div class="collision-free-box">
                <div class="cf-title">🛡️ Pourquoi 0 collision de code ?</div>
                <p>
                  Contrairement à l'héritage multiple de classes (où deux classes mères peuvent avoir deux implémentations différentes de la même méthode),
                  les interfaces ne contiennent <strong>aucun corps de code</strong>.
                  La classe fille fournit 100% de la logique concrète : le compilateur n'a aucune ambiguïté à trancher !
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- 3. Composeur d'Interfaces (extends multiple) -->
        <section class="card-panel interactive-section">
          <div class="section-title-row">
            <div class="icon-circle compose-icon">📐</div>
            <div>
              <h3>3. Composeur d'Interfaces : Héritage Multiple de Contrats (<code>extends</code> multiple)</h3>
              <p class="section-subtitle">Assemblez des micro-contrats pour générer une interface composée en temps réel.</p>
            </div>
          </div>

          <div class="composer-grid">
            <div class="composer-selectors">
              <div class="sel-title">Micro-contrats disponibles à combiner :</div>
              <label class="checkbox-label">
                <input type="checkbox" [checked]="hasNommee()" (change)="toggleNommee()">
                <div>
                  <strong>EntiteNommee</strong>
                  <span class="sub"><code>nom: string</code></span>
                </div>
              </label>

              <label class="checkbox-label">
                <input type="checkbox" [checked]="hasHorodatee()" (change)="toggleHorodatee()">
                <div>
                  <strong>Horodatee</strong>
                  <span class="sub"><code>dateCreation: Date; dateMaj: Date;</code></span>
                </div>
              </label>

              <label class="checkbox-label">
                <input type="checkbox" [checked]="hasAuditable()" (change)="toggleAuditable()">
                <div>
                  <strong>Auditable</strong>
                  <span class="sub"><code>auteurId: string; journaliser(): void;</code></span>
                </div>
              </label>
            </div>

            <div class="code-preview-box">
              <div class="code-header">
                <span>contrat-compose.ts</span>
                <span class="badge badge-ts">TypeScript Output</span>
              </div>
              <pre><code>{{ generatedInterfaceCode() }}</code></pre>
            </div>
          </div>
        </section>

        <!-- Callout labo -->
        <div class="callout-footer card-panel">
          <div class="callout-text">
            <h4>Mettez en pratique les interfaces et la multi-implémentation</h4>
            <p>Le Labo 2 contient 4 exercices progressifs sur les contrats purs, la multi-implémentation et readonly.</p>
          </div>
          <button class="btn-primary" (click)="activeView.set('lab')">
            Passer aux 4 Exercices du Labo 2 →
          </button>
        </div>
      } @else {
        <app-lab-runner [labFilter]="2"></app-lab-runner>
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

      &.plug-icon { background: rgba(59, 130, 246, 0.15); }
      &.multi-icon { background: rgba(16, 185, 129, 0.15); }
      &.compose-icon { background: rgba(147, 51, 234, 0.15); }
    }

    .socket-interactive-grid {
      display: grid;
      grid-template-columns: 320px 1fr;
      gap: 20px;
    }

    .device-picker-title {
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--text-dim);
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .device-buttons {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .device-card-btn {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 14px;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      color: var(--text-muted);
      text-align: left;

      &:hover {
        background: var(--bg-card-hover);
        color: var(--text-main);
      }

      &.active {
        background: var(--ts-blue-bg);
        border-color: var(--ts-blue);
        color: var(--ts-blue-light);
      }

      .device-icon { font-size: 1.5rem; }
      .device-texts {
        display: flex;
        flex-direction: column;
        strong { font-size: 0.86rem; color: var(--text-main); }
        span { font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono); }
      }
    }

    .socket-display-box {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    .wall-socket {
      background: var(--bg-card);
      border: 2px solid var(--border-color);
      border-radius: 12px;
      padding: 14px 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;

      .socket-label {
        font-family: var(--font-mono);
        font-size: 0.74rem;
        font-weight: 700;
        color: var(--ts-blue-light);
      }

      .socket-holes {
        display: flex;
        align-items: center;
        gap: 20px;
        position: relative;
        padding: 10px;

        .hole {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #090d16;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.8);
        }

        .earth-pin {
          width: 8px;
          height: 14px;
          border-radius: 2px;
          background: #cbd5e1;
          position: absolute;
          top: -2px;
          left: calc(50% - 4px);
        }
      }
    }

    .plug-connection-wire {
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: var(--font-mono);
      font-size: 0.78rem;
      color: #34d399;
    }

    .device-result-box {
      width: 100%;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 14px 18px;
      display: flex;
      flex-direction: column;
      gap: 8px;

      .device-active-header {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .device-output-text code {
        color: #38bdf8;
        font-size: 0.85rem;
      }

      .device-meta-note {
        font-size: 0.78rem;
        color: var(--text-muted);
        line-height: 1.4;
        background: rgba(49, 120, 198, 0.08);
        padding: 8px 12px;
        border-radius: 6px;
        margin-top: 4px;
      }
    }

    .multi-grid {
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

    .contracts-checklist-card {
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;

      h4 { font-size: 0.95rem; color: var(--text-main); }
    }

    .contracts-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .contract-badge-item {
      display: flex;
      align-items: center;
      gap: 10px;
      background: var(--bg-card);
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 0.78rem;
      font-family: var(--font-mono);
    }

    .collision-free-box {
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: 6px;
      padding: 12px;
      font-size: 0.8rem;
      line-height: 1.4;

      .cf-title {
        font-weight: 700;
        color: #34d399;
        margin-bottom: 4px;
      }
    }

    .composer-grid {
      display: grid;
      grid-template-columns: 320px 1fr;
      gap: 20px;
    }

    .composer-selectors {
      display: flex;
      flex-direction: column;
      gap: 10px;

      .sel-title {
        font-size: 0.8rem;
        font-weight: 700;
        color: var(--text-dim);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
    }

    .checkbox-label {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 10px 12px;
      cursor: pointer;
      user-select: none;

      input { margin-top: 3px; }

      div {
        display: flex;
        flex-direction: column;
        font-size: 0.84rem;
        color: var(--text-main);

        .sub {
          font-family: var(--font-mono);
          font-size: 0.74rem;
          color: var(--text-muted);
        }
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
export class InterfacePureContractComponent {
  readonly activeView = signal<'theory' | 'lab'>('theory');

  readonly devices = [
    { name: 'Grille-pain Moulinex', icon: '🍞', watts: 800, action: 'Les résistances chauffent à 220°C pour griller le pain.' },
    { name: 'PC Gamer Asus ROG', icon: '💻', watts: 650, action: 'Alimentation 12V stabilisée pour processeur et carte graphique.' },
    { name: 'Chargeur Tesla Wallbox', icon: '⚡', watts: 7400, action: 'Recharge rapide en courant alternatif monophasé 32A.' },
    { name: 'Lampe LED Philips', icon: '💡', watts: 9, action: 'Éclairage d\'ambiance blanc chaud 2700K.' }
  ];

  readonly selectedDevice = signal(this.devices[0]);

  readonly hasNommee = signal<boolean>(true);
  readonly hasHorodatee = signal<boolean>(true);
  readonly hasAuditable = signal<boolean>(true);

  toggleNommee(): void { this.hasNommee.update(v => !v); }
  toggleHorodatee(): void { this.hasHorodatee.update(v => !v); }
  toggleAuditable(): void { this.hasAuditable.update(v => !v); }

  readonly generatedInterfaceCode = computed(() => {
    const parents: string[] = [];
    if (this.hasNommee()) parents.push('EntiteNommee');
    if (this.hasHorodatee()) parents.push('Horodatee');
    if (this.hasAuditable()) parents.push('Auditable');

    const extendsClause = parents.length > 0 ? ` extends ${parents.join(', ')}` : '';

    return `// Micro-contrats atomiques :
interface EntiteNommee { nom: string; }
interface Horodatee { dateCreation: Date; dateMaj: Date; }
interface Auditable { auteurId: string; journaliser(): void; }

// Interface résultante composée :
interface UtilisateurComplet${extendsClause} {
  id: string;
  email: string;
}`;
  });
}
