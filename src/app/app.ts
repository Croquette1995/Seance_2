import { Component, inject } from '@angular/core';
import { NavigationService } from './core/services/navigation.service';
import { MonacoLoaderService } from './core/services/monaco-loader.service';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';

// Les 8 modules interactifs de la Séance 10 + Ateliers Monaco
import { SentinelVsExceptionsComponent } from './features/01-sentinel-vs-exceptions/sentinel-vs-exceptions.component';
import { StackUnwindingComponent } from './features/02-stack-unwinding/stack-unwinding.component';
import { TryCatchFinallyComponent } from './features/03-try-catch-finally/try-catch-finally.component';
import { ErrorObjectStrictTypingComponent } from './features/04-error-object-strict-typing/error-object-strict-typing.component';
import { CustomDomainErrorsComponent } from './features/05-custom-domain-errors/custom-domain-errors.component';
import { FilteringPolymorphismComponent } from './features/06-filtering-polymorphism/filtering-polymorphism.component';
import { ArchitecturalStrategiesComponent } from './features/07-architectural-strategies/architectural-strategies.component';
import { AtmSimulatorComponent } from './features/08-atm-simulator/atm-simulator.component';
import { WorkshopsLabComponent } from './features/workshops-lab/workshops-lab.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    SidebarComponent,
    SentinelVsExceptionsComponent,
    StackUnwindingComponent,
    TryCatchFinallyComponent,
    ErrorObjectStrictTypingComponent,
    CustomDomainErrorsComponent,
    FilteringPolymorphismComponent,
    ArchitecturalStrategiesComponent,
    AtmSimulatorComponent,
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
