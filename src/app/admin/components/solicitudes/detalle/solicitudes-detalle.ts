import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CryptoService } from '../../../../home/services/crypto.service';
import { SolicitudAdmin } from '../../../../interfaces/solicitud.interface';
import { SolicitudesService } from '../../../services/solicitudes.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DialogComponent } from '../../../../shared/components/dialog/dialog.component';
import { DataDialog, Result } from '../../../../interfaces/data-dialog.interface';
import { UsuarioService } from '../../../../home/services/usuario.service';

@Component({
  selector: 'app-solicitudes-detalle',
  imports: [ReactiveFormsModule, DialogComponent],
  templateUrl: './solicitudes-detalle.html',
  styleUrl: './solicitudes-detalle.scss',
  standalone: true,
})
export class SolicitudesDetalle implements OnInit {
  idSolicitud!: string;
  solicitud!: SolicitudAdmin;
  isDialogOpen$ = signal(false);
  currentDialogData$ = signal<DataDialog>({
    title: '',
    body: '',
    actions: true,
  });
  processing: boolean = false;

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly cryptoService = inject(CryptoService);
  private readonly solicitudesService = inject(SolicitudesService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly router = inject(Router);

  constructor() {
    this.activatedRoute.params.subscribe((params) => {
      this.idSolicitud = this.cryptoService.desencriptar(params['idSolicitud']);
    });
  }

  ngOnInit(): void {
    this.solicitudesService.getSolicitudById(this.idSolicitud).then((solicitud) => {
      if (solicitud) {
        this.solicitud = solicitud;
      } else {
        console.error('Error no se pudo recuperar la solicitud');
      }
    });
  }

  submit() {
    this.processing = true;
    this.openConfirmDialog({
      title: 'Confirmar aprobación',
      body: '¿Estás seguro de que deseas aprobar esta solicitud?',
      actions: true,
      confirmLabel: 'Aceptar',
      discardLabel: 'Volver',
      payload: { ...this.solicitud, action: 'aceptar' },
    });
  }

  discard() {
    this.processing = true;
    this.openConfirmDialog({
      title: 'Confirmar rechazo',
      body: '¿Estás seguro de que deseas rechazar esta solicitud?',
      actions: true,
      confirmLabel: 'Rechazar',
      discardLabel: 'Volver',
      payload: { ...this.solicitud, action: 'rechazar' },
    });
  }

  return() {
    this.router.navigate(['/admin/home/solicitudes']);
  }

  openConfirmDialog(data: DataDialog): void {
    this.currentDialogData$.set(data);
    this.isDialogOpen$.set(true);
  }

  handleDialogClose(result: Result): void {
    // Cierra el modal visualmente
    this.isDialogOpen$.set(false);
    console.log(result);
    if (result.result) {
      switch (result.body.action) {
        case 'aceptar':
          this.processing = true;
          this.solicitudesService
            .updateSolicitud(this.idSolicitud, { estado: 'aprobado' })
            .then(() => {
              this.usuarioService
                .ascenderGerente(this.solicitud.idUsuario, { usuario_rol: '1' })
                .subscribe({
                  next: (response: any) => {
                    console.log(response);
                    this.openConfirmDialog({
                      title: 'El usuario ha sido promovido',
                      body: response.message,
                      actions: false,
                      payload: { redirect: true },
                    });
                  },
                  error: (err) => {
                    this.processing = false;
                    this.openConfirmDialog({
                      title: 'Error',
                      body: 'Error al aprobar la solicitud. Ha ocurrido un error intentelo más tarde.',
                      actions: false,
                    });
                    console.log(console.error(err));
                  },
                });
            })
            .catch((err) => {
              this.processing = false;
              this.openConfirmDialog({
                title: 'Error',
                body: 'Error al aprobar la solicitud. Ha ocurrido un error intentelo más tarde.',
                actions: false,
              });
              console.error('Error al aprobar la solicitud', err);
            });
          break;
        case 'rechazar':
          this.processing = true;
          this.solicitudesService
            .updateSolicitud(this.idSolicitud, { estado: 'rechazado' })
            .then(() => {
              this.openConfirmDialog({
                title: 'Solicitud rechazada',
                body: 'Se ha rechazado la solicitud del usuario.',
                actions: false,
                payload: { redirect: true },
              });
            })
            .catch((err) => {
              this.processing = false;
              this.openConfirmDialog({
                title: 'Error',
                body: 'Error al aprobar la solicitud. Ha ocurrido un error intentelo más tarde.',
                actions: false,
              });
              console.error('Error al aprobar la solicitud', err);
            });
          break;
        default:
          break;
      }
    } else {
      this.processing = false;
    }
    // Lógica de negocio basada en el resultado
    if (result.body.redirect) {
      this.router.navigate(['/admin/home/solicitudes']);
    } else {
      console.log('No hay redirección.');
    }
  }
}
