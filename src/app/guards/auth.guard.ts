import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateFn}    from '@angular/router';
import {AuthService} from "@auth0/auth0-angular";
import {map} from "rxjs";

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {

  const authService = inject(AuthService);
  const requiredRole: string | undefined = route.data['role'];

  return authService.idTokenClaims$.pipe(
    map(claims => {
      if (!claims) {
        return false;
      }
      // If a role is required, check the user's roles
      if (requiredRole) {
        const hasRequiredRole = claims?.[`urn:raven/${requiredRole}`];
        if (!hasRequiredRole) {
          return false;
        }
      }
      return true;
    })
  );
};
