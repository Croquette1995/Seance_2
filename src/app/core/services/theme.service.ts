import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'dark' | 'light';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'seance10_theme';
  readonly theme = signal<Theme>('dark');

  constructor() {
    let savedTheme: Theme = 'dark';
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(this.STORAGE_KEY) as Theme;
      if (stored === 'light' || stored === 'dark') {
        savedTheme = stored;
      }
    }
    this.theme.set(savedTheme);

    effect(() => {
      const current = this.theme();
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', current);
        if (current === 'dark') {
          document.body.classList.add('theme-dark');
          document.body.classList.remove('theme-light');
        } else {
          document.body.classList.add('theme-light');
          document.body.classList.remove('theme-dark');
        }
      }
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.STORAGE_KEY, current);
      }
    });
  }

  toggleTheme(): void {
    this.theme.update(t => t === 'dark' ? 'light' : 'dark');
  }
}
