import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { Router, RouterLink } from '@angular/router';
import { AuthFirebaseService } from '../../services/auth-firebase.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  standalone: true,
})
export class LoginComponent {
  private readonly authService = inject(AuthFirebaseService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  mostrarPassword: boolean = false;
  formBuilder = inject(FormBuilder);
  form = this.formBuilder.group({
    admin_email: this.formBuilder.nonNullable.control<string>('', Validators.required),
    admin_password: this.formBuilder.nonNullable.control<string>('', Validators.required),
  });
  authFail: boolean = false;

  loginAdmin() {
    if (this.form.valid) {
      const user: string = this.form.get('admin_email')?.value || '';
      const password: string = this.form.get('admin_password')?.value || '';
      this.authService
        .loginWithEmail(user, password)
        .then((usuario) => {
          this.router.navigate(['/admin/home']);
        })
        .catch((err) => console.error('Manejado desde el login: ', err));
    }
  }

  showPassword(control: AbstractControl) {
    this.mostrarPassword = !this.mostrarPassword;
  }
}
