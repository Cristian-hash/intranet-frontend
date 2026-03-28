import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AsignacionDocenteDTO } from './asistencia.service';

export interface ProfesorDTO {
  perfilId: number;
  usuarioId: number;
  nombre: string;
  correo: string;
  especialidad: string;
}

export interface CursoDTO {
  id: number;
  nombre: string;
  grado: string;
  seccion: string;
  anio: number;
}

export interface PeriodoDTO {
  id: number;
  nombre: string;
  activo: boolean;
}

export interface AsignacionCreateDTO {
  profesorId: number;
  cursoId: number;
  periodoId: number;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly API_BASE = 'http://localhost:8080/admin';

  constructor(private http: HttpClient) {}

  getProfesores(): Observable<ProfesorDTO[]> {
    return this.http.get<ProfesorDTO[]>(`${this.API_BASE}/perfiles/profesor/listar`);
  }

  getCursos(): Observable<CursoDTO[]> {
    return this.http.get<CursoDTO[]>(`${this.API_BASE}/academico/cursos`);
  }

  getPeriodos(): Observable<PeriodoDTO[]> {
    return this.http.get<PeriodoDTO[]>(`${this.API_BASE}/periodos/listar`);
  }

  getAsignaciones(): Observable<AsignacionDocenteDTO[]> {
    return this.http.get<AsignacionDocenteDTO[]>(`${this.API_BASE}/asignaciones`);
  }

  crearAsignacion(dto: AsignacionCreateDTO): Observable<AsignacionDocenteDTO> {
    return this.http.post<AsignacionDocenteDTO>(`${this.API_BASE}/asignaciones`, dto);
  }

  desactivarAsignacion(id: number): Observable<string> {
    return this.http.delete(`${this.API_BASE}/asignaciones/${id}`, { responseType: 'text' });
  }
}
