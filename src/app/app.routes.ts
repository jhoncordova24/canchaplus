import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { sessionGuard } from './core/guards/session.guard';
import { Home } from './home/home';

export const routes: Routes = [
  {
    path: 'landing',
    component: LandingComponent,
    loadChildren: () => import('./landing/landing.routes'),
    title: 'Canchaplus - Home',
  },
  {
    path: 'home',
    component: Home,
    loadChildren: () => import('./home/home.routes'),
    canActivate: [sessionGuard],
    title: 'Canchaplus - Home',
  },
  { path: '**', redirectTo: 'landing' },
];
