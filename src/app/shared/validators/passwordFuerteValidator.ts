import { AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;

  if (!value) return null;

  const hasUpperCase = /[A-Z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
  const hasMinlenght = value.length >= 8;

  const isValid = hasUpperCase && hasNumber && hasSpecialChar && hasMinlenght;

  return isValid ? null : { passwordWeak: true };
}
