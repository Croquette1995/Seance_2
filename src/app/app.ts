import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App implements OnInit {
  protected readonly title = signal('ts-demonstrateur');
  isDarkTheme = signal(false);

  ngOnInit() {
    // Check initial theme preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.isDarkTheme.set(prefersDark);
    this.applyTheme();
  }

  toggleTheme() {
    this.isDarkTheme.update(dark => !dark);
    this.applyTheme();
  }

  private applyTheme() {
    if (this.isDarkTheme()) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }
}
