// =====================================================================
// MuroService — El único archivo que habla con /muro del backend.
// SRP: Solo sabe hacer peticiones HTTP al muro de comunicados.
// DIP: Los componentes dependen de este servicio, no de HttpClient directamente.
// =====================================================================

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ComunicadoResponseDTO {
  id: number;
  titulo: string;
  contenido: string;
  autor: string;
  fechaPublicacion: string;
  yaLoLei: boolean;
}

// Audiencias disponibles → deben coincidir con el enum TipoAudiencia.java del backend
export type TipoAudiencia = 'GLOBAL' | 'PADRES' | 'PROFESORES' | 'ALUMNOS';

export interface ComunicadoCreateDTO {
  titulo: string;
  contenido: string;
  audienciaDestino: TipoAudiencia;
  gradoDestino?: string; // Opcional: "3er Grado"
}

@Injectable({ providedIn: 'root' })
export class MuroService {

  private readonly API_URL = 'http://localhost:8080/muro';

  constructor(private http: HttpClient) {}

  /** Obtiene los comunicados dirigidos al usuario autenticado */
  getMisMensajes(): Observable<ComunicadoResponseDTO[]> {
    return this.http.get<ComunicadoResponseDTO[]>(`${this.API_URL}/mis-noticias`);
  }

  /** Marca un comunicado como leído (firma electrónica de enterado) */
  confirmarLectura(comunicadoId: number): Observable<string> {
    // responseType: 'text' porque Spring Boot responde con un String plano, no JSON
    return this.http.post(
      `${this.API_URL}/${comunicadoId}/confirmar-lectura`,
      {},
      { responseType: 'text' }
    );
  }
  /** Publica un comunicado nuevo (solo ADMIN) */
  publicarComunicado(dto: ComunicadoCreateDTO): Observable<string> {
    return this.http.post(
      `${this.API_URL}/publicar`,
      dto,
      { responseType: 'text' }
    );
  }
}
