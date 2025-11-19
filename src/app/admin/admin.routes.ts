import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { SolicitudesLista } from './components/solicitudes/lista/solicitudes-lista';
import { SolicitudesDetalle } from './components/solicitudes/detalle/solicitudes-detalle';
import { adminGuard } from '../core/guards/admin.guard';

export default [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'auth', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'auth/login', component: LoginComponent },
  {
    path: 'home',
    loadComponent: () => import('./admin').then((m) => m.Admin),
    canActivateChild: [adminGuard],
    children: [
      { path: 'solicitudes', component: SolicitudesLista },
      { path: 'solicitudes/:idSolicitud', component: SolicitudesDetalle },
      { path: '', redirectTo: 'solicitudes', pathMatch: 'full' },
      { path: '**', redirectTo: 'solicitudes' },
    ],
  },
] as Routes;
