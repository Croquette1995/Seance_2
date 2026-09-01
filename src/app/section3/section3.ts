import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-section3',
  imports: [FormsModule, JsonPipe],
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
}
