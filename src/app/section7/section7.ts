import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';

interface Produit {
  id: string;
  nom: string;
  prix: number;
}

@Component({
  selector: 'app-section7',
  imports: [FormsModule, CurrencyPipe],
  templateUrl: './section7.html',
  styleUrl: './section7.scss'
})
export class Section7 {
  // Exercice 2.1: Traiter Identifiant
  ex1Input = signal<string>('USER_123');

  traiterIdentifiant(id: string | number): string {
    if (typeof id === 'string') {
      return `Identifiant texte reçu, formaté : ${id.toUpperCase()}`;
    } else if (typeof id === 'number') {
      return `Identifiant numérique reçu, incrémenté : ${id + 1}`;
    }
    return 'Type non supporté';
  }

  ex1Result = computed(() => {
    const val = this.ex1Input();
    if (!val) return '';
    const num = Number(val);
    if (!isNaN(num) && val.trim() !== '') {
      return this.traiterIdentifiant(num);
    }
    return this.traiterIdentifiant(val);
  });

  // Exercice 2.2: Panier
  catalogue: Produit[] = [
    { id: 'p1', nom: 'Livre TypeScript', prix: 35 },
    { id: 'p2', nom: 'Café (1kg)', prix: 15 },
    { id: 'p3', nom: 'Clavier', prix: 120 }
  ];

  panier = signal<Produit[]>([]);

  ajouterAuPanier(produit: Produit) {
    this.panier.update(items => [...items, produit]);
  }

  retirerDuPanier(index: number) {
    this.panier.update(items => {
      const copy = [...items];
      copy.splice(index, 1);
      return copy;
    });
  }

  totalPanier = computed(() => {
    return this.panier().reduce((total, produit) => total + produit.prix, 0);
  });
}
