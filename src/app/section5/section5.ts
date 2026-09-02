import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CodeEditor } from '../shared/components/code-editor/code-editor';

@Component({
  selector: 'app-section5',
  imports: [
    FormsModule,
    JsonPipe,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    CodeEditor
  ],
  templateUrl: './section5.html',
  styleUrl: './section5.scss'
})
export class Section5 {
  // Array Workshop
  baseNumbers = signal<number[]>([1, 2, 3, 4, 5]);

  mappedNumbers = computed(() => {
    return this.baseNumbers().map(n => n * 2);
  });

  filteredNumbers = computed(() => {
    return this.baseNumbers().filter(n => n > 2);
  });

  reducedSum = computed(() => {
    return this.baseNumbers().reduce((acc, curr) => acc + curr, 0);
  });

  addNumberToArray(val: string) {
    const num = Number(val);
    if (!isNaN(num)) {
      this.baseNumbers.update(arr => [...arr, num]);
    }
  }

  resetArray() {
    this.baseNumbers.set([1, 2, 3, 4, 5]);
  }

  // Tuples vs Readonly
  tupleCode = `// Tuple : type précis pour chaque position
let coordonnees: [number, string] = [42, "Paris"];
coordonnees[0] = 43; // ✅ OK
// coordonnees = ["Paris", 42]; // ❌ Erreur d'ordre`;

  readonlyCode = `// Tableau immuable
const nombres: readonly number[] = [1, 2, 3];
// nombres.push(4); // ❌ Erreur : property 'push' does not exist
// nombres[0] = 99; // ❌ Erreur : Index signature in type... only permits reading`;

  // Map & Set Lab
  setItems = signal<Set<string>>(new Set(['Pomme', 'Banane']));
  arrayItems = signal<string[]>(['Pomme', 'Banane']);
  newItemName = signal<string>('');

  addItemToBoth() {
    const item = this.newItemName().trim();
    if (item) {
      // Add to array (allows duplicates)
      this.arrayItems.update(arr => [...arr, item]);

      // Add to Set (automatically handles duplicates)
      this.setItems.update(set => {
        const newSet = new Set(set);
        newSet.add(item);
        return newSet;
      });

      this.newItemName.set('');
    }
  }

  getSetAsArray() {
    return Array.from(this.setItems());
  }

  // Map Lab
  userMap = signal<Map<string, { age: number }>>(new Map([
    ['alice', { age: 25 }],
    ['bob', { age: 30 }]
  ]));

  mapCode = `const users = new Map<string, {age: number}>();
users.set('alice', { age: 25 });

console.log(users.get('alice')); // { age: 25 }
console.log(users.has('bob')); // false`;

  initialExerciseCode = `// Exercice 1: Manipuler des tableaux (map, filter)
const prix = [10, 25, 30, 5, 40];
// 1. Utilisez filter pour garder les prix > 15
// 2. Utilisez map pour ajouter 5 à chaque prix filtré
const prixFiltres = prix; /* modifiez ici */
const prixFinaux = prixFiltres; /* modifiez ici */
console.log("Ex1 Prix Finaux:", prixFinaux);

// Exercice 2: Tuples et Tableaux Readonly
// Essayez de modifier ce tuple et ce tableau readonly.
// TypeScript devrait vous en empêcher si vous le décommentez !
let identifiant: [number, string] = [1, "Admin"];
const jours: readonly string[] = ["Lundi", "Mardi", "Mercredi"];

// identifiant[0] = "Deux"; // ❌ Erreur de type
// jours.push("Jeudi"); // ❌ Erreur 'push' n'existe pas

console.log("Ex2:", identifiant, jours);

// Exercice 3: Utiliser Map et Set
// 1. Créez un Set avec [1, 1, 2, 3, 3]. Regardez sa taille.
// 2. Créez un Map liant 'fr' à 'France' et 'be' à 'Belgique'.
const monSet = new Set(); /* modifiez ici */
const monMap = new Map(); /* modifiez ici */

console.log("Ex3 Set size:", monSet.size, "Map get 'fr':", monMap.get('fr'));
`;
}
