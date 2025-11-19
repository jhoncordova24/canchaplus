import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthFirebaseService } from '../../services/auth-firebase.service';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { DataDialog, Result } from '../../../interfaces/data-dialog.interface';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, DialogComponent],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  standalone: true,
})
export class LoginComponent {
  mostrarPassword: boolean = false;
  formBuilder = inject(FormBuilder);
  processing: boolean = false;
  form: FormGroup;
  isDialogOpen$ = signal(false);
  currentDialogData$ = signal<DataDialog>({
    title: '',
    body: '',
    actions: true,
  });

  private readonly authService = inject(AuthFirebaseService);
  private readonly router = inject(Router);

  constructor() {
    this.form = this.formBuilder.group({
      admin_email: this.formBuilder.nonNullable.control<string>('', Validators.required),
      admin_password: this.formBuilder.nonNullable.control<string>('', Validators.required),
    });
  }

  loginAdmin() {
    if (this.form.valid) {
      this.processing = true;
      const user: string = this.form.get('admin_email')?.value || '';
      const password: string = this.form.get('admin_password')?.value || '';
      this.authService
        .loginWithEmail(user, password)
        .then((usuario) => {
          this.router.navigate(['/admin/home']);
        })
        .catch((err) => {
          this.openConfirmDialog({
            title: 'Autenticacion fallida',
            body: 'Credenciales invalidas',
            actions: false,
          });
          console.error('Manejado desde el login: ', err);
          this.processing = false;
        });
    } else {
      this.dirtControls(this.form.controls);
      this.processing = false;
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
