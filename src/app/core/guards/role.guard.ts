// =====================================================================
// roleGuard — El guardia especial que verifica el RANGO del gafete.
// SRP: Solo verifica si tu ROL tiene permiso a esta ruta.
// =====================================================================
// Uso en routes: canActivate: [authGuard, roleGuard(['ROLE_ADMIN'])]

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = (rolesPermitidos: string[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Leemos el Rol directo del localStorage (sin parsear JWT)
    const rolActual = authService.obtenerRolDirecto();

    if (rolActual && rolesPermitidos.includes(rolActual)) {
      return true; // Tu gafete está en la lista de invitados
    }

    // Rango insuficiente → Lo mandamos a su muro personal
    return router.createUrlTree(['/app/muro']);
  };
};
