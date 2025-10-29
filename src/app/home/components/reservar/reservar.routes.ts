import { Routes } from '@angular/router';

export default [
  { path: '', redirectTo: 'canchas', pathMatch: 'full' },
  {
    path: 'canchas',
    loadComponent: () => import('./canchas/canchas').then((m) => m.Canchas),
  },
  {
    path: 'fecha/:idCancha',
    loadComponent: () => import('./fecha/fecha').then((m) => m.Fecha),
  },
  {
    path: 'confirmar/:idCancha/:fecha',
    loadComponent: () => import('./confirmar/confirmar').then((m) => m.Confirmar),
  },
] as Routes;
