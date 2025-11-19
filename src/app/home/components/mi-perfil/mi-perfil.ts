import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../interfaces/user.interface';
import { UserService } from '../../../core/services/user.service';
import { TipoRoles } from '../../../shared/constants/roles-tipos';
import { format } from 'date-fns';
import { NgClass } from '@angular/common';
import { ReservaService } from '../../services/reserva.service';
import { UsuarioService } from '../../services/usuario.service';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { DataDialog, Result } from '../../../interfaces/data-dialog.interface';
import { telefonoValidator } from '../../../shared/validators/telefonoValidator';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, DialogComponent],
  templateUrl: './mi-perfil.html',
})
export class MiPerfil {
  usuario!: User;
  puntos = 1000;
  puntosMax = 5000;
  editMode = false;
  form!: FormGroup;
  ultimasReservas!: any[];
  isDialogOpen$ = signal(false);
  currentDialogData$ = signal<DataDialog>({
    title: '',
    body: '',
    actions: true,
  });

  private readonly userService = inject(UserService);
  private readonly reservaService = inject(ReservaService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly usuarioService = inject(UsuarioService);

  constructor() {
    this.form = this.formBuilder.group({
      usuario_nombres: this.formBuilder.control<string>('', Validators.required),
      usuario_telefono: this.formBuilder.control<string>('', [
        Validators.required,
        telefonoValidator,
      ]),
    });
  }

  ngOnInit(): void {
    //La api no devuelve completa la informacion
    this.fillUser();
    this.form.patchValue(this.usuario);
    this.getUltimasReservas();
  }

  get porcentajeProgreso() {
    return Math.min((this.puntos / this.puntosMax) * 100, 100);
  }

  habilitarEdicion() {
    this.editMode = true;
  }

  cancelar() {
    this.editMode = false;
  }

  guardar() {
    if (this.form.valid) {
      this.patchUsuario(this.form.value);
    } else {

      ///VALIDAR ERROR con modal
      console.log('No valido');
    }
  }

  patchUsuario(data: User) {
    this.usuarioService.patchUsuario(this.usuario.usuario_id, data).subscribe({
      next: (response: any) => {
        this.openConfirmDialog({
          title: 'Perfil actualizado',
          body: response.message || 'Su perfil ha sido actualizado correctamente.',
          actions: false,
        });
        this.editMode = false;
        this.userService.saveUser(response.data);
        this.fillUser();
      },
      error: (err) => {
        this.editMode = false;
        this.openConfirmDialog({
          title: 'Error al actualizar',
          body: 'Hubo un error al actualizar su perfil. Por favor, intente nuevamente.',
          actions: false,
        });
        this.form.patchValue(this.usuario);
        console.log(err);
      },
    });
  }

  fillUser() {
    this.usuario = this.userService.getUser();
    this.usuario.usuario_rolNombre = TipoRoles.get(this.usuario.usuario_rol as string);
    this.usuario.usuario_fecharegistro = format(this.usuario.usuario_fecharegistro!, 'yyyy-MM-dd');
  }

  getUltimasReservas() {
    this.reservaService.getReservasByIdUsuario(this.usuario.usuario_id, 1, 4).subscribe({
      next: (response: any) => {
        this.ultimasReservas = response.data.lista;
        console.log(response);
      },
      error: (error) => {
        this.ultimasReservas = [];
        console.log(error);
      },
    });
  }

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
