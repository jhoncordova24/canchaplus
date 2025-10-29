import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReservaService } from '../../services/reserva.service';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../interfaces/user.interface';
import { CanchaService } from '../../services/cancha.service';
import { Cancha } from '../../../interfaces/cancha.interface';
import { Reserva } from '../../../interfaces/reserva.interface';

@Component({
  selector: 'app-solicitudes-reserva',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './solicitudes-reserva.html',
})
export class SolicitudesReserva implements OnInit {
  mostrarPendientes = true;

  canchas!: Cancha[];
  reservas!: any[];
  usuario!: User;

  private readonly reservaService = inject(ReservaService);
  private readonly userService = inject(UserService);
  private readonly canchaService = inject(CanchaService);

  ngOnInit(): void {
    this.usuario = this.userService.getUser();
    this.getReservasAdmin();
  }

  getReservasAdmin() {
    this.getCanchasAdmin();
  }

  getCanchasAdmin() {
    this.canchaService.getCanchasByAdmin(this.usuario.usuario_id).subscribe({
      next: (response: any) => {
        this.canchas = response.data;
        for (let cancha of this.canchas) {
          this.getReservasByCancha(cancha.cancha_id);
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  getReservasByCancha(idCancha: string | number) {
    this.reservaService.getReservasPendientesByCanchaId(idCancha).subscribe({
      next: (response: any) => {
        this.reservas = response.data;
        console.log('reservass: ', response);
      },
    });
  }

  cambiarVista(pendientes: boolean) {
    this.mostrarPendientes = pendientes;
  }

  // cambiarEstado(reserva_id: number, nuevoEstado: EstadoReserva) {
  //   const reserva = this.reservas.find((r) => r.reserva_id === reserva_id);
  //   if (reserva) reserva.estadoreserva = nuevoEstado;
  // }
}
