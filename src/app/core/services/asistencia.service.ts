// =====================================================================
// AsistenciaService — El único archivo que habla con /alumno/asistencias.
// SRP: Solo sabe hacer peticiones HTTP sobre asistencias.
// DIP: Los componentes dependen de este servicio, no de HttpClient directamente.
// =====================================================================

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AsistenciaCalendarioDTO {
  fecha: string;
  dia: number;
  estado: 'PRESENTE' | 'AUSENTE';
}

@Injectable({ providedIn: 'root' })
export class AsistenciaService {

  private readonly API_URL = 'http://localhost:8080/alumno/asistencias';

  constructor(private http: HttpClient) {}

  /** Obtiene el calendario de asistencia del alumno autenticado */
  getCalendario(anio: number, mes: number): Observable<AsistenciaCalendarioDTO[]> {
    return this.http.get<AsistenciaCalendarioDTO[]>(
      `${this.API_URL}/calendario`,
      { params: { anio, mes } }
    );
  }
}
