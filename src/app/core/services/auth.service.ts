// =====================================================================
// AuthService — La conexión entre Angular y el JWT de Spring Boot.
// SRP (refactorizado): Este servicio ya NO parsea JWTs manualmente.
// Eso ahora le pertenece a JwtUtil. Aquí solo vive: HTTP, storage, logout.
// =====================================================================

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { JwtUtil } from '../utils/jwt.util';

export interface LoginRequest {
  email: string;
  password: string;
}

// ⚠️ Debe coincidir EXACTAMENTE con JwtAuthResponse.java del backend
export interface LoginResponse {
  accessToken: string;  // ← El backend lo llama 'accessToken', no 'token'
  rol: string;           // ROLE_ADMIN, ROLE_PROFESOR, etc.
  nombre: string;        // Nombre del usuario para mostrar en la UI
}

// Información que extraemos y guardamos localmente
export interface UsuarioActual {
  id: number;
  email: string;
  rol: string;
  nombre: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly API_URL = 'http://localhost:8080';
  private readonly TOKEN_KEY = 'spn_token';
  private readonly ROL_KEY = 'spn_rol';
  private readonly NOMBRE_KEY = 'spn_nombre';

  constructor(private http: HttpClient, private router: Router) {}

  // =========================================================
  // CASO DE USO PRINCIPAL: Login
  // =========================================================
  login(credenciales: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/auth/login`, credenciales).pipe(
      tap(respuesta => {
        // ✅ El campo correcto es 'accessToken' (ver JwtAuthResponse.java)
        localStorage.setItem(this.TOKEN_KEY, respuesta.accessToken);
        localStorage.setItem(this.ROL_KEY, respuesta.rol);
        localStorage.setItem(this.NOMBRE_KEY, respuesta.nombre);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.ROL_KEY);
    localStorage.removeItem(this.NOMBRE_KEY);
    this.router.navigate(['/login']);
  }

  // Acceso directo al Rol (sin parsear JWT cada vez)
  obtenerRolDirecto(): string | null {
    return localStorage.getItem(this.ROL_KEY);
  }

  // Nombre del usuario logueado para mostrar en el Sidebar
  obtenerNombre(): string | null {
    return localStorage.getItem(this.NOMBRE_KEY);
  }

  // =========================================================
  // UTILIDADES DE TOKEN (solo almacenamiento y validación)
  // El parseo del contenido del JWT vive en JwtUtil (SRP)
  // =========================================================


  obtenerToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  estaLogueado(): boolean {
    const token = this.obtenerToken();
    if (!token) return false;
    return !JwtUtil.estaVencido(token); // Delegamos al experto
  }

  obtenerRol(): string | null {
    const token = this.obtenerToken();
    return token ? JwtUtil.obtenerRol(token) : null; // Delegamos al experto
  }

  obtenerIdUsuario(): number | null {
    const token = this.obtenerToken();
    return token ? JwtUtil.obtenerIdUsuario(token) : null; // Delegamos al experto
  }
}
