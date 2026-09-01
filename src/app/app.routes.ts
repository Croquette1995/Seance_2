import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'section1', pathMatch: 'full' },
  { path: 'section1', loadComponent: () => import('./section1/section1').then(m => m.Section1) },
  { path: 'section2', loadComponent: () => import('./section2/section2').then(m => m.Section2) },
  { path: 'section3', loadComponent: () => import('./section3/section3').then(m => m.Section3) },
  { path: 'section4', loadComponent: () => import('./section4/section4').then(m => m.Section4) },
  { path: 'section5', loadComponent: () => import('./section5/section5').then(m => m.Section5) },
  { path: 'section6', loadComponent: () => import('./section6/section6').then(m => m.Section6) },
  { path: 'section7', loadComponent: () => import('./section7/section7').then(m => m.Section7) },
];
