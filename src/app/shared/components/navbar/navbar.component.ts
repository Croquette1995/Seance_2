import { Component, inject } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';
import { NavigationService } from '../../../core/services/navigation.service';
import { ExerciseService } from '../../../core/services/exercise.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  template: `
    <header class="top-nav">
      <div class="nav-left">
        <button class="icon-btn sidebar-toggle" (click)="nav.toggleSidebar()" title="Masquer / Afficher le menu latéral">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <div class="brand">
          <div class="brand-logo-box">
            <span>POO</span>
          </div>
          <div class="brand-text">
            <div class="brand-title">
              TypeScript POO Studio <span class="session-tag">Séance 8</span>
            </div>
            <div class="brand-subtitle">Classes Abstraites &amp; Interfaces (Contrats purs, typage structurel &amp; découplage)</div>
          </div>
        </div>
      </div>

      <div class="nav-right">
        <!-- Badge Framework & version -->
        <div class="tech-badge">
          <span class="pulse-dot"></span>
          <span>Angular v22 · TypeScript v5.8</span>
        </div>

        <!-- Jauge de progression des exercices -->
        <div class="progress-pill" (click)="nav.setTab('workshops-lab')" title="Accéder aux 21 exercices Monaco Editor">
          <div class="progress-info">
            <span class="progress-label">Exercices Validés</span>
            <span class="progress-ratio">{{ exercises.completedCount() }}/{{ exercises.totalCount() }}</span>
          </div>
          <div class="progress-bar-track">
            <div class="progress-bar-fill" [style.width.%]="exercises.progressPercentage()"></div>
          </div>
        </div>

        <!-- Bouton Thème -->
        <button class="theme-toggle-btn" (click)="theme.toggleTheme()" [title]="theme.theme() === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'">
          @if (theme.theme() === 'dark') {
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          } @else {
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          }
        </button>
      </div>
    </header>
  `,
  styles: [`
    .top-nav {
      height: 56px;
      background: var(--bg-header);
      border-bottom: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      z-index: 50;
      position: relative;
    }

    .nav-left, .nav-right {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .sidebar-toggle {
      background: transparent;
      border: 1px solid var(--border-color);
      color: var(--text-muted);
      width: 34px;
      height: 34px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        color: var(--text-main);
        background: var(--bg-card);
        border-color: var(--border-focus);
      }
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .brand-logo-box {
      width: 30px;
      height: 30px;
      background: linear-gradient(135deg, #3178c6, #2563eb);
      color: #ffffff;
      font-weight: 800;
      font-family: var(--font-mono);
      font-size: 0.78rem;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(37, 99, 235, 0.4);
    }

    .brand-title {
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--text-main);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .session-tag {
      font-size: 0.72rem;
      background: rgba(49, 120, 198, 0.15);
      color: var(--ts-blue-light);
      border: 1px solid rgba(49, 120, 198, 0.35);
      padding: 1px 6px;
      border-radius: 4px;
      font-weight: 600;
    }

    .brand-subtitle {
      font-size: 0.75rem;
      color: var(--text-muted);
      line-height: 1.2;
    }

    .tech-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-main);
    }

    .pulse-dot {
      width: 7px;
      height: 7px;
      background: #3b82f6;
      border-radius: 50%;
      box-shadow: 0 0 8px #3b82f6;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.85); }
    }

    .progress-pill {
      display: flex;
      flex-direction: column;
      gap: 3px;
      padding: 4px 12px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      cursor: pointer;
      min-width: 150px;
      transition: all 0.2s;

      &:hover {
        border-color: var(--ts-blue);
        background: var(--bg-card-hover);
      }
    }

    .progress-info {
      display: flex;
      justify-content: space-between;
      font-size: 0.7rem;
      color: var(--text-muted);
      font-weight: 600;
    }

    .progress-ratio {
      color: var(--ts-blue-light);
    }

    .progress-bar-track {
      height: 4px;
      background: var(--bg-subtle);
      border-radius: 2px;
      overflow: hidden;
    }

    .progress-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #3b82f6, #6366f1, #10b981);
      transition: width 0.3s ease;
    }

    .theme-toggle-btn {
      width: 36px;
      height: 36px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-muted);
      border: 1px solid var(--border-color);
      background: var(--bg-card);

      &:hover {
        color: var(--text-main);
        background: var(--bg-card-hover);
        border-color: var(--border-focus);
      }
    }
  `]
})
export class NavbarComponent {
  readonly theme = inject(ThemeService);
  readonly nav = inject(NavigationService);
  readonly exercises = inject(ExerciseService);
}
