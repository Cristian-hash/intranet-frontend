import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MuroService, ComunicadoCreateDTO, TipoAudiencia } from '../../../core/services/muro.service';

// Definición de las opciones de audiencia para el selector visual
interface OpcionAudiencia {
  valor: TipoAudiencia;
  etiqueta: string;
  descripcion: string;
  icono: string;
}

@Component({
  selector: 'app-megafono',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './megafono.component.html',
  styleUrl: './megafono.component.scss'
})
export class MegafonoComponent {

  private readonly muroService = inject(MuroService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  cargando = signal(false);
  exito   = signal(false);
  error   = signal('');

  // Catálogo de audiencias disponibles
  readonly audiencias: OpcionAudiencia[] = [
    { valor: 'GLOBAL',     etiqueta: 'Toda la Comunidad', descripcion: 'Lo verán todos: Padres, Profesores y Alumnos', icono: '🌐' },
    { valor: 'PADRES',     etiqueta: 'Solo Padres',        descripcion: 'Solo aparece en el muro de Apoderados',       icono: '👨‍👦' },
    { valor: 'PROFESORES', etiqueta: 'Solo Profesores',    descripcion: 'Solo aparece en el muro del Profesorado',     icono: '👨‍🏫' },
    { valor: 'ALUMNOS',    etiqueta: 'Solo Alumnos',       descripcion: 'Solo aparece en el muro de los Alumnos',      icono: '🎓' },
  ];

  // Formulario reactivo con validaciones
  form: FormGroup = this.fb.group({
    titulo:           ['', [Validators.required, Validators.minLength(5), Validators.maxLength(120)]],
    contenido:        ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
    audienciaDestino: ['GLOBAL', Validators.required],
    gradoDestino:     ['']  // Opcional
  });

  get titulo()           { return this.form.get('titulo')!; }
  get contenido()        { return this.form.get('contenido')!; }
  get audienciaDestino() { return this.form.get('audienciaDestino')!; }

  // Longitud del contenido para el contador de caracteres
  get longitudContenido(): number {
    return this.contenido.value?.length ?? 0;
  }

  publicar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.cargando.set(true);
    this.error.set('');

    const dto: ComunicadoCreateDTO = this.form.value;

    this.muroService.publicarComunicado(dto).subscribe({
      next: () => {
        this.cargando.set(false);
        this.exito.set(true);
        this.form.reset({ audienciaDestino: 'GLOBAL' });
        // Redirige al Muro después de 2 segundos
        setTimeout(() => {
          this.exito.set(false);
          this.router.navigate(['/app/muro']);
        }, 2000);
      },
      error: () => {
        this.cargando.set(false);
        this.error.set('No se pudo publicar el comunicado. ¿El servidor está corriendo?');
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/app/muro']);
  }
}
