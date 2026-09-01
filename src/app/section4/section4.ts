import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-section4',
  imports: [FormsModule],
  templateUrl: './section4.html',
  styleUrl: './section4.scss'
})
export class Section4 {
  // Paramètres optionnels et par défaut
  prix = signal<number>(100);
  frais = signal<number | null>(null); // null means we don't pass it, using default
  prefixe = signal<string>('');

  calculerTotal = (prix: number, frais: number = 5, prefixe?: string): string => {
    const total = prix + frais;
    return prefixe ? `${prefixe} ${total}` : `${total}`;
  };

  resultatCalcul = computed(() => {
    const p = this.prix() || 0;
    const f = this.frais();
    const pref = this.prefixe().trim();

    if (f !== null && pref) {
      return this.calculerTotal(p, f, pref);
    } else if (f !== null) {
      return this.calculerTotal(p, f);
    } else if (pref) {
      return this.calculerTotal(p, undefined, pref); // Pass undefined to trigger default 'frais'
    } else {
      return this.calculerTotal(p);
    }
  });

  codeCalculateur = `function calculerTotal(
  prix: number,
  frais: number = 5,
  prefixe?: string
): string {
  const total = prix + frais;
  return prefixe ? \`\${prefixe} \${total}\` : \`\${total}\`;
}`;

  // Arrow Functions vs Standard
  classiqueCode = `class Personne {
  nom = "Alice";

  saluer() {
    setTimeout(function() {
      // ❌ Erreur : 'this' est indéfini ou window
      console.log("Bonjour " + this.nom);
    }, 1000);
  }
}`;

  arrowCode = `class Personne {
  nom = "Alice";

  saluer() {
    setTimeout(() => {
      // ✅ OK : 'this' est lexical (la classe Personne)
      console.log("Bonjour " + this.nom);
    }, 1000);
  }
}`;

  implicitReturnCode = `// Retour explicite
const double = (n: number) => { return n * 2; };

// Retour implicite (plus concis)
const doubleRapide = (n: number) => n * 2;`;

}
