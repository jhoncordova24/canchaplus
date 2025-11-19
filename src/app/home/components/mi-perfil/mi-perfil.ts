import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../interfaces/user.interface';
import { UserService } from '../../../core/services/user.service';
import { TipoRoles } from '../../../shared/constants/roles-tipos';
import { format } from 'date-fns';
import { NgClass } from '@angular/common';
import { ReservaService } from '../../services/reserva.service';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './mi-perfil.html',
})
export class MiPerfil {
  usuario!: User;
  puntos = 2450;
  puntosMax = 5000;
  editMode = false;
  form!: FormGroup;
  ultimasReservas: any[] = [];

  private readonly userService = inject(UserService);
  private readonly reservaService = inject(ReservaService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly usuarioService = inject(UsuarioService);

  constructor() {
    this.form = this.formBuilder.group({
      usuario_correo: this.formBuilder.control<string>('', Validators.required),
      usuario_nombres: this.formBuilder.control<string>('', Validators.required),
      usuario_telefono: this.formBuilder.control<string>('', Validators.required),
    });
  }

  ngOnInit(): void {
    //La api no devuelve completa la informacion
    this.fillUser();
    this.form.patchValue(this.usuario);
    this.getUltimasReservas();
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
      this.editMode = false;
      alert('✅ Perfil actualizado correctamente');
    } else {
      console.log('No valido');
    }
  }

  patchUsuario(data: User) {
    this.usuarioService.patchUsuario(this.usuario.usuario_id, data).subscribe({
      next: (response: any) => {
        console.log(response);
        this.userService.saveUser(response.data);
        this.fillUser();
      },
      error: (err) => {
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
        console.log(error);
      },
    });
  }

  get porcentajeProgreso() {
    return Math.min((this.puntos / this.puntosMax) * 100, 100);
  }
}
