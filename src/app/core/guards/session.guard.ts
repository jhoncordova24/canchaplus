import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { inject } from '@angular/core';
import { User } from '../../interfaces/user.interface';

export const sessionGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  let user: User = userService.getUser();
  if (!user) {
    const router = inject(Router);
    router.navigateByUrl('/landing');
    return false;
  }
  return true;
};
