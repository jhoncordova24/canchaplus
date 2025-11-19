import { DecimalPipe, NgClass } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ReservaService } from '../../services/reserva.service';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../interfaces/user.interface';
import { CanchaService } from '../../services/cancha.service';
import { Cancha } from '../../../interfaces/cancha.interface';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { DataDialog, Result } from '../../../interfaces/data-dialog.interface';

@Component({
  selector: 'app-solicitudes-reserva',
  standalone: true,
  imports: [DecimalPipe, NgClass, DialogComponent],
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

  isDialogOpen$ = signal(false);
  currentDialogData$ = signal<DataDialog>({
    title: '',
    body: '',
    actions: true,
  });

  ngOnInit(): void {
    this.usuario = this.userService.getUser();
    this.getReservas();
  }

  getReservas() {
    this.reservas = [];
    if (this.usuario.usuario_rol === '2') {
      this.getReservasCliente();
    } else {
      this.getReservasAdmin();
      this.getReservasCliente();
    }
  }

  getReservasAdmin() {
    this.getCanchasAdmin();
  }

  getReservasCliente() {
    //Solo pendientes
    this.reservaService.getReservasPendientesByCliente(this.usuario.usuario_id).subscribe({
      next: (response: any) => {
        console.log(response);
        this.reservas = [...this.reservas, ...response.data];
      },
      error: (err) => {
        console.error(err);
      },
    });
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
        this.reservas = [...this.reservas, ...response.data];
        console.log('reservass: ', response);
      },
    });
  }

  aceptarReserva(idReserva: string) {
    const data: DataDialog = {
      title: 'Confirmación necesaria',
      body: '¿Está seguro de que desea confirmar la reserva seleccionada? Esta acción no se puede deshacer.',
      actions: true,
      confirmLabel: 'Sí, confirmar',
      discardLabel: 'No, cancelar',
      payload: {
        ...this.reservas.find((r) => r.reserva_id === idReserva),
        action: 'aceptar',
      }, // Pasamos el payload para recibirlo de vuelta
    };
    this.openConfirmDialog(data);
  }

  rechazarReserva(idReserva: string) {
    const data: DataDialog = {
      title: 'Rechazo de reserva',
      body: '',
      actions: true,
      confirmLabel: 'Sí, rechazar',
      discardLabel: 'Volver',
      payload: {
        ...this.reservas.find((r) => r.reserva_id === idReserva),
        action: 'rechazar',
      },
    };
    (data.body =
      this.usuario.usuario_rol === '2'
        ? `¿Desea anular su reserva en "${data.payload.cancha_nombre}"? Se notificará al dueño de la cancha de inmediato.`
        : '¿Desea rechazar esta reserva? El cliente será notificado de inmediato.'),
      this.openConfirmDialog(data);
  }

  openConfirmDialog(data: DataDialog): void {
    this.currentDialogData$.set(data);
    this.isDialogOpen$.set(true);
  }

  handleDialogClose(result: Result): void {
    // Cierra el modal visualmente
    this.isDialogOpen$.set(false);

    // Lógica de negocio basada en el resultado
    if (result.result === true) {
      console.log('¡Acción confirmada por el usuario!');
      console.log('Payload devuelto:', result.body);

      switch (result.body.action) {
        case 'aceptar':
          //Deberia existir un metodo para cancelar y aceptar reserva
          //pero de debe hacer con el update general y patchear el estado antes de enviar
          result.body.estadoreserva_id = '4';
          console.log(result.body);
          this.reservaService.patchReserva(result.body).subscribe({
            next: (response: any) => {
              console.log(response.data);
              if (response.data) {
                this.getReservas();
                const data: DataDialog = {
                  title: response.success ? 'Reserva confirmada' : 'Error al reservar',
                  body: response.success
                    ? 'La reserva se ha confirmado correctamente.'
                    : 'Ha ocurrido un error al confirmar la reserva.',
                  actions: false,
                };
                this.openConfirmDialog(data);
              }
            },
            error: (err) => {
              console.error('El error: ', err);
              const data: DataDialog = {
                title: 'Error al reservar',
                body: err.error.message || 'Ha ocurrido un error al confirmar la reserva.',
                actions: false,
              };
              this.openConfirmDialog(data);
            },
          });
          break;

        case 'rechazar':
          //Deberia existir un metodo para cancelar y aceptar reserva
          //pero de debe hacer con el update general y patchear el estado antes de enviar
          result.body.estadoreserva_id = '3';
          console.log(result.body);
          this.reservaService.patchReserva(result.body).subscribe({
            next: (response: any) => {
              console.log(response);
              if (response.data) {
                this.reservas = this.reservas.filter(
                  (r) => r.reserva_id !== result.body.reserva_id
                );
              }
              const data: DataDialog = {
                title: 'Reserva rechazada',
                body: 'La reserva ha sido rechazada correctamente.',
                actions: false,
              };
              this.openConfirmDialog(data);
            },
            error: (err) => {
              console.error(err);
              const data: DataDialog = {
                title: 'Error al reservar',
                body: err.error.message || 'Ha ocurrido un error al rechazar la reserva.',
                actions: false,
              };
              this.openConfirmDialog(data);
            },
          });
          break;

        default:
          break;
      }
    } else {
      console.log('Acción descartada.');
    }
  }
}
