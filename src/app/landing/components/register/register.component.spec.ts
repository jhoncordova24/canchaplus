import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { of } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const mockRegisterData = {
    usuario_nombres: 'Juan Pérez',
    usuario_correo: 'juan@example.com',
    usuario_telefono: '999999999',
    password: 'StrongPass123!',
    confirmPassword: 'StrongPass123!',
    terms: true,
  };

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, ReactiveFormsModule],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideRouter([]),
        { provide: AuthService, useValue: authServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería tener el formulario inválido al inicio', () => {
    expect(component.form.valid).toBeFalse();
  });

  it('debería validar el formulario con datos correctos', () => {
    component.form.setValue(mockRegisterData);
    expect(component.form.valid).toBeTrue();
  });

  it('debería llamar a register y resetear el formulario si es válido', () => {
    authServiceSpy.register.and.returnValue(of({ success: true }));

    component.form.setValue(mockRegisterData);
    component.register();

    expect(authServiceSpy.register).toHaveBeenCalledWith(mockRegisterData);
    expect(component.form.pristine).toBeTrue(); // después de reset
  });

  it('debería marcar controles como dirty si el formulario es inválido', () => {
    spyOn(component, 'dirtControls').and.callThrough();

    component.form.setValue({ ...mockRegisterData, usuario_correo: '' }); // correo inválido
    component.register();

    expect(component.dirtControls).toHaveBeenCalled();
  });

  it('debería alternar mostrarPassword con showPassword()', () => {
    const initial = component.mostrarPassword;
    component.showPassword(component.form.get('password')!);
    expect(component.mostrarPassword).toBe(!initial);
  });

  it('debería alternar mostrarConfirmPassword con showConfirmPassword()', () => {
    const initial = component.mostrarConfirmPassword;
    component.showConfirmPassword(component.form.get('confirmPassword')!);
    expect(component.mostrarConfirmPassword).toBe(!initial);
  });
});
