// =====================================================================
// AuthInterceptor — El portero silencioso de todas las peticiones HTTP.
// SRP: Su única responsabilidad es agregar el Bearer Token al header.
// DIP: Los servicios no saben cómo se agrega el token, solo lo usan.
// =====================================================================

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.obtenerToken();

  // Guard Clause (Clean Code): Si no hay token, dejamos pasar la petición sin modificarla.
  if (!token) {
    return next(req);
  }

  // Clonamos la petición (inmutabilidad) y le añadimos el gafete de seguridad.
  const peticionAutorizada = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });

  return next(peticionAutorizada);
};
