import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../auth/services/token.service';

export const AuthGuard = () => {
  const router = inject(Router);
  const tokenService = inject(TokenService);
  const token = tokenService.getToken();
  
  if (token) {
    return true;
  }
  return router.parseUrl('/auth/login');
}; 