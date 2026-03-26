// =====================================================================
// AuthService — La conexión entre Angular y el JWT de Spring Boot
// Regla de Oro: Este es el ÚNICO archivo que habla con /auth del backend.
// =====================================================================

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

// Información que extraemos del JWT para saber quién eres
export interface UsuarioActual {
  id: number;
  email: string;
  rol: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly API_URL = 'http://localhost:8080';
  private readonly TOKEN_KEY = 'spn_token';

  constructor(private http: HttpClient, private router: Router) {}

  // =========================================================
  // CASO DE USO PRINCIPAL: Login
  // =========================================================
  login(credenciales: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/auth/login`, credenciales).pipe(
      tap(respuesta => this.guardarToken(respuesta.token))
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/login']);
  }

  // =========================================================
  // UTILIDADES PRIVADAS (Clean Code)
  // =========================================================
  private guardarToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  obtenerToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  estaLogueado(): boolean {
    const token = this.obtenerToken();
    if (!token) return false;
    return !this.estaVencido(token);
  }

  obtenerRol(): string | null {
    const token = this.obtenerToken();
    if (!token) return null;
    try {
      // El JWT tiene 3 partes separadas por punto. La parte del medio contiene los datos.
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload['role'] ?? null;
    } catch {
      return null;
    }
  }

  obtenerIdUsuario(): number | null {
    const token = this.obtenerToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload['sub'] ? Number(payload['sub']) : null;
    } catch {
      return null;
    }
  }

  private estaVencido(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // 'exp' está en segundos. Date.now() en milisegundos, por eso dividimos.
      return payload['exp'] < Date.now() / 1000;
    } catch {
      return true;
    }
  }
}
