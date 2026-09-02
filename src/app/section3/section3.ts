import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CodeEditor } from '../shared/components/code-editor/code-editor';

@Component({
  selector: 'app-section3',
  imports: [
    FormsModule,
    JsonPipe,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    CodeEditor
  ],
  templateUrl: './section3.html',
  styleUrl: './section3.scss'
})
export class Section3 {
  // === vs ==
  val1Str = signal<string>('0');
  val2Str = signal<string>('0');

  getParsedValue(val: string): any {
    if (val === '0') return 0;
    if (val === '"0"') return "0";
    if (val === 'false') return false;
    if (val === '""') return "";
    if (val === '[]') return [];
    return val;
  }

  looseEquality = computed(() => {
    // eslint-disable-next-line eqeqeq
    return this.getParsedValue(this.val1Str()) == this.getParsedValue(this.val2Str());
  });

  strictEquality = computed(() => {
    return this.getParsedValue(this.val1Str()) === this.getParsedValue(this.val2Str());
  });

  // ?? vs ||
  testValue = signal<string>('0');

  getParsedNullishValue(val: string): any {
    if (val === '0') return 0;
    if (val === '""') return "";
    if (val === 'false') return false;
    if (val === 'null') return null;
    if (val === 'undefined') return undefined;
    if (val === '"Texte"') return "Texte";
    return val;
  }

  orResult = computed(() => {
    const val = this.getParsedNullishValue(this.testValue());
    return val || "Valeur par défaut (OR)";
  });

  nullishResult = computed(() => {
    const val = this.getParsedNullishValue(this.testValue());
    return val ?? "Valeur par défaut (Nullish)";
  });

  // Optional Chaining
  hasAddress = signal<boolean>(true);
  hasCity = signal<boolean>(true);

  userObject = computed(() => {
    return {
      nom: "Alice",
      ...(this.hasAddress() ? {
        adresse: {
          ...(this.hasCity() ? { ville: "Paris" } : {})
        }
      } : {})
    };
  });

  cityResult = computed(() => {
    const user: any = this.userObject();
    try {
      // Simulation of user.adresse?.ville
      return user.adresse?.ville;
    } catch (e: any) {
      return `Erreur: ${e.message}`;
    }
  });

  cityResultWithoutOptional = computed(() => {
    const user: any = this.userObject();
    try {
      // Simulation of user.adresse.ville
      return user.adresse.ville;
    } catch (e: any) {
      return `Erreur au runtime ! (Cannot read properties of undefined)`;
    }
  });

  initialExerciseCode = `// Exercice 1: Égalité stricte vs faible
// Écrivez une condition avec '==' qui est vraie, et la même avec '===' qui est fausse.
const looseVrai = ("0" /* modifiez ici */);
const strictFaux = ("0" /* modifiez ici */);
console.log("Ex1 Loose:", looseVrai, "Strict:", strictFaux);

// Exercice 2: Nullish Coalescing (??) vs OR (||)
// Utilisez ?? pour que config1 garde la valeur '0'.
// Utilisez || pour que config2 prenne la valeur "défaut".
const valeurEntree = 0;
const config1 = valeurEntree /* modifiez ici */ "défaut";
const config2 = undefined /* modifiez ici */ "défaut";
console.log("Ex2 Config1:", config1, "Config2:", config2);

// Exercice 3: Optional Chaining (?.)
// Corrigez le code suivant avec ?. pour éviter le crash.
const utilisateur = { nom: "Jean" };
// const codePostal = utilisateur.adresse.codePostal; // ❌ Crash
const codePostal = undefined; /* modifiez cette ligne avec ?. */
console.log("Ex3 Code Postal:", codePostal);
`;
}
