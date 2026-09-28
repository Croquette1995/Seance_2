import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'ts_studio_theme_s8';
  readonly theme = signal<'dark' | 'light'>('dark');

  constructor() {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem(this.STORAGE_KEY) as 'dark' | 'light' | null;
      if (savedTheme) {
        this.theme.set(savedTheme);
      }
    }

    effect(() => {
      const current = this.theme();
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', current);
        document.body.classList.toggle('theme-dark', current === 'dark');
        document.body.classList.toggle('theme-light', current === 'light');
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.STORAGE_KEY, current);
      }
    });
  }

  toggleTheme(): void {
    this.theme.update(t => t === 'dark' ? 'light' : 'dark');
  }
}
