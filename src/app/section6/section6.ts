import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonPipe, KeyValuePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CodeEditor } from '../shared/components/code-editor/code-editor';

interface Article {
  readonly id: string;
  titre: string;
  prix: number;
  description?: string;
}

type Role = 'admin' | 'user' | 'invite';

@Component({
  selector: 'app-section6',
  imports: [
    FormsModule,
    JsonPipe,
    KeyValuePipe,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    CodeEditor
  ],
  templateUrl: './section6.html',
  styleUrl: './section6.scss'
})
export class Section6 {
  // Article Builder
  articleCode = `interface Article {
  readonly id: string;
  titre: string;
  prix: number;
  description?: string; // Optionnel
}`;

  article = signal<Article>({
    id: 'ART-123',
    titre: 'Clavier Mécanique',
    prix: 99.99
  });

  tempTitre = signal(this.article().titre);
  tempPrix = signal(this.article().prix);
  tempDesc = signal(this.article().description || '');

  updateArticle() {
    this.article.update(art => ({
      ...art,
      titre: this.tempTitre(),
      prix: this.tempPrix(),
      description: this.tempDesc() ? this.tempDesc() : undefined
    }));
  }

  // Record Lab
  recordCode = `type Role = 'admin' | 'user' | 'invite';

// Record garantit que CHAQUE Role est défini
const permissions: Record<Role, boolean> = {
  admin: true,
  user: true,
  invite: false
};`;

  permissions = signal<Record<Role, boolean>>({
    admin: true,
    user: true,
    invite: false
  });

  togglePermission(role: Role) {
    this.permissions.update(perms => ({
      ...perms,
      [role]: !perms[role]
    }));
  }

  initialExerciseCode = `// Exercice 1: Interfaces et propriétés optionnelles
// Créez une interface 'Voiture' avec :
// - marque (string)
// - annee (number)
// - electrique (boolean optionnel)
// Ensuite, créez un objet respectant cette interface.

interface Voiture {
  // Vos propriétés ici...
}

const maVoiture: Voiture = {
  // Votre objet ici...
};
console.log("Ex1 Voiture:", maVoiture);

// Exercice 2: Readonly
// Ajoutez le modificateur 'readonly' à la propriété 'id' de l'interface User.
// Vérifiez que TypeScript bloque la modification de l'id.
interface User {
  id: number; // modifiez cette ligne
  nom: string;
}
const u: User = { id: 1, nom: "Alice" };
// u.id = 2; // Décommentez pour voir l'erreur (si readonly est ajouté)
console.log("Ex2 User:", u);

// Exercice 3: Record
// Utilisez Record pour créer un objet 'traductions' qui associe
// les clés 'bonjour' et 'aurevoir' à leurs traductions en anglais.
type Mots = 'bonjour' | 'aurevoir';
const traductions: Record<Mots, string> = {
  // Ajoutez les traductions ici...
};
console.log("Ex3 Traductions:", traductions);
`;
}
