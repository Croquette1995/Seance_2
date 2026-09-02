import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonPipe, KeyValuePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

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
    MatIconModule
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
}
