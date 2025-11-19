import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../../interfaces/user.interface';

export const roleGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);
  const user: User = userService.getUser();

  if (user.usuario_rol === '2') {
    //VALIDACIONES PARA CLIENTE
    if (state.url.includes('home') && state.url.includes('gestionar')) {
      router.navigateByUrl('/home/perfil');
      return false;
    } else {
      return true;
    }
  }

  if (user.usuario_rol === '1') {
    //VALIDACIONES PARA GERENTE
    if (state.url.includes('home') && state.url.includes('ascenso')) {
      router.navigateByUrl('/home/perfil');
      return false;
    } else {
      return true;
    }
  }

  return false;
};
