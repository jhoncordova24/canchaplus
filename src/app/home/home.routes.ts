import { Routes } from '@angular/router';
import { Ascenso } from './components/ascenso/ascenso';

export default [
  { path: '', redirectTo: 'reservar', pathMatch: 'full' },
  { path: 'ascenso', component: Ascenso, title: 'Canchaplus - Ascenso' },
  {
    path: 'reservar',
    loadChildren: () => import('./components/reservar/reservar.routes'),
  },
] as Routes;
