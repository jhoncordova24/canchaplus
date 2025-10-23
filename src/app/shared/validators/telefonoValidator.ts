import { AbstractControl, ValidationErrors } from '@angular/forms';

export function telefonoValidator(control: AbstractControl): ValidationErrors | null {
  const valor = control.value;

  if (!valor) return null;

  const soloNumeros = /^[0-9]+$/.test(valor);

  if (!soloNumeros) {
    return { soloNumeros: true };
  }

  return null;
}
