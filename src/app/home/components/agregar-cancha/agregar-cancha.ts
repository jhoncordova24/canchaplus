import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../../interfaces/user.interface';
import { Cancha } from '../../../interfaces/cancha.interface';
import { CanchaService } from '../../services/cancha.service';
import { UserService } from '../../../core/services/user.service';
import { TarifaService } from '../../services/tarifa.service';
import { forkJoin, map } from 'rxjs';
import { format } from 'date-fns';
import { fromZonedTime } from 'date-fns-tz';
import { TipoCanchas } from '../../../shared/constants/cancha-tipos';
import {
  AgregarCanchaDialog,
  CanchaDataDialog,
} from './components/agregar-cancha-dialog/agregar-cancha-dialog';
import { AgregarTarifaDialog } from './components/agregar-tarifa-dialog/agregar-tarifa-dialog';
import { DataDialog, Result } from '../../../interfaces/data-dialog.interface';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';

@Component({
  selector: 'app-agregar-cancha',
  imports: [CommonModule, FormsModule, AgregarTarifaDialog, AgregarCanchaDialog, DialogComponent],
  templateUrl: './agregar-cancha.html',
  styleUrl: './agregar-cancha.scss',
  standalone: true,
})
export class AgregarCancha implements OnInit {
  usuario!: User;
  canchas!: Cancha[];

  imgDefault: string = '/assets/cancha.webp';

  hoy: string = format(fromZonedTime(new Date(), 'America/Lima'), 'yyyy-MM-dd');

  editandoCancha: any = null;
  editandoTarifa: any = null;
  isDialogTarifaOpen$ = signal(false);
  currentDialogTarifaData$ = signal<Partial<Cancha>>({
    cancha_nombre: '',
    cancha_id: '',
  });
  isDialogCanchaOpen$ = signal(false);
  currentDialogCanchaData$ = signal<CanchaDataDialog>({
    body: {
      cancha_nombre: '',
      tipocancha_id: '',
      usuario_id: '',
      cancha_estado: '',
      cancha_id: '',
    },
  });
  isDialogOpen$ = signal(false);
  currentDialogData$ = signal<DataDialog>({
    title: '',
    body: '',
    actions: true,
  });

  private readonly canchaService = inject(CanchaService);
  private readonly tarifaService = inject(TarifaService);
  private readonly userService = inject(UserService);

  constructor() {}

  ngOnInit(): void {
    this.usuario = this.userService.getUser();
    this.getCanchasAdmin();
  }

  getCanchasAdmin() {
    this.canchaService.getCanchasByAdmin(this.usuario.usuario_id).subscribe({
      next: (response: any) => {
        const canchas = response.data;

        if (!canchas || canchas.length === 0) {
          this.canchas = [];
          return;
        }
        const llamadasTarifa = canchas.map((cancha: any) =>
          this.tarifaService.getTarifaByCanchaId(cancha.cancha_id, this.hoy).pipe(
            map((tarifaResponse: any) => {
              console.log('La tarifa response:', tarifaResponse);

              const tarifas = tarifaResponse?.data;
              if (tarifas && tarifas.length > 0) {
                return {
                  ...cancha,
                  tipocancha_nombre:
                    TipoCanchas.get(parseInt(cancha.tipocancha_id)) || 'No especifica',
                  cancha_id: cancha.cancha_id,
                  tarifaActual: tarifas[0],
                };
              }
              return {
                ...cancha,
                tipocancha_nombre:
                  TipoCanchas.get(parseInt(cancha.tipocancha_id)) || 'No especifica',
                cancha_id: cancha.cancha_id,
              };
            })
          )
        );
        forkJoin(llamadasTarifa).subscribe((resultados: any) => {
          this.canchas = resultados.filter((c: any) => c !== null);
          console.log(this.canchas);
        });
      },
    });
  }

  agregarCancha(action: string) {
    this.currentDialogCanchaData$.set({
      body: {
        cancha_nombre: '',
        tipocancha_id: '1',
        usuario_id: this.usuario.usuario_id,
        cancha_estado: '',
        cancha_id: '',
      },
      action,
    });

    this.openCanchaDialog();
  }

  actualizarCancha(action: string, cancha: Cancha) {
    const copia = structuredClone ? structuredClone(cancha) : JSON.parse(JSON.stringify(cancha));
    this.currentDialogCanchaData$.set({ body: copia, action });

    this.openCanchaDialog();
  }

  openCanchaDialog(): void {
    this.isDialogCanchaOpen$.set(true);
  }

  handleDialogCanchaClose(result: Result): void {
    // Cierra el modal visualmente
    this.isDialogCanchaOpen$.set(false);
    console.log(result);
    if (result.result) {
      switch (result.body.action) {
        case 'update':
          this.canchaService.updateCancha(result.body.body).subscribe({
            next: (response: any) => {
              console.log(response.message);
              this.getCanchasAdmin();
              this.openConfirmDialog({
                title: 'Cancha actualizada',
                body:
                  response.message ||
                  'La información de la cancha se ha actualizado correctamente.',
                actions: false,
              });
            },
            error: (err) => {
              this.openConfirmDialog({
                title: 'Error al actualizar',
                body:
                  err.error.message ||
                  'No se pudo actualizar la información de la cancha. Intente nuevamente.',
                actions: false,
              });
            },
          });
          break;
        case 'crear':
          this.canchaService.addCancha(result.body.body).subscribe({
            next: (response: any) => {
              console.log(response);
              this.getCanchasAdmin();
              this.openConfirmDialog({
                title: 'Cancha creada',
                body: response.message || 'La nueva cancha ha sido registrada correctamente.',
                actions: false,
              });
            },
            error: (err) => {
              this.openConfirmDialog({
                title: 'Error al crear',
                body: err.error.message || 'No se pudo registrar la cancha. Intente nuevamente.',
                actions: false,
              });
            },
          });
          break;
        default:
          break;
      }
    }
  }

  agregarTarifa(nombre: string, id: string | number) {
    this.currentDialogTarifaData$.set({
      cancha_nombre: nombre,
      cancha_id: id,
    });

    this.openTarifaDialog();
  }

  openTarifaDialog(): void {
    this.isDialogTarifaOpen$.set(true);
  }

  handleDialogTarifaClose(result: Result): void {
    this.isDialogTarifaOpen$.set(false);
    console.log(result);
    if (result.result) {
      this.tarifaService.agregarTarifa(result.body).subscribe({
        next: (response: any) => {
          this.getCanchasAdmin();
          this.openConfirmDialog({
            title: 'Tarifa creada',
            body: response.message || `La tarifa de la cancha ha sido registrada correctamente.`,
            actions: false,
          });
          this.getCanchasAdmin();
        },
        error: (err) => {
          this.getCanchasAdmin();
          this.openConfirmDialog({
            title: 'Error al crear',
            body: err.error.message || 'No se pudo registrar la cancha. Intente nuevamente.',
            actions: false,
          });
        },
      });
    }
  }

  // Metodos para Dialog informativo
  openConfirmDialog(data: DataDialog): void {
    this.currentDialogData$.set(data);
    this.isDialogOpen$.set(true);
  }

  handleDialogClose(result: Result): void {
    // Cierra el modal visualmente
    this.isDialogOpen$.set(false);
    console.log(result);
  }
}
