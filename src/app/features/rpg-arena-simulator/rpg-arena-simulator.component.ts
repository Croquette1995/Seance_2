import { Component, signal, computed } from '@angular/core';
import { LabRunnerComponent } from '../../shared/components/lab-runner/lab-runner.component';

// =========================================================================
// MODÈLE ORIENTÉ OBJET DE L'ARÈNE
// =========================================================================

export interface CombatResult {
  valeur: number;
  message: string;
}

export interface Soigneur {
  soigner(cible: Personnage): CombatResult;
}

export function isSoigneur(cible: any): cible is Soigneur {
  return Boolean(cible && typeof cible.soigner === 'function');
}

export abstract class Personnage {
  pv: number;

  constructor(
    public readonly nom: string,
    public readonly pvMax: number,
    public force: number,
    public readonly classeName: string,
    public readonly avatar: string
  ) {
    this.pv = pvMax;
  }

  recevoirDegats(degats: number): void {
    this.pv = Math.max(0, this.pv - degats);
  }

  recevoirSoin(soin: number): void {
    this.pv = Math.min(this.pvMax, this.pv + soin);
  }

  abstract attaquer(cible: Personnage): CombatResult;
}

export class Guerrier extends Personnage {
  constructor(nom: string, pvMax: number = 140, force: number = 28) {
    super(nom, pvMax, force, 'Guerrier', '🛡️');
  }

  attaquer(cible: Personnage): CombatResult {
    const degats = Math.round(this.force * (0.9 + Math.random() * 0.3));
    cible.recevoirDegats(degats);
    return {
      valeur: degats,
      message: `${this.nom} tranche violemment avec son épée à deux mains et inflige ${degats} dégâts !`
    };
  }
}

export class Mage extends Personnage implements Soigneur {
  constructor(nom: string, pvMax: number = 85, force: number = 18) {
    super(nom, pvMax, force, 'Mage', '🧙‍♂️');
  }

  attaquer(cible: Personnage): CombatResult {
    const degats = Math.round(this.force * (1.1 + Math.random() * 0.4));
    cible.recevoirDegats(degats);
    return {
      valeur: degats,
      message: `${this.nom} canalise une sphère d'énergie arcanique et inflige ${degats} dégâts magiques !`
    };
  }

  soigner(cible: Personnage): CombatResult {
    const soin = 35;
    cible.recevoirSoin(soin);
    return {
      valeur: soin,
      message: `${this.nom} invoque une pluie céleste de guérison : +${soin} PV rendus à ${cible.nom} !`
    };
  }
}

export class Archer extends Personnage {
  constructor(nom: string, pvMax: number = 95, force: number = 24) {
    super(nom, pvMax, force, 'Archer', '🏹');
  }

  attaquer(cible: Personnage): CombatResult {
    const degats = Math.round(this.force * (1.0 + Math.random() * 0.35));
    cible.recevoirDegats(degats);
    return {
      valeur: degats,
      message: `${this.nom} décoche une flèche précise en plein cœur et inflige ${degats} dégâts perforants !`
    };
  }
}

export class Monstre extends Personnage {
  constructor(nom: string = 'Dragon Noir', pvMax: number = 300, force: number = 20) {
    super(nom, pvMax, force, 'Boss', '🐉');
  }

  attaquer(cible: Personnage): CombatResult {
    const degats = Math.round(this.force * (0.8 + Math.random() * 0.4));
    cible.recevoirDegats(degats);
    return {
      valeur: degats,
      message: `${this.nom} crache un souffle de flammes ténébreuses sur ${cible.nom} (-${degats} PV) !`
    };
  }
}

// =========================================================================
// COMPOSANT ANGULAR DE L'ARÈNE
// =========================================================================

@Component({
  selector: 'app-rpg-arena-simulator',
  standalone: true,
  imports: [LabRunnerComponent],
  template: `
    <div class="module-container">
      <header class="module-header">
        <div class="module-tag">Module 07 · Démonstration Vivante &amp; OCP</div>
        <h2>Le Simulateur Live : L'Arène des Héros RPG</h2>
        <p class="module-desc">
          L'aboutissement de toutes les notions du cours réunies : une collection polymorphe <code>Personnage[]</code> orchestrée sans aucun <code>switch</code> ni <code>if (type === ...)</code>,
          le contrat <code>Soigneur</code> activé par Type Guard, et l'injection dynamique d'une nouvelle classe (Principe Ouvert/Fermé).
        </p>

        <div class="section-mode-tabs mt-2">
          <button class="mode-tab-btn" [class.active]="activeView() === 'theory'" (click)="activeView.set('theory')">
            <span>🔬 Arène Interactive &amp; Extensibilité</span>
          </button>
          <button class="mode-tab-btn" [class.active]="activeView() === 'lab'" (click)="activeView.set('lab')">
            <span>💻 Labo Pratique Monaco (Labo 5)</span>
          </button>
        </div>
      </header>

      @if (activeView() === 'theory') {
        <!-- Zone de combat interactive -->
        <div class="arena-stage-layout">
          <!-- Équipe des Héros (Polymorphisme & Signals) -->
          <div class="heroes-bench-panel card-panel">
            <div class="bench-header">
              <div>
                <h3>Équipe des Héros (<code>Personnage[]</code>)</h3>
                <span class="sub-counter">{{ heroes().length }} combattants actifs</span>
              </div>
              <button class="btn-ghost" (click)="resetArena()" title="Réinitialiser l'arène">↺ Réinitialiser</button>
            </div>

            <div class="heroes-list">
              @for (hero of heroes(); track hero.nom) {
                <div class="hero-card" [class.dead]="hero.pv <= 0">
                  <div class="hero-avatar">{{ hero.avatar }}</div>
                  <div class="hero-info">
                    <div class="hero-name-row">
                      <strong>{{ hero.nom }}</strong>
                      <span class="badge badge-ts">{{ hero.classeName }}</span>
                      @if (checkIsHealer(hero)) {
                        <span class="badge badge-success">✨ Soigneur</span>
                      }
                    </div>

                    <!-- Jauge PV -->
                    <div class="hp-gauge">
                      <div class="hp-track">
                        <div class="hp-fill" [style.width.%]="(hero.pv / hero.pvMax) * 100"></div>
                      </div>
                      <span class="hp-text">{{ hero.pv }} / {{ hero.pvMax }} PV</span>
                    </div>
                  </div>
                </div>
              }
            </div>

            <!-- Actions Polymorphes -->
            <div class="actions-toolbar">
              <button class="btn-primary" (click)="triggerPolymorphicAttackRound()" [disabled]="boss().pv <= 0 || allHeroesDead()">
                ⚔️ Tour d'Attaque Polymorphe (0 switch / 0 if)
              </button>
              <button class="btn-secondary" (click)="triggerHealerAction()" [disabled]="!hasLivingHealer() || boss().pv <= 0">
                ✨ Déclencher Soin (via Type Guard isSoigneur)
              </button>
            </div>
          </div>

          <!-- L'Ennemi : Le Boss -->
          <div class="boss-panel card-panel">
            <div class="boss-header">
              <span class="badge badge-red">Adversaire</span>
              <h3>{{ boss().nom }}</h3>
            </div>

            <div class="boss-avatar-box">
              <span class="boss-big-icon" [class.hurt]="isBossHurt()">{{ boss().avatar }}</span>
            </div>

            <div class="hp-gauge boss-gauge">
              <div class="hp-track">
                <div class="hp-fill boss-fill" [style.width.%]="(boss().pv / boss().pvMax) * 100"></div>
              </div>
              <span class="hp-text">{{ boss().pv }} / {{ boss().pvMax }} PV</span>
            </div>

            <div class="boss-status-text">
              @if (boss().pv <= 0) {
                <span class="victory-tag">🎉 VICTOIRE ! Le Boss a été vaincu !</span>
              } @else if (allHeroesDead()) {
                <span class="defeat-tag">💀 DÉFAITE ! Tous les héros sont tombés !</span>
              } @else {
                <span class="combat-tag">En combat · Prêt à riposter</span>
              }
            </div>
          </div>
        </div>

        <!-- Volet d'Extensibilité OCP (Ajout de nouvelle classe sans toucher au contrôleur) -->
        <section class="card-panel ocp-section">
          <div class="section-title-row">
            <div class="icon-circle ocp-icon">🏹</div>
            <div>
              <h3>Démonstration du Principe Ouvert/Fermé (OCP) : Injecter une nouvelle classe</h3>
              <p class="section-subtitle">
                Ajoutez un <code>Archer extends Personnage</code> sans modifier une seule ligne du code de combat de l'arène !
              </p>
            </div>
          </div>

          <div class="ocp-content-box">
            <div class="ocp-explainer">
              <p>
                Le contrôleur de l'arène manipule un tableau <code>Personnage[]</code>. Il appelle simplement <code>p.attaquer(boss)</code>.
                Tant qu'une nouvelle classe respecte la signature abstraite <code>attaquer()</code>, elle s'intègre immédiatement sans régression.
              </p>
              <button 
                class="btn-secondary" 
                (click)="injectNewArcher()" 
                [disabled]="hasArcherAlready()"
              >
                {{ hasArcherAlready() ? '✔ Archer déjà recruté dans l\'équipe' : '➕ Instancier & Injecter new Archer("Robin")' }}
              </button>
            </div>

            <div class="code-preview-box">
              <div class="code-header">
                <span>archer.ts (Aucune modification requise dans l'arène !)</span>
                <span class="badge badge-success">OCP Validé</span>
              </div>
              <pre><code>class Archer extends Personnage &#123;
  constructor(nom: string) &#123;
    super(nom, 95, 24, "Archer", "🏹");
  &#125;
  attaquer(cible: Personnage): CombatResult &#123;
    return &#123;
      valeur: 24,
      message: this.nom + " décoche une flèche précise !"
    &#125;;
  &#125;
&#125;</code></pre>
            </div>
          </div>
        </section>

        <!-- Journal de Combat (Logs temps réel) -->
        <section class="card-panel combat-logs-section">
          <div class="log-panel-header">
            <h4>📜 Journal des Événements Polymorphes</h4>
            <button class="btn-ghost" (click)="clearCombatLogs()">Effacer les logs</button>
          </div>

          <div class="combat-log-stream">
            @for (log of combatLogs(); track $index) {
              <div class="combat-log-entry" [class]="log.type">
                <span class="log-bullet">•</span>
                <span class="log-msg">{{ log.text }}</span>
              </div>
            }
          </div>
        </section>

        <!-- Callout labo -->
        <div class="callout-footer card-panel">
          <div class="callout-text">
            <h4>Consolidez l'architecture polymorphe avec le Labo 5</h4>
            <p>Créez votre propre moteur de traitement polymorphe agnostique et prouvez le respect d'OCP sur Monaco Editor.</p>
          </div>
          <button class="btn-primary" (click)="activeView.set('lab')">
            Passer aux Exercices du Labo 5 →
          </button>
        </div>
      } @else {
        <app-lab-runner [labFilter]="5"></app-lab-runner>
      }
    </div>
  `,
  styles: [`
    .mt-2 { margin-top: 8px; }
    .arena-stage-layout {
      display: grid;
      grid-template-columns: 1fr 340px;
      gap: 20px;
    }

    .heroes-bench-panel {
      display: flex;
      flex-direction: column;
      gap: 16px;

      .bench-header {
        display: flex;
        align-items: center;
        justify-content: space-between;

        h3 { font-size: 1.1rem; font-weight: 700; color: var(--text-main); }
        .sub-counter { font-size: 0.78rem; color: var(--text-dim); }
      }
    }

    .heroes-list {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .hero-card {
      display: flex;
      align-items: center;
      gap: 14px;
      background: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 12px 14px;
      transition: all 0.2s;

      &.dead {
        opacity: 0.45;
        border-color: rgba(239, 68, 68, 0.4);
      }

      .hero-avatar {
        font-size: 2rem;
      }

      .hero-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .hero-name-row {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;

        strong { font-size: 0.9rem; color: var(--text-main); }
      }
    }

    .hp-gauge {
      display: flex;
      flex-direction: column;
      gap: 3px;

      .hp-track {
        height: 6px;
        background: rgba(255, 255, 255, 0.08);
        border-radius: 3px;
        overflow: hidden;
      }

      .hp-fill {
        height: 100%;
        background: linear-gradient(90deg, #10b981, #34d399);
        transition: width 0.3s ease;
      }

      .hp-text {
        font-size: 0.72rem;
        color: var(--text-dim);
        font-family: var(--font-mono);
      }
    }

    .actions-toolbar {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-top: 4px;
    }

    .boss-panel {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 14px;
      background: linear-gradient(180deg, var(--bg-card), var(--bg-subtle));
      border-color: rgba(239, 68, 68, 0.3);

      .boss-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;

        h3 { font-size: 1.2rem; font-weight: 800; color: #f87171; }
      }
    }

    .boss-avatar-box {
      width: 110px;
      height: 110px;
      border-radius: 50%;
      background: rgba(239, 68, 68, 0.1);
      border: 2px solid rgba(239, 68, 68, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;

      .boss-big-icon {
        font-size: 3.5rem;
        transition: transform 0.2s;

        &.hurt {
          transform: scale(0.85) rotate(-10deg);
        }
      }
    }

    .boss-gauge {
      width: 80%;

      .boss-fill {
        background: linear-gradient(90deg, #ef4444, #f97316);
      }
    }

    .boss-status-text {
      font-size: 0.8rem;
      font-weight: 700;

      .victory-tag { color: #34d399; }
      .defeat-tag { color: #f87171; }
      .combat-tag { color: var(--text-muted); }
    }

    .ocp-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
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

      &.ocp-icon { background: rgba(245, 158, 11, 0.15); }
    }

    .ocp-content-box {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      align-items: center;
    }

    .ocp-explainer {
      display: flex;
      flex-direction: column;
      gap: 12px;
      font-size: 0.88rem;
      line-height: 1.5;
      color: var(--text-muted);
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

    .combat-logs-section {
      display: flex;
      flex-direction: column;
      gap: 10px;

      .log-panel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;

        h4 { font-size: 0.95rem; font-weight: 700; color: var(--text-main); }
      }
    }

    .combat-log-stream {
      background: var(--terminal-bg);
      border-radius: 8px;
      padding: 12px 16px;
      max-height: 180px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-family: var(--font-mono);
      font-size: 0.8rem;
    }

    .combat-log-entry {
      display: flex;
      align-items: flex-start;
      gap: 8px;

      &.hero { color: #93c5fd; }
      &.heal { color: #6ee7b7; font-weight: 600; }
      &.boss { color: #fca5a5; }
      &.system { color: #fbbf24; }
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
export class RpgArenaSimulatorComponent {
  readonly activeView = signal<'theory' | 'lab'>('theory');

  readonly heroes = signal<Personnage[]>([
    new Guerrier('Arthur', 140, 30),
    new Mage('Merlin', 85, 20)
  ]);

  readonly boss = signal<Monstre>(new Monstre('Dragon Noir', 250, 22));
  readonly isBossHurt = signal<boolean>(false);

  readonly combatLogs = signal<Array<{ text: string; type: 'hero' | 'heal' | 'boss' | 'system' }>>([
    { text: 'Arène initialisée : Arthur (Guerrier) et Merlin (Mage) font face au Dragon Noir.', type: 'system' }
  ]);

  readonly allHeroesDead = computed(() => {
    return this.heroes().every(h => h.pv <= 0);
  });

  readonly hasLivingHealer = computed(() => {
    return this.heroes().some(h => h.pv > 0 && isSoigneur(h));
  });

  readonly hasArcherAlready = computed(() => {
    return this.heroes().some(h => h instanceof Archer);
  });

  checkIsHealer(p: Personnage): boolean {
    return isSoigneur(p);
  }

  triggerPolymorphicAttackRound(): void {
    const currentBoss = this.boss();
    if (currentBoss.pv <= 0) return;

    this.isBossHurt.set(true);
    setTimeout(() => this.isBossHurt.set(false), 300);

    // DÉCLENCHEMENT POLYMORPHE PUR SANS AUCUN SWITCH NI IF TYPE
    for (const hero of this.heroes()) {
      if (hero.pv > 0 && currentBoss.pv > 0) {
        const res = hero.attaquer(currentBoss);
        this.addLog(res.message, 'hero');
      }
    }

    // Riposte du Boss si encore vivant
    if (currentBoss.pv > 0) {
      const livingHeroes = this.heroes().filter(h => h.pv > 0);
      if (livingHeroes.length > 0) {
        const randomTarget = livingHeroes[Math.floor(Math.random() * livingHeroes.length)];
        const bossRes = currentBoss.attaquer(randomTarget);
        this.addLog(bossRes.message, 'boss');
      }
    } else {
      this.addLog(`🎉 Le ${currentBoss.nom} s'effondre dans un râle déchirant ! Victoire des héros !`, 'system');
    }
  }

  triggerHealerAction(): void {
    // Utilisation sécurisée du Type Guard
    const livingHealers = this.heroes().filter(h => h.pv > 0 && isSoigneur(h));
    if (livingHealers.length === 0) return;

    const healer = livingHealers[0];
    if (isSoigneur(healer)) {
      // Trouver le héros le plus blessé
      const wounded = [...this.heroes()]
        .filter(h => h.pv > 0 && h.pv < h.pvMax)
        .sort((a, b) => (a.pv / a.pvMax) - (b.pv / b.pvMax))[0];

      if (wounded) {
        const res = healer.soigner(wounded);
        this.addLog(res.message, 'heal');
      } else {
        this.addLog(`${healer.nom} scrute ses alliés : tout le monde est déjà à pleine santé !`, 'system');
      }
    }
  }

  injectNewArcher(): void {
    if (this.hasArcherAlready()) return;

    const newArcher = new Archer('Robin');
    this.heroes.update(list => [...list, newArcher]);
    this.addLog(`🏹 EXTENSIBILITÉ OCP : Robin (Archer) rejoint l'arène sans modifier 1 seule ligne du contrôleur de combat !`, 'system');
  }

  resetArena(): void {
    this.heroes.set([
      new Guerrier('Arthur', 140, 30),
      new Mage('Merlin', 85, 20)
    ]);
    this.boss.set(new Monstre('Dragon Noir', 250, 22));
    this.combatLogs.set([
      { text: 'Arène réinitialisée. Les héros sont prêts au combat.', type: 'system' }
    ]);
  }

  clearCombatLogs(): void {
    this.combatLogs.set([]);
  }

  private addLog(text: string, type: 'hero' | 'heal' | 'boss' | 'system'): void {
    this.combatLogs.update(logs => [{ text, type }, ...logs.slice(0, 30)]);
  }
}
