import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Register } from '../../../interfaces/register.interface';
import { passwordMatchValidator } from '../../../shared/validators/passwordMatchValidator';
import { AuthService } from '../../../core/services/auth.service';
import { telefonoValidator } from '../../../shared/validators/telefonoValidator';
import { passwordStrengthValidator } from '../../../shared/validators/passwordFuerteValidator';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { DataDialog, Result } from '../../../interfaces/data-dialog.interface';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, DialogComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  form: FormGroup;
  mostrarConfirmPassword = false;
  mostrarPassword = false;
  isDialogOpen$ = signal(false);
  currentDialogData$ = signal<DataDialog>({
    title: '',
    body: '',
    actions: true,
  });
  processing: boolean = false;

  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  constructor() {
    this.form = this.formBuilder.group(
      {
        usuario_nombres: this.formBuilder.nonNullable.control<string>('', [Validators.required]),
        usuario_correo: this.formBuilder.nonNullable.control<string>('', [
          Validators.required,
          Validators.email,
        ]),
        usuario_telefono: this.formBuilder.nonNullable.control<string>('', [
          Validators.required,
          telefonoValidator,
        ]),
        password: this.formBuilder.nonNullable.control<string>('', [
          Validators.required,
          passwordStrengthValidator,
        ]),
        confirmPassword: this.formBuilder.nonNullable.control<string>('', [Validators.required]),
        terms: this.formBuilder.nonNullable.control<boolean>(false, [Validators.requiredTrue]),
      },
      { validators: passwordMatchValidator }
    );
  }

  register() {
    if (this.form.valid) {
      const data: Register = this.form.getRawValue();
      this.authService.register(data).subscribe({
        next: (response: any) => {
          console.log(response);
          this.form.reset();
          this.openConfirmDialog({
            title: 'Registro exitoso',
            body: 'Tu cuenta ha sido creada exitosamente.',
            actions: false,
            payload: { redirect: true },
          });
        },
        error: (err) => {
          console.log(err);
          this.openConfirmDialog({
            title: 'Error en el registro',
            body:
              err.error.message ||
              'Ha ocurrido un error al crear tu cuenta. Por favor, intenta nuevamente más tarde.',
            actions: false,
          });
        },
      });
    } else {
      this.dirtControls(this.form.controls);
      console.log('No valido');
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

  showPassword(control: AbstractControl): void {
    this.mostrarPassword = !this.mostrarPassword;
  }

  showConfirmPassword(control: AbstractControl): void {
    this.mostrarConfirmPassword = !this.mostrarConfirmPassword;
  }

  openConfirmDialog(data: DataDialog): void {
    this.currentDialogData$.set(data);
    this.isDialogOpen$.set(true);
  }

  handleDialogClose(result: Result): void {
    // Cierra el modal visualmente
    this.isDialogOpen$.set(false);
    console.log(result);

    // Lógica de negocio basada en el resultado
    if (result.body.redirect) {
      this.router.navigate(['/landing/login']);
    } else {
      console.log('No hay redirección.');
    }
  }
}
