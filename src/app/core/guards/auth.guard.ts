// =====================================================================
// AuthGuard — El guardia de seguridad en la puerta de las rutas privadas.
// SRP: Solo decide si una ruta puede activarse o no.
// DIP: Las rutas no saben CÓMO se verifica el token, solo que se verifica.
// =====================================================================

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Guard Clause (Clean Code): Si está logueado, abrimos la puerta.
  if (authService.estaLogueado()) {
    return true;
  }

  // Si no tiene token válido, lo mandamos al login.
  return router.createUrlTree(['/login']);
};
