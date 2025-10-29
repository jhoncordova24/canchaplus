import { Routes } from '@angular/router';
import { Ascenso } from './components/ascenso/ascenso';
import { SolicitudesReserva } from './components/solicitudes-reserva/solicitudes-reserva';
import { MiPerfil } from './components/mi-perfil/mi-perfil';

export default [
  { path: '', redirectTo: 'reservar', pathMatch: 'full' },
  { path: 'ascenso', component: Ascenso, title: 'Canchaplus - Ascenso' },
  { path: 'perfil', component: MiPerfil, title: 'Canchaplus - Mi Perfil' },
  { path: 'solicitudes', component: SolicitudesReserva, title: 'Canchaplus - Solicitudes' },
  {
    path: 'reservar',
    loadChildren: () => import('./components/reservar/reservar.routes'),
  },
] as Routes;
