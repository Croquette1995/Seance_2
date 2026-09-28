import { Component, inject } from '@angular/core';
import { NavigationService } from './core/services/navigation.service';
import { MonacoLoaderService } from './core/services/monaco-loader.service';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';

// Les 7 modules interactifs de la Séance 8 + le Laboratoire Global
import { WhyAbstractionComponent } from './features/why-abstraction/why-abstraction.component';
import { AbstractClassAnatomyComponent } from './features/abstract-class-anatomy/abstract-class-anatomy.component';
import { InterfacePureContractComponent } from './features/interface-pure-contract/interface-pure-contract.component';
import { DuckTypingRuntimeCostComponent } from './features/duck-typing-runtime-cost/duck-typing-runtime-cost.component';
import { DecisionTreeHybridComponent } from './features/decision-tree-hybrid/decision-tree-hybrid.component';
import { PitfallsTypeGuardsComponent } from './features/pitfalls-type-guards/pitfalls-type-guards.component';
import { RpgArenaSimulatorComponent } from './features/rpg-arena-simulator/rpg-arena-simulator.component';
import { WorkshopsLabComponent } from './features/workshops-lab/workshops-lab.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    SidebarComponent,
    WhyAbstractionComponent,
    AbstractClassAnatomyComponent,
    InterfacePureContractComponent,
    DuckTypingRuntimeCostComponent,
    DecisionTreeHybridComponent,
    PitfallsTypeGuardsComponent,
    RpgArenaSimulatorComponent,
    WorkshopsLabComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  readonly nav = inject(NavigationService);
  private readonly monacoLoader = inject(MonacoLoaderService);

  constructor() {
    // Préchargement de Monaco Editor pour une disponibilité instantanée
    this.monacoLoader.init().catch(err => {
      console.warn('[App] Préchargement Monaco :', err);
    });
  }
}
