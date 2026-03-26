import { Routes } from '@angular/router';

export const routes: Routes = [
  // PUERTA PÚBLICA: Login
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },

  // DASHBOARD PROTEGIDO (Layout con Sidebar)
  // Aquí el AuthGuard bloqueará el acceso sin Token
  {
    path: 'app',
    loadComponent: () => import('./shared/components/shell/shell.component').then(m => m.ShellComponent),
    // canActivate: [AuthGuard],  // ← Se activa en el Ladrillo 3
    children: [
      { path: '', redirectTo: 'muro', pathMatch: 'full' },
      {
        path: 'muro',
        loadComponent: () => import('./features/muro/muro.component').then(m => m.MuroComponent)
      },
      {
        path: 'asistencias',
        loadComponent: () => import('./features/asistencias/asistencias.component').then(m => m.AsistenciasComponent)
      },
      {
        path: 'admin',
        loadComponent: () => import('./features/admin/admin.component').then(m => m.AdminComponent)
      }
    ]
  },

  // Redirige la raíz al login
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
