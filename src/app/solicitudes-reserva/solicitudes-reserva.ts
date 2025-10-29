import { Component } from '@angular/core';
import { SidebarComponent } from '../home/components/sidebar/sidebar.component';
import { SolicitudCardComponent } from './components/solicitud-card/solicitud-card';

@Component({
  selector: 'app-solicitudes-reserva',
  standalone: true,
  imports: [SidebarComponent, SolicitudCardComponent],
  templateUrl: './solicitudes-reserva.html',
})
export class SolicitudesReserva {}
