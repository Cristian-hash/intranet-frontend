import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, ProfesorDTO, CursoDTO, PeriodoDTO, AsignacionCreateDTO, AlumnoDTO } from '../../core/services/admin.service';
import { AsignacionDocenteDTO } from '../../core/services/asistencia.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {

  private readonly adminService = inject(AdminService);

  // --- UI Tabs ---
  tabActual = signal<'DOCENTES' | 'ALUMNOS'>('DOCENTES');

  // --- Datos Maestros ---
  profesores = signal<ProfesorDTO[]>([]);
  cursos = signal<CursoDTO[]>([]);
  periodos = signal<PeriodoDTO[]>([]);
  asignaciones = signal<AsignacionDocenteDTO[]>([]);
  alumnos = signal<AlumnoDTO[]>([]);

  // --- Estado DOCENTES ---
  profesorIdSeleccionado = signal<number | null>(null);
  cursoIdSeleccionado = signal<number | null>(null);
  periodoIdSeleccionado = signal<number | null>(null);

  // --- Estado ALUMNOS ---
  cursoMatriculaId = signal<number | null>(null);
  alumnosCheck = signal<Record<number, boolean>>({});

  cargando = signal(true);
  cargandoForm = signal(false);
  exito = signal('');
  error = signal('');

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando.set(true);
    this.adminService.getAlumnos().subscribe(a => {
      this.alumnos.set(a);
      this.adminService.getProfesores().subscribe(p => {
        this.profesores.set(p);
        this.adminService.getCursos().subscribe(c => {
          this.cursos.set(c);
          this.adminService.getPeriodos().subscribe(per => {
            this.periodos.set(per);
            this.cargarAsignaciones();
          });
        });
      });
    });
  }

  cargarAsignaciones(): void {
    this.adminService.getAsignaciones().subscribe({
      next: (asigs) => {
        this.asignaciones.set(asigs);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }

  crearAsignacion(): void {
    const pId = this.profesorIdSeleccionado();
    const cId = this.cursoIdSeleccionado();
    const perId = this.periodoIdSeleccionado();

    if (!pId || !cId || !perId) {
      this.error.set('Por favor, selecciona Profesor, Curso y Periodo.');
      return;
    }

    this.cargandoForm.set(true);
    this.exito.set('');
    this.error.set('');

    const dto: AsignacionCreateDTO = { profesorId: pId, cursoId: cId, periodoId: perId };

    this.adminService.crearAsignacion(dto).subscribe({
      next: (nueva) => {
        this.cargandoForm.set(false);
        this.exito.set('✅ Asignación Docente creada con éxito.');
        this.cargarAsignaciones(); // Refrescar lista
        // Reset form
        this.profesorIdSeleccionado.set(null);
        this.cursoIdSeleccionado.set(null);
      },
      error: (err) => {
        this.cargandoForm.set(false);
        this.error.set(err.error?.message || 'Error al crear asignación (¿Ya está asignado?).');
      }
    });
  }

  desactivar(id: number): void {
    if (!confirm('¿Seguro que deseas desactivar esta asignación?')) return;
    this.adminService.desactivarAsignacion(id).subscribe({
      next: () => this.cargarAsignaciones(),
      error: () => alert('No se pudo desactivar')
    });
  }

  // --- MÉTODOS MATRÍCULA ---
  toggleAlumnoCheck(id: number, isChecked: boolean): void {
    this.alumnosCheck.update(current => ({ ...current, [id]: isChecked }));
  }

  matricularAlumnos(): void {
    const cid = this.cursoMatriculaId();
    const ids = Object.entries(this.alumnosCheck())
      .filter(([_, checked]) => checked)
      .map(([id, _]) => Number(id));

    if (!cid) {
      this.error.set('Selecciona el Aula a matricular.'); return;
    }
    if (ids.length === 0) {
      this.error.set('Selecciona al menos un alumno de la lista.'); return;
    }

    this.cargandoForm.set(true);
    this.exito.set(''); this.error.set('');

    this.adminService.matricular({ cursoId: cid, alumnoIds: ids }).subscribe({
      next: () => {
        this.cargandoForm.set(false);
        this.exito.set(`✅ Se matricularon ${ids.length} alumnos correctamente al aula.`);
        this.alumnosCheck.set({}); // Limpiar checks
      },
      error: (e) => {
        this.cargandoForm.set(false);
        this.error.set(e.error?.message || 'Error al matricular.');
      }
    });
  }
}
