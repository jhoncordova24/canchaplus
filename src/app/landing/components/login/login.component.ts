import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Login } from '../../../interfaces/login.interface';
import { UserService } from '../../../core/services/user.service';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { DataDialog, Result } from '../../../interfaces/data-dialog.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, DialogComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  form: FormGroup;
  mostrarPassword: boolean = false;
  isDialogOpen$ = signal(false);
  currentDialogData$ = signal<DataDialog>({
    title: '',
    body: '',
    actions: true,
  });
  processing: boolean = false;

  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  constructor() {
    this.form = this.formBuilder.group({
      usuario_correo: this.formBuilder.nonNullable.control<string>('', Validators.required),
      password: this.formBuilder.nonNullable.control<string>('', Validators.required),
    });
  }

  login() {
    if (this.form.valid) {
      this.processing = true;
      const data: Login = this.form.getRawValue();
      this.authService.login(data).subscribe({
        next: (response: any) => {
          console.log(response);
          if (response.success) {
            this.userService.saveToken(response.data.token);
            this.userService.saveUser(response.data.usuario);
            this.router.navigate(['/home/']);
          } else {
            this.openConfirmDialog({
              title: 'Autenticacion fallida',
              body: 'Credenciales invalidas',
              actions: false,
            });
            this.processing = false;
          }
        },
        error: (error) => {
          this.openConfirmDialog({
            title: 'Autenticacion fallida',
            body: error.error.message,
            actions: false,
          });
          this.processing = false;
        },
      });
    } else {
      this.dirtControls(this.form.controls);
    }
  }

  dirtControls(control: any): void {
    Object.keys(this.form.controls).forEach((key) => {
      const control = this.form.get(key);
      if (control && !control.dirty) {
        control.markAsDirty();
      }
    });
  }

  showPassword(control: AbstractControl) {
    this.mostrarPassword = !this.mostrarPassword;
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
