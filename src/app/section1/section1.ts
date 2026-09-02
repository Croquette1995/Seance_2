import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-section1',
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatIconModule
  ],
  templateUrl: './section1.html',
  styleUrl: './section1.scss'
})
export class Section1 {
  // Transpilation properties
  tsCode = `interface User {
  id: number;
  name: string;
}

function greet(user: User): string {
  return "Hello, " + user.name;
}

const alice: User = { id: 1, name: "Alice" };
console.log(greet(alice));`;

  jsCode = `function greet(user) {
  return "Hello, " + user.name;
}

const alice = { id: 1, name: "Alice" };
console.log(greet(alice));`;


  // Inference tester properties
  inputValue = signal<string>('42');

  parsedValue = computed(() => {
    const val = this.inputValue();
    if (!val) return undefined;

    // Attempt parsing
    if (!isNaN(Number(val)) && val.trim() !== '') {
      return Number(val);
    }

    if (val.toLowerCase() === 'true') return true;
    if (val.toLowerCase() === 'false') return false;

    try {
      return JSON.parse(val);
    } catch {
      return val;
    }
  });

  inferredTsType = computed(() => {
    const val = this.parsedValue();
    if (val === undefined) return 'any / undefined';
    if (typeof val === 'number') return 'number';
    if (typeof val === 'boolean') return 'boolean';
    if (typeof val === 'string') return 'string';
    if (Array.isArray(val)) return 'any[] (ou tuple)';
    if (typeof val === 'object' && val !== null) return 'object / Record<string, any>';
    return 'unknown';
  });

  runtimeTypeof = computed(() => {
    const val = this.parsedValue();
    return typeof val;
  });
}
