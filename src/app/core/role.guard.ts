import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from '../users/services/user.service';
import { map, catchError, of } from 'rxjs';

export const RoleGuard = (route: ActivatedRouteSnapshot) => {
  const userService = inject(UserService);
  const router = inject(Router);
  const allowedRoles = route.data['roles'] as string[];
  
  return userService.getCurrentUser().pipe(
    map(user => {
      if (allowedRoles.includes(user.role)) {
        return true;
      }
      return router.parseUrl('/documents');
    }),
    catchError(() => {
      return of(router.parseUrl('/auth/login'));
    })
  );
}; 