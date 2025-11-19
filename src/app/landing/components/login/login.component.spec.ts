import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { User } from '../../../interfaces/user.interface';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockUser: User = {
    usuario_id: 1,
    usuario_correo: 'test@example.com',
    usuario_nombres: 'Juan Pérez',
    usuario_rol: 2,
    usuario_fecharegistro: '2025-01-01',
    usuario_telefono: '999999999',
    usuario_rolNombre: 'Administrador',
  };
  const activatedRouteStub = {
    snapshot: {
      paramMap: new Map(),
      queryParamMap: new Map(),
    },
  };

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    userServiceSpy = jasmine.createSpyObj('UserService', ['saveToken', 'saveUser']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideRouter([]),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
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
    component.form.setValue({
      usuario_correo: 'test@example.com',
      password: '123456',
    });
    expect(component.form.valid).toBeTrue();
  });

  it('debería llamar a saveUser con el usuario correcto', () => {
    const mockResponse = {
      success: true,
      data: {
        token: 'abc123',
        usuario: mockUser,
      },
    };

    authServiceSpy.login.and.returnValue(of(mockResponse));

    component.form.setValue({
      usuario_correo: mockUser.usuario_correo,
      password: '123456',
    });
    component.login();

    expect(authServiceSpy.login).toHaveBeenCalled();
    expect(userServiceSpy.saveToken).toHaveBeenCalledWith('abc123');
    expect(userServiceSpy.saveUser).toHaveBeenCalledWith(mockResponse.data.usuario);
    expect(component.authFail).toBeFalse();
  });

  it('debería activar authFail si el login falla', () => {
    const mockError = {
      error: { success: false },
    };

    authServiceSpy.login.and.returnValue(throwError(() => mockError));

    component.form.setValue({
      usuario_correo: 'test@example.com',
      password: 'wrong',
    });

    component.login();

    expect(component.authFail).toBeTrue();
  });

  it('debería alternar mostrarPassword con showPassword()', () => {
    const initial = component.mostrarPassword;
    component.showPassword(component.form.get('password')!);
    expect(component.mostrarPassword).toBe(!initial);
  });
});

describe('LoginComponent (Integración)', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpMock: HttpTestingController;
  let router: Router;
  let userService: UserService;

  const activatedRouteStub = {
    snapshot: {
      paramMap: new Map(),
      queryParamMap: new Map(),
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        AuthService,
        UserService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController); // ✅ Aquí sí funciona
    router = TestBed.inject(Router);
    userService = TestBed.inject(UserService);
    fixture.detectChanges();
  });

  it('debería enviar login y guardar datos si es exitoso', fakeAsync(() => {
    spyOn(router, 'navigate');
    spyOn(userService, 'saveToken');
    spyOn(userService, 'saveUser');

    component.form.setValue({
      usuario_correo: 'test@example.com',
      password: '123456',
    });

    component.login();

    const req = httpMock.expectOne(`${environment.api_url}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush({
      success: true,
      data: {
        token: 'abc123',
        usuario: {
          usuario_id: 1,
          usuario_correo: 'test@example.com',
          usuario_nombres: 'Juan Pérez',
          usuario_rol: 2,
          usuario_fecharegistro: '2025-01-01',
          usuario_telefono: '999999999',
          usuario_rolNombre: 'Administrador',
        },
      },
    });

    tick();

    expect(userService.saveToken).toHaveBeenCalledWith('abc123');
    expect(userService.saveUser).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/home/']);
    expect(component.authFail).toBeFalse();
  }));

  it('debería activar authFail si el login falla', fakeAsync(() => {
    component.form.setValue({
      usuario_correo: 'test@example.com',
      password: 'wrong',
    });

    component.login();

    const req = httpMock.expectOne(`${environment.api_url}/auth/login`);
    req.flush({ success: false }, { status: 401, statusText: 'Unauthorized' });

    tick();

    expect(component.authFail).toBeTrue();
  }));
});
