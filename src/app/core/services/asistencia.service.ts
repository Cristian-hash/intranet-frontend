// =====================================================================
// AsistenciaService — Habla con /alumno/asistencias y /auxiliar/asistencias
// =====================================================================

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// --- Tipos compartidos ---

export interface AsistenciaCalendarioDTO {
  fecha: string;
  dia: number;
  estado: 'PRESENTE' | 'AUSENTE' | 'TARDANZA' | 'JUSTIFICADO';
}

export interface AsistenciaDiariaDTO {
  fecha: string;       // "2026-03-28"
  grado: string;       // "1ro"
  seccion: string;     // "A"
  alumnosAusentesIds: number[];
  alumnosTardanzaIds: number[];
}

export interface AsignacionDocenteDTO {
  id: number;
  profesorId: number;
  profesorNombre: string;
  cursoId: number;
  cursoNombre: string;
  grado: string;
  seccion: string;
  periodoId: number;
  periodoNombre: string;
  activa: boolean;
}

@Injectable({ providedIn: 'root' })
export class AsistenciaService {

  private readonly API_BASE = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  // --- ALUMNO/PADRE: Ver calendario ---
  getCalendario(anio: number, mes: number): Observable<AsistenciaCalendarioDTO[]> {
    return this.http.get<AsistenciaCalendarioDTO[]>(
      `${this.API_BASE}/alumno/asistencias/calendario`,
      { params: { anio, mes } }
    );
  }

  // --- AUXILIAR: Obtener alumnos por grado y sección ---
  getAlumnosPorGradoYSeccion(grado: string, seccion: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_BASE}/auxiliar/asistencias/alumnos`, {
      params: { grado, seccion }
    });
  }

  // --- REGISTRO AUXILIAR: Registrar asistencia del día ---
  registrarAsistenciaDiaria(dto: AsistenciaDiariaDTO): Observable<string> {
    return this.http.post(
      `${this.API_BASE}/auxiliar/asistencias/diaria`,
      dto,
      { responseType: 'text' }
    );
  }

  // --- PROFESOR: Obtener mis cursos asignados ---
  getMisCursos(): Observable<AsignacionDocenteDTO[]> {
    return this.http.get<AsignacionDocenteDTO[]>(`${this.API_BASE}/profesor/mis-cursos`);
  }

  // --- ADMIN/PROFESOR: Ver alumnos de un curso ---
  getAlumnosDelCurso(cursoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_BASE}/admin/academico/curso/${cursoId}/alumnos`);
  }
}
