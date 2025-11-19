import { Routes } from '@angular/router';
import { sessionGuard } from './core/guards/session.guard';

export const routes: Routes = [
  {
    path: 'landing',
    loadChildren: () => import('./landing/landing.routes'),
    title: 'Canchaplus - Home',
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.routes'),
    canActivateChild: [sessionGuard],
    title: 'Canchaplus - Home',
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes'),
    title: 'Canchaplus - Admin',
  },
  {
    path: 'not-authorized',
    loadComponent: () =>
      import('./landing/components/not-authorized/not-authorized').then((m) => m.NotAuthorized),
  },
  { path: '**', redirectTo: 'landing' },
];
