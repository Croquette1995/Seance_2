import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

enum DirectionEnum {
  Haut = 'HAUT',
  Bas = 'BAS',
  Gauche = 'GAUCHE',
  Droite = 'DROITE'
}

type DirectionLiteral = 'HAUT' | 'BAS' | 'GAUCHE' | 'DROITE';

@Component({
  selector: 'app-section2',
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './section2.html',
  styleUrl: './section2.scss'
})
export class Section2 {
  // Unions & Narrowing
  unionInput = signal<string>('123');

  parsedUnionValue = computed<string | number>(() => {
    const val = this.unionInput();
    if (val.trim() === '') return '';
    const num = Number(val);
    return isNaN(num) ? val : num;
  });

  unionType = computed(() => {
    const val = this.parsedUnionValue();
    return typeof val;
  });

  narrowingMessage = computed(() => {
    const val = this.parsedUnionValue();
    // Type Narrowing example
    if (typeof val === 'number') {
      return `C'est un nombre. Valeur multipliée par 2 : ${val * 2}`;
    } else {
      return `C'est une chaîne de caractères. Longueur : ${val.length}`;
    }
  });

  // Enums vs Literal Unions
  selectedEnum = signal<DirectionEnum>(DirectionEnum.Haut);
  selectedLiteral = signal<DirectionLiteral>('HAUT');

  enumCode = `enum Direction {
  Haut = 'HAUT',
  Bas = 'BAS',
  Gauche = 'GAUCHE',
  Droite = 'DROITE'
}
// Génère un objet JavaScript lourd à l'exécution`;

  literalCode = `type Direction = 'HAUT' | 'BAS' |
                 'GAUCHE' | 'DROITE';

// Ne génère AUCUN code JavaScript (Type Erasure pur)`;


  // Any vs Unknown
  anyCode = `let valeur: any = 42;
valeur.faireQuelqueChose(); // ❌ Crash au runtime (pas d'erreur TS)`;

  unknownCode = `let valeur: unknown = 42;
// valeur.faireQuelqueChose(); // ❌ Erreur TypeScript !

if (typeof valeur === 'number') {
  console.log(valeur.toFixed(2)); // ✅ OK, type narrowed
}`;

}
