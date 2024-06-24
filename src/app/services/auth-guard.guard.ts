import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  let authService: AuthService = inject(AuthService);
  let router: Router = inject(Router);
  if (authService.IsAuthenticated()) {
    return true;
  } else {
    router.navigate(['/Login']);
    return false;
  }
};
