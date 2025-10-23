import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Login } from '../../../interfaces/login.interface';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  mostrarPassword: boolean = false;
  formBuilder = inject(FormBuilder);
  form = this.formBuilder.group({
    usuario_correo: this.formBuilder.nonNullable.control<string>('', Validators.required),
    password: this.formBuilder.nonNullable.control<string>('', Validators.required),
  });
  authFail: boolean = false;

  login() {
    if (this.form.valid) {
      const data: Login = this.form.getRawValue();

      this.authService.login(data).subscribe({
        next: (response: any) => {
          console.log(response);
          if (response.success) {
            this.userService.saveToken(response.data.token);
            this.userService.saveUser(response.data.usuario);
            this.router.navigate(['/home/']);
          } else {
            this.authFail = true;
          }
        },
        error: (error) => {
          if (!error.error.success) this.authFail = true;
        },
      });
    } else {
      console.log('ERROR DATA');
    }
  }

  showPassword(control: AbstractControl) {
    this.mostrarPassword = !this.mostrarPassword;
  }
}
