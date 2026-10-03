import { Injectable, signal } from '@angular/core';
import { TabId, ModuleSection } from '../models/app.models';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  readonly activeTab = signal<TabId>('sentinel-vs-exceptions');
  readonly isSidebarCollapsed = signal<boolean>(false);

  readonly modules: ModuleSection[] = [
    {
      id: 'sentinel-vs-exceptions',
      index: 1,
      title: 'Le Problème : Codes Sentinelles vs Rupture de Flux',
      shortTitle: 'Codes Sentinelles vs Rupture',
      icon: 'alert-circle',
      badge: '-1 vs throw',
      description: 'Codes de retour magiques, corruption silencieuse de mémoire et labyrinthe de propagation manuelle.',
      labNumber: 1,
      exerciseCount: 4
    },
    {
      id: 'stack-unwinding',
      index: 2,
      title: 'Le Mécanisme & Déroulement de Pile (Stack Unwinding)',
      shortTitle: 'Déroulement de Pile (Unwinding)',
      icon: 'layers',
      badge: 'Call Stack & Invariants',
      description: 'Ascenseur du runtime, dépilement automatique, crash par exception non interceptée et protection des constructeurs.',
      labNumber: 1,
      exerciseCount: 4
    },
    {
      id: 'try-catch-finally',
      index: 3,
      title: 'Anatomie de try / catch / finally & La Garantie de Libération',
      shortTitle: 'try / catch / finally & Libération',
      icon: 'shield-check',
      badge: 'Garantie 100%',
      description: 'Traqueur de flux nominal/erreur/return anticipé, libération de ressources critiques et anti-pattern du return dans finally.',
      labNumber: 2,
      exerciseCount: 4
    },
    {
      id: 'error-object-strict-typing',
      index: 4,
      title: 'L\'Objet Error & Typage Strict TypeScript (unknown vs any)',
      shortTitle: 'L\'Objet Error & Typage Strict',
      icon: 'file-text',
      badge: 'unknown vs any',
      description: 'name, message, stack, cause (ES2022+), catalogue des erreurs natives et narrowing strict par type guards.',
      labNumber: 3,
      exerciseCount: 5
    },
    {
      id: 'custom-domain-errors',
      index: 5,
      title: 'Concevoir des Exceptions Métier Typées en POO (extends Error)',
      shortTitle: 'Exceptions Métier (extends Error)',
      icon: 'git-merge',
      badge: 'Taxonomie POO',
      description: 'Pourquoi bannir includes(), socle abstract AppError, métadonnées contextuelles et arbre d\'héritage du domaine.',
      labNumber: 4,
      exerciseCount: 4
    },
    {
      id: 'filtering-polymorphism',
      index: 6,
      title: 'Filtrage Chirurgical & Polymorphisme d\'Interception (instanceof)',
      shortTitle: 'Filtrage & instanceof',
      icon: 'filter',
      badge: 'Ordre & Rethrow',
      description: 'Polymorphisme de capture, aiguillage, ordre critique du plus spécifique au plus général et relance obligatoire de l\'inconnu.',
      labNumber: 5,
      exerciseCount: 4
    },
    {
      id: 'architectural-strategies',
      index: 7,
      title: 'Stratégies Architecturales : La Règle des 3 Étages & Error Wrapping',
      shortTitle: 'Règle des 3 Étages & Wrapping',
      icon: 'compass',
      badge: 'Domaine / Service / UI',
      description: 'Domaine (throw), Service (wrapping avec cause et rethrow), Présentation (try/catch + Signals) et tableau décisionnel.',
      labNumber: 5,
      exerciseCount: 4
    },
    {
      id: 'atm-simulator',
      index: 8,
      title: 'Simulateur Réactif d\'ATM Bancaire (Démonstrateur Temps Réel)',
      shortTitle: 'Distributeur ATM Réactif',
      icon: 'cpu',
      badge: 'Signals & Robustesse',
      description: 'Guichet bancaire avec solde réactif signal(100), débits 40€ / 150€ / -20€, code TypeScript en direct et résilience totale.',
      labNumber: 6,
      exerciseCount: 5
    },
    {
      id: 'workshops-lab',
      index: 9,
      title: 'Espace Ateliers Pratiques (26 Micro-Exercices d\'Entraînement)',
      shortTitle: 'Labo Monaco (26 Ex)',
      icon: 'terminal',
      badge: '26 Défis Monaco',
      description: 'Banc d\'entraînement complet avec Monaco Editor, terminal virtuel intégré et validation par assertions automatiques.'
    }
  ];

  setTab(tab: TabId): void {
    this.activeTab.set(tab);
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed.update(v => !v);
  }
}
