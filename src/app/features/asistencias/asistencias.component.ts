import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AsistenciaService, AsistenciaDiariaDTO } from '../../core/services/asistencia.service';
import { AuthService } from '../../core/services/auth.service';

interface AlumnoFila {
  id: number;
  nombre: string;
  estado: 'PRESENTE' | 'AUSENTE' | 'TARDANZA';
}

@Component({
  selector: 'app-asistencias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './asistencias.component.html',
  styleUrl: './asistencias.component.scss'
})
export class AsistenciasComponent {

  private readonly asistenciaService = inject(AsistenciaService);
  private readonly authService = inject(AuthService);

  rolActual = this.authService.obtenerRolDirecto() ?? '';

  // --- Estado del formulario ---
  gradoSeleccionado = signal('1ro');
  seccionSeleccionada = signal('A');
  fechaSeleccionada = signal(new Date().toISOString().split('T')[0]); // Hoy

  // --- Catálogos ---
  grados = ['1ro', '2do', '3ro', '4to', '5to'];
  secciones = ['A', 'B', 'C'];

  // --- Estado de la lista ---
  alumnos = signal<AlumnoFila[]>([]);
  cargando = signal(false);
  exito = signal('');
  error = signal('');
  listaVisible = signal(false);

  // --- Contadores reactivos ---
  totalPresentes = computed(() => this.alumnos().filter(a => a.estado === 'PRESENTE').length);
  totalAusentes = computed(() => this.alumnos().filter(a => a.estado === 'AUSENTE').length);
  totalTardanzas = computed(() => this.alumnos().filter(a => a.estado === 'TARDANZA').length);

  cargarAlumnos(): void {
    this.cargando.set(true);
    this.error.set('');
    this.exito.set('');

    const grado = this.gradoSeleccionado();
    const seccion = this.seccionSeleccionada();

    this.asistenciaService.getAlumnosPorGradoYSeccion(grado, seccion).subscribe({
      next: (lista) => {
        this.alumnos.set(
          lista.map((a: any) => ({
            id: a.usuarioId ?? a.perfilId ?? a.id,
            nombre: a.nombre ?? 'Alumno #' + (a.usuarioId ?? a.id),
            estado: 'PRESENTE' as const
          }))
        );
        this.listaVisible.set(true);
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
        this.error.set('No se pudo cargar la lista de alumnos. ¿El backend está corriendo?');
      }
    });
  }

  toggleEstado(alumno: AlumnoFila): void {
    const orden: AlumnoFila['estado'][] = ['PRESENTE', 'AUSENTE', 'TARDANZA'];
    const idx = orden.indexOf(alumno.estado);
    alumno.estado = orden[(idx + 1) % orden.length];
    // Forzar recalculo de los contadores
    this.alumnos.set([...this.alumnos()]);
  }

  enviarAsistencia(): void {
    this.cargando.set(true);
    this.error.set('');

    const dto: AsistenciaDiariaDTO = {
      fecha: this.fechaSeleccionada(),
      grado: this.gradoSeleccionado(),
      seccion: this.seccionSeleccionada(),
      alumnosAusentesIds: this.alumnos().filter(a => a.estado === 'AUSENTE').map(a => a.id),
      alumnosTardanzaIds: this.alumnos().filter(a => a.estado === 'TARDANZA').map(a => a.id),
    };

    this.asistenciaService.registrarAsistenciaDiaria(dto).subscribe({
      next: (msg) => {
        this.cargando.set(false);
        this.exito.set(msg);
        this.listaVisible.set(false);
      },
      error: () => {
        this.cargando.set(false);
        this.error.set('Error al registrar asistencia. Intenta de nuevo.');
      }
    });
  }
}
