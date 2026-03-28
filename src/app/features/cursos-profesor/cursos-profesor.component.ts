import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsistenciaService, AsignacionDocenteDTO } from '../../core/services/asistencia.service';

@Component({
  selector: 'app-cursos-profesor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cursos-profesor.component.html',
  styleUrl: './cursos-profesor.component.scss'
})
export class CursosProfesorComponent implements OnInit {

  private readonly asistenciaService = inject(AsistenciaService);

  cursos = signal<AsignacionDocenteDTO[]>([]);
  cargandoCursos = signal(true);
  errorCursos = signal('');

  cursoSeleccionado = signal<AsignacionDocenteDTO | null>(null);
  alumnos = signal<any[]>([]);
  cargandoAlumnos = signal(false);

  ngOnInit(): void {
    this.asistenciaService.getMisCursos().subscribe({
      next: (data) => {
        this.cursos.set(data);
        this.cargandoCursos.set(false);
      },
      error: () => {
        this.errorCursos.set('No se pudieron cargar tus cursos asignados.');
        this.cargandoCursos.set(false);
      }
    });
  }

  seleccionarCurso(curso: AsignacionDocenteDTO): void {
    this.cursoSeleccionado.set(curso);
    this.cargandoAlumnos.set(true);
    
    this.asistenciaService.getAlumnosDelCurso(curso.cursoId).subscribe({
      next: (lista) => {
        this.alumnos.set(lista);
        this.cargandoAlumnos.set(false);
      },
      error: () => {
        this.alumnos.set([]);
        this.cargandoAlumnos.set(false);
      }
    });
  }
}
