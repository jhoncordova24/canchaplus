import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { AuthFirebaseService } from '../../admin/services/auth-firebase.service';
import { map } from 'rxjs';

export const adminGuard: CanActivateChildFn = (childRoute, state) => {
  const authService = inject(AuthFirebaseService);
  const router = inject(Router);

  return authService.user$.pipe(
    map((user) => {
      if (user) {
        // Usuario autenticado → permitir acceso
        return true;
      } else {
        // No autenticado → redirigir al login
        return router.parseUrl('landing/login');
      }
    })
  );
};
