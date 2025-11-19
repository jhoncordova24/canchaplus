import { Component, inject, input, OnChanges, output } from '@angular/core';
import { Result } from '../../../../../interfaces/data-dialog.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cancha } from '../../../../../interfaces/cancha.interface';

@Component({
  selector: 'app-agregar-tarifa-dialog',
  imports: [ReactiveFormsModule],
  templateUrl: './agregar-tarifa-dialog.html',
  styleUrl: './agregar-tarifa-dialog.scss',
})
export class AgregarTarifaDialog implements OnChanges {
  isOpen = input.required<boolean>();

  onCloseModal = output<Result>();

  dataModal = input.required<Partial<Cancha>>();

  form: FormGroup;

  private readonly formBuilder = inject(FormBuilder);

  constructor() {
    this.form = this.formBuilder.group({
      cancha_id: this.formBuilder.control<string>('', [Validators.required]),
      tarifa_preciohora: this.formBuilder.control<number | null>(null, [
        Validators.required,
        Validators.min(0),
      ]),
      tarifa_fechainicio: this.formBuilder.control<string>('', [Validators.required]),
      tarifa_fechafin: this.formBuilder.control<string>('', [Validators.required]),
    });
  }

  ngOnChanges(): void {
    if (this.dataModal()) {
      this.form.patchValue({
        cancha_id: this.dataModal().cancha_id,
      });
    }
  }

  onClose(): void {
    const result: Result = { result: false, body: this.dataModal() || {} };
    this.onCloseModal.emit(result);
    this.form.reset();
  }

  onConfirmAction(): void {
    if (this.form.valid) {
      console.log(this.form.getRawValue());
      const inicio = this.form.get('tarifa_fechainicio')?.value;
      const fin = this.form.get('tarifa_fechafin')?.value;
      const precio = this.form.get('tarifa_preciohora')?.value;
      const result: Result = {
        result: true,
        body: {
          ...this.dataModal(),
          tarifa_preciohora: precio,
          tarifa_fechainicio: inicio,
          tarifa_fechafin: fin,
        },
      };
      this.onCloseModal.emit(result);
      this.form.reset();
    } else {
      this.dirtControls();
    }
  }

  onBackdropClick(event: Event): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.onClose();
    }
  }

  dirtControls(): void {
    Object.keys(this.form.controls).forEach((key) => {
      const control = this.form.get(key);
      if (control && !control.dirty) {
        control.markAsDirty();
      }
    });
  }
}
