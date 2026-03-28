import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AsistenciaService, AsistenciaCalendarioDTO } from '../../core/services/asistencia.service';

@Component({
  selector: 'app-visor-asistencia',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './visor-asistencia.component.html',
  styleUrl: './visor-asistencia.component.scss'
})
export class VisorAsistenciaComponent implements OnInit {

  private readonly asistenciaService = inject(AsistenciaService);

  meses = [
    { id: 3, nombre: 'Marzo' }, { id: 4, nombre: 'Abril' },
    { id: 5, nombre: 'Mayo' }, { id: 6, nombre: 'Junio' },
    { id: 7, nombre: 'Julio' }, { id: 8, nombre: 'Agosto' },
    { id: 9, nombre: 'Sptiembre' }, { id: 10, nombre: 'Octubre' },
    { id: 11, nombre: 'Noviembre' }, { id: 12, nombre: 'Diciembre' }
  ];

  mesActual = signal<number>(3);
  anioActual = signal<number>(2026);

  asistencias = signal<AsistenciaCalendarioDTO[]>([]);
  cargando = signal(true);
  error = signal('');

  // Resumen
  totalPresentes = signal(0);
  totalFaltas = signal(0);
  totalTardanzas = signal(0);

  ngOnInit(): void {
    const hoy = new Date();
    // Ajustado para el dummy data de 2026
    this.mesActual.set(hoy.getFullYear() > 2025 ? hoy.getMonth() + 1 : 3);
    this.anioActual.set(hoy.getFullYear() > 2025 ? hoy.getFullYear() : 2026);
    this.cargarCalendario();
  }

  cargarCalendario(): void {
    this.cargando.set(true);
    this.error.set('');
    
    this.asistenciaService.getCalendario(this.mesActual(), this.anioActual()).subscribe({
      next: (registros) => {
        this.asistencias.set(registros);
        this.calcularResumen(registros);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar las asistencias (revisa si el backend está activo).');
        this.cargando.set(false);
      }
    });
  }

  calcularResumen(registros: AsistenciaCalendarioDTO[]): void {
    let p = 0, f = 0, t = 0;
    registros.forEach(r => {
      if (r.estado === 'PRESENTE') p++;
      else if (r.estado === 'AUSENTE') f++;
      else if (r.estado === 'TARDANZA') t++;
    });
    this.totalPresentes.set(p);
    this.totalFaltas.set(f);
    this.totalTardanzas.set(t);
  }

  getMesNombre(id: number): string {
    return this.meses.find(m => m.id === id)?.nombre || 'Mes';
  }
}
