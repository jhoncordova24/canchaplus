import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SolicitudAdmin } from '../../../interfaces/solicitud.interface';
import { AscensoService } from '../../services/ascenso.service';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../interfaces/user.interface';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { DataDialog, Result } from '../../../interfaces/data-dialog.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ascenso',
  imports: [ReactiveFormsModule, DialogComponent],
  templateUrl: './ascenso.html',
  styleUrl: './ascenso.scss',
  standalone: true,
})
export class Ascenso implements OnInit {
  form!: FormGroup;
  usuario!: User;
  selectedFile = signal<File | null>(null);
  isDialogOpen$ = signal(false);
  currentDialogData$ = signal<DataDialog>({
    title: '',
    body: '',
    actions: true,
  });
  solicitudExistente: boolean = false;
  processing: boolean = false;
  loading: boolean = true;

  private readonly formBuilder = inject(FormBuilder);
  private readonly ascensoService = inject(AscensoService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  constructor() {
    this.form = this.formBuilder.group({
      nombre: this.formBuilder.control<string>('', [Validators.required]),
      correo: this.formBuilder.control<string>('', [Validators.required]),
      telefono: this.formBuilder.control<string>('', [Validators.required]),
      experiencia: this.formBuilder.control<string>('', []),
      motivo: this.formBuilder.control<string>('', [Validators.required]),
      imgUrl: this.formBuilder.control<string>(''),
      terms: this.formBuilder.nonNullable.control<boolean>(false, [Validators.requiredTrue]),
    });
  }

  async ngOnInit() {
    this.usuario = this.userService.getUser();
    await this.verificarSolicitudExistente();
    if (!this.solicitudExistente) {
      this.patchUserForm();
    }
    this.loading = false;
  }

  patchUserForm() {
    this.form.get('nombre')?.patchValue(this.usuario.usuario_nombres);
    this.form.get('telefono')?.patchValue(this.usuario.usuario_telefono);
    this.form.get('correo')?.patchValue(this.usuario.usuario_correo);
  }

  dirtControls(control: any): void {
    Object.keys(this.form.controls).forEach((key) => {
      const control = this.form.get(key);
      if (control && !control.dirty) {
        control.markAsDirty();
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile.set(input.files[0]);
    }
  }

  submit() {
    if (this.form.valid) {
      this.processing = true;
      const file = this.selectedFile();
      const data: SolicitudAdmin = {
        ...this.form.getRawValue(),
        idUsuario: this.usuario.usuario_id,
      };
      if (file) {
        this.ascensoService.uploadImage(file, data.idUsuario).subscribe({
          next: (imageUrl: string) => {
            data.imgUrl = imageUrl;
            this.ascensoService
              .create(data)
              .then(() => {
                this.form.reset();
                this.processing = false;
                const dialogData: DataDialog = {
                  title: 'Solictud de ascenso enviada!',
                  body: 'Gracias por enviar tu solicitud de ascenso. Nuestro equipo revisará tu información y se pondrá en contacto contigo pronto.',
                  actions: false,
                  payload: { redirect: true },
                };
                this.openConfirmDialog(dialogData);
              })
              .catch((err) => {
                this.processing = false;
                const dialogData: DataDialog = {
                  title: 'Error al procesar la solicitud',
                  body: 'Hubo un error al enviar tu solicitud de ascenso. Por favor, intenta nuevamente más tarde.',
                  actions: false,
                  payload: { redirect: false },
                };
                this.openConfirmDialog(dialogData);
              });
          },
          error: (err) => {
            this.processing = false;
            console.log(err);
          },
        });
      } else {
        this.ascensoService
          .create(data)
          .then(() => {
            this.form.reset();
            this.processing = false;
            const dialogData: DataDialog = {
              title: 'Solictud de ascenso enviada!',
              body: 'Gracias por enviar tu solicitud de ascenso. Nuestro equipo revisará tu información y se pondrá en contacto contigo pronto.',
              actions: false,
              payload: { redirect: true },
            };
            this.openConfirmDialog(dialogData);
          })
          .catch((err) => {
            this.processing = false;
            const dialogData: DataDialog = {
              title: 'Error al procesar la solicitud',
              body: 'Hubo un error al enviar tu solicitud de ascenso. Por favor, intenta nuevamente más tarde.',
              actions: false,
              payload: { redirect: false },
            };
            this.openConfirmDialog(dialogData);
          });
      }
    } else {
      this.dirtControls(this.form.controls);
      console.log('Form no valido');
    }
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
      this.router.navigate(['/home/reservar']);
    } else {
      console.log('No hay redirección.');
    }
  }

  async verificarSolicitudExistente() {
    try {
      const data = await this.ascensoService.listAll();
      const solicitudes = data.filter(
        (solicitud) => solicitud.idUsuario === this.usuario.usuario_id
      );
      this.solicitudExistente = solicitudes.some((solicitud) => solicitud.estado === 'pendiente');
    } catch (err) {
      console.log(err);
    }
  }
}
