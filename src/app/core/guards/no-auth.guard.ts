// =====================================================================
// noAuthGuard — El guardia inverso: "Si ya tienes token, no entres al Login".
// Evita que un usuario logueado vea la pantalla de Login navegando con el botón atrás.
// =====================================================================

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const noAuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si ya está logueado, no tiene sentido que vea el Login → lo mandamos al Dashboard
  if (authService.estaLogueado()) {
    return router.createUrlTree(['/app/muro']);
  }

  return true; // No logueado → puede ver el Login normalmente
};
