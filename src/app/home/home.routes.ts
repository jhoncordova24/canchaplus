import { Routes } from '@angular/router';
import { Ascenso } from './components/ascenso/ascenso';
import { SolicitudesReserva } from './components/solicitudes-reserva/solicitudes-reserva';
import { MiPerfil } from './components/mi-perfil/mi-perfil';
import { Home } from './home';
import { Reservas } from './components/reservas/reservas';
import { sessionGuard } from '../core/guards/session.guard';
import { roleGuard } from '../core/guards/role.guard';

export default [
  {
    path: '',
    component: Home,
    children: [
      { path: '', redirectTo: 'reservar', pathMatch: 'full' },
      {
        path: 'ascenso',
        component: Ascenso,
        title: 'Canchaplus - Ascenso',
        canActivate: [roleGuard],
      },
      { path: 'perfil', component: MiPerfil, title: 'Canchaplus - Mi Perfil' },
      { path: 'solicitudes', component: SolicitudesReserva, title: 'Canchaplus - Solicitudes' },
      { path: 'reservas', component: Reservas, title: 'Canchaplus - Mis Reservas' },
      {
        path: 'reservar',
        loadChildren: () => import('./components/reservar/reservar.routes'),
      },
    ],
  },
] as Routes;
