import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { noAuthGuard } from './core/guards/no-auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // PUERTA PÚBLICA: Login (protegida por noAuthGuard — si ya entraste, no vuelvas aquí)
  {
    path: 'login',
    canActivate: [noAuthGuard],
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },

  // DASHBOARD PROTEGIDO (Layout Shell con Sidebar)
  {
    path: 'app',
    canActivate: [authGuard], // ← La Aduana Principal: exige Token JWT válido
    loadComponent: () => import('./shared/components/shell/shell.component').then(m => m.ShellComponent),
    children: [
      { path: '', redirectTo: 'muro', pathMatch: 'full' },
      {
        path: 'muro',
        // Todos los roles autenticados pueden ver el muro
        loadComponent: () => import('./features/muro/muro.component').then(m => m.MuroComponent)
      },
      {
        path: 'asistencias',
        canActivate: [roleGuard(['AUXILIAR'])],
        loadComponent: () => import('./features/asistencias/asistencias.component').then(m => m.AsistenciasComponent)
      },
      {
        path: 'mis-asistencias',
        canActivate: [roleGuard(['ALUMNO', 'PADRE'])],
        loadComponent: () => import('./features/visor-asistencia/visor-asistencia.component').then(m => m.VisorAsistenciaComponent)
      },
      {
        path: 'cursos-profesor',
        canActivate: [roleGuard(['PROFESOR'])],
        loadComponent: () => import('./features/cursos-profesor/cursos-profesor.component').then(m => m.CursosProfesorComponent)
      },
      {
        path: 'megafono',
        canActivate: [roleGuard(['ADMIN'])], // Solo el Director puede publicar
        loadComponent: () => import('./features/muro/megafono/megafono.component').then(m => m.MegafonoComponent)
      },
      {
        path: 'admin',
        canActivate: [roleGuard(['ADMIN'])], // ← Doble cerrojo: Token + Rango Admin
        loadComponent: () => import('./features/admin/admin.component').then(m => m.AdminComponent)
      }
    ]
  },

  // Redirects de seguridad
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
