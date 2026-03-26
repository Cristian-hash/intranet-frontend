import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MuroService, ComunicadoResponseDTO } from '../../core/services/muro.service';

@Component({
  selector: 'app-muro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './muro.component.html',
  styleUrl: './muro.component.scss'
})
export class MuroComponent implements OnInit {

  private readonly muroService = inject(MuroService);

  // Signals reactivos: cada uno representa un estado de la pantalla
  comunicados   = signal<ComunicadoResponseDTO[]>([]);
  cargando      = signal(true);
  error         = signal('');
  firmandoId    = signal<number | null>(null); // ID del comunicado que se está firmando

  ngOnInit(): void {
    this.cargarMuro();
  }

  // =========================================================
  // CASO DE USO 1: Cargar el Muro
  // =========================================================
  cargarMuro(): void {
    this.cargando.set(true);
    this.error.set('');

    this.muroService.getMisMensajes().subscribe({
      next: (lista) => {
        this.comunicados.set(lista);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el muro. Verifica que el servidor esté corriendo.');
        this.cargando.set(false);
      }
    });
  }

  // =========================================================
  // CASO DE USO 2: Firmar de Enterado (El "Entendido")
  // =========================================================
  confirmarLectura(comunicado: ComunicadoResponseDTO): void {
    if (comunicado.yaLoLei) return; // Guard Clause: si ya fue firmado, no hacemos nada

    this.firmandoId.set(comunicado.id);

    this.muroService.confirmarLectura(comunicado.id).subscribe({
      next: () => {
        // Actualizamos SOLO el campo yaLoLei de ese comunicado sin recargar toda la lista
        this.comunicados.update(lista =>
          lista.map(c => c.id === comunicado.id ? { ...c, yaLoLei: true } : c)
        );
        this.firmandoId.set(null);
      },
      error: () => {
        this.firmandoId.set(null);
      }
    });
  }

  // Cuenta cuántos comunicados el usuario aún NO ha leído (para el badge)
  contarSinLeer(): number {
    return this.comunicados().filter(c => !c.yaLoLei).length;
  }
}
