import { Routes } from '@angular/router';
import { Calendario } from './components/calendario/calendario';

export default [
  { path: '', redirectTo: 'reservar', pathMatch: 'full' },
  // { path: 'calendario', component: Calendario, title: 'Canchaplus - Home' },
  {
    path: 'reservar',
    loadChildren: () => import('./components/reservar/reservar.routes'),
  },
] as Routes;
