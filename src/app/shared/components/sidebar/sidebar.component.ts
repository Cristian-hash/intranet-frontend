import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

// Contrato de forma de un ítem de menú
interface MenuItem {
  label: string;
  icon: string;
  route: string;
  roles: string[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  // inject() está disponible en el contexto de clase, ANTES del constructor
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // Signals reactivos: se inicializan con el servicio ya disponible
  rolActual = signal(this.authService.obtenerRolDirecto() ?? '');
  nombreUsuario = signal(this.authService.obtenerNombre() ?? 'Usuario');

  private readonly todosLosMenuItems: MenuItem[] = [
    { label: 'Muro',        icon: '📣', route: '/app/muro',        roles: ['ADMIN', 'PROFESOR', 'PADRE', 'ALUMNO'] },
    { label: 'Asistencias', icon: '📋', route: '/app/asistencias', roles: ['ADMIN', 'PROFESOR'] },
    { label: 'Administrar', icon: '⚙️', route: '/app/admin',       roles: ['ADMIN'] },
  ];

  menuVisible = computed(() =>
    this.todosLosMenuItems.filter(item => item.roles.includes(this.rolActual()))
  );

  badgeRol = computed(() => {
    const mapas: Record<string, string> = {
      'ADMIN':    '🔑 Admin',
      'PROFESOR': '👨‍🏫 Profesor',
      'PADRE':    '👨‍👦 Apoderado',
      'ALUMNO':   '🎓 Alumno',
    };
    return mapas[this.rolActual()] ?? this.rolActual();
  });

  cerrarSesion(): void {
    this.authService.logout();
  }
}
