import { Component, inject, input, OnChanges, output } from '@angular/core';
import { TipoCanchas } from '../../../../../shared/constants/cancha-tipos';
import { Result } from '../../../../../interfaces/data-dialog.interface';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Cancha } from '../../../../../interfaces/cancha.interface';

export interface CanchaDataDialog {
  body: Cancha;
  action?: string;
}

@Component({
  selector: 'app-agregar-cancha-dialog',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './agregar-cancha-dialog.html',
  styleUrl: './agregar-cancha-dialog.scss',
})
export class AgregarCanchaDialog implements OnChanges {
  isOpen = input.required<boolean>();

  onCloseModal = output<Result>();

  dataModal = input.required<CanchaDataDialog>();

  tiposCancha = TipoCanchas;

  form: FormGroup;

  private readonly formBuilder = inject(FormBuilder);

  constructor() {
    this.form = this.formBuilder.group({
      nombre: this.formBuilder.control<string>('', Validators.required),
      tipo: this.formBuilder.control<string>('1', Validators.required),
    });
  }

  ngOnChanges(): void {
    if (this.dataModal()) {
      this.form.patchValue({
        nombre: this.dataModal().body.cancha_nombre || '',
        tipo: this.dataModal().body.tipocancha_id || '1',
      });
    }
  }
  onClose(): void {
    const result = { result: false, body: this.dataModal() || {} };
    this.onCloseModal.emit(result);
  }

  patchForm() {
    this.dataModal().body.cancha_nombre = this.form.get('nombre')!.value;
    this.dataModal().body.tipocancha_id = this.form.get('tipo')?.value;
  }

  onConfirmAction(): void {
    this.patchForm();

    const result: Result = {
      result: true,
      body: this.dataModal(),
    };
    this.onCloseModal.emit(result);
  }

  onBackdropClick(event: Event): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.onClose();
    }
  }
}
