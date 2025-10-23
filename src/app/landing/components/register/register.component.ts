import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Register } from '../../../interfaces/register.interface';
import { passwordMatchValidator } from '../../../shared/validators/passwordMatchValidator';
import { AuthService } from '../../../core/services/auth.service';
import { telefonoValidator } from '../../../shared/validators/telefonoValidator';
import { passwordStrengthValidator } from '../../../shared/validators/passwordFuerteValidator';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private readonly formBuilder = inject(FormBuilder);

  private readonly authService = inject(AuthService);
  form: FormGroup;

  mostrarConfirmPassword = false;
  mostrarPassword = false;

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
          //show modal
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
}
