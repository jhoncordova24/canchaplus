import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const sessionGuard: CanActivateFn = (route, state) => {
  let jwt: string | null = localStorage.getItem('token');
  if (!jwt) {
    const router = inject(Router);
    router.navigateByUrl('/not-authorized');
    return false;
  }
  return true;
};
