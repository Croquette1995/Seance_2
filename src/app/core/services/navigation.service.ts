import { Injectable, signal } from '@angular/core';
import { TabId, ModuleSection } from '../models/app.models';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  readonly activeTab = signal<TabId>('why-abstraction');
  readonly isSidebarCollapsed = signal<boolean>(false);

  readonly modules: ModuleSection[] = [
    {
      id: 'why-abstraction',
      index: 1,
      title: "Pourquoi l'Abstraction ? (Objets fantômes & code bouchon)",
      shortTitle: "Pourquoi l'Abstraction",
      icon: 'ghost',
      badge: 'TS2511',
      description: "Démonstrateur d'objets fantômes, comparateur de signatures pures et visualiseur du problème du diamant.",
      labNumber: 1,
      exerciseCount: 5
    },
    {
      id: 'abstract-class-anatomy',
      index: 2,
      title: "L'Anatomie d'une Classe Abstraite (abstract class)",
      shortTitle: 'Classe Abstraite',
      icon: 'layers',
      badge: '3 Piliers',
      description: "Constructeur et état partagé, méthodes concrètes DRY, promesses contractuelles et modificateurs d'accès.",
      labNumber: 1,
      exerciseCount: 5
    },
    {
      id: 'interface-pure-contract',
      index: 3,
      title: "L'Interface (interface) : Le Contrat Pur",
      shortTitle: 'Interface Pure',
      icon: 'plug',
      badge: 'implements',
      description: "Métaphore de la prise murale, multi-implémentation sans collision et composition d'interfaces.",
      labNumber: 2,
      exerciseCount: 4
    },
    {
      id: 'duck-typing-runtime-cost',
      index: 4,
      title: 'Typage Structurel (Duck Typing) & Zéro Coût Runtime',
      shortTitle: 'Duck Typing & Coût',
      icon: 'feather',
      badge: '0 Octet JS',
      description: "Banc d'essai de conformité par la forme, tolérance des surplus et split-screen d'effacement de type.",
      labNumber: 3,
      exerciseCount: 4
    },
    {
      id: 'decision-tree-hybrid',
      index: 5,
      title: "L'Arbre de Décision : « Est-un » vs « Capable-de »",
      shortTitle: 'Arbre de Décision',
      icon: 'git-branch',
      badge: 'Hybride Pro',
      description: "Sélecteur d'architecture interactif en 3 questions et démonstrateur du pattern hybride pro.",
      labNumber: 5,
      exerciseCount: 4
    },
    {
      id: 'pitfalls-type-guards',
      index: 6,
      title: 'Laboratoire des Pièges & Anti-Patterns',
      shortTitle: 'Pièges & Anti-Patterns',
      icon: 'alert-triangle',
      badge: 'Type Guards',
      description: "Crash test instanceof sur interface (TS2693), solution User-Defined Type Guard et visualiseur ISP.",
      labNumber: 4,
      exerciseCount: 4
    },
    {
      id: 'rpg-arena-simulator',
      index: 7,
      title: "Le Simulateur Live : L'Arène des Héros RPG",
      shortTitle: 'Arène RPG Live',
      icon: 'swords',
      badge: 'OCP & Signals',
      description: "Scène interactive mêlant classe abstraite Personnage, contrat Soigneur et polymorphisme sans switch.",
      labNumber: 5,
      exerciseCount: 4
    },
    {
      id: 'workshops-lab',
      index: 8,
      title: 'Ateliers Pratiques Monaco Editor (21 Exercices)',
      shortTitle: 'Labo Monaco (21 Ex)',
      icon: 'terminal',
      badge: '21 Ex',
      description: "Banc d'exercices interactifs avec éditeur Monaco, autocomplétion TypeScript, terminal virtuel et validation automatique."
    }
  ];

  setTab(tab: TabId): void {
    this.activeTab.set(tab);
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed.update(collapsed => !collapsed);
  }
}
