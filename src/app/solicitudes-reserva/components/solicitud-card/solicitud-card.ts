import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

type EstadoReserva = 'Pendiente' | 'Aprobada' | 'Rechazada';

interface Reserva {
  reserva_id: number;
  usuario: string;
  cancha: string;
  reserva_fecha: string;
  reserva_horainicio: string;
  reserva_horafin: string;
  estadoreserva: EstadoReserva;
  reserva_montototal: number;
}

@Component({
  selector: 'app-solicitud-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './solicitud-card.html',
  styleUrls: ['./solicitud-card.scss'],
})
export class SolicitudCardComponent {
  mostrarPendientes = true;

  reservas: Reserva[] = [
    {
      reserva_id: 1,
      usuario: 'Juan Pérez',
      cancha: 'Cancha Principal',
      reserva_fecha: '2025-10-30',
      reserva_horainicio: '17:00',
      reserva_horafin: '18:00',
      estadoreserva: 'Pendiente',
      reserva_montototal: 60.0,
    },
    {
      reserva_id: 2,
      usuario: 'María Gómez',
      cancha: 'Cancha Norte',
      reserva_fecha: '2025-10-31',
      reserva_horainicio: '19:00',
      reserva_horafin: '20:00',
      estadoreserva: 'Pendiente',
      reserva_montototal: 50.0,
    },
    {
      reserva_id: 3,
      usuario: 'Carlos López',
      cancha: 'Cancha Sur',
      reserva_fecha: '2025-10-25',
      reserva_horainicio: '20:00',
      reserva_horafin: '21:00',
      estadoreserva: 'Aprobada',
      reserva_montototal: 45.0,
    },
    {
      reserva_id: 4,
      usuario: 'Ana Torres',
      cancha: 'Cancha Central',
      reserva_fecha: '2025-10-20',
      reserva_horainicio: '16:00',
      reserva_horafin: '17:00',
      estadoreserva: 'Rechazada',
      reserva_montototal: 55.0,
    },
    {
      reserva_id: 5,
      usuario: 'Diego Ramos',
      cancha: 'Cancha Principal',
      reserva_fecha: '2025-11-01',
      reserva_horainicio: '18:00',
      reserva_horafin: '19:00',
      estadoreserva: 'Pendiente',
      reserva_montototal: 60.0,
    },
  ];

  get reservasFiltradas() {
    return this.mostrarPendientes
      ? this.reservas.filter((r) => r.estadoreserva === 'Pendiente')
      : this.reservas;
  }

  cambiarVista(pendientes: boolean) {
    this.mostrarPendientes = pendientes;
  }

  cambiarEstado(reserva_id: number, nuevoEstado: EstadoReserva) {
    const reserva = this.reservas.find((r) => r.reserva_id === reserva_id);
    if (reserva) reserva.estadoreserva = nuevoEstado;
  }
}
