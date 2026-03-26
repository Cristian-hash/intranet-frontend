import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet],
  template: `
    <div class="app-shell">
      <aside class="sidebar-placeholder">
        <!-- Ladrillo 4: Sidebar inteligente va aquí -->
        <p>Sidebar</p>
      </aside>
      <main class="main-content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .app-shell { display: flex; height: 100vh; }
    .sidebar-placeholder { width: 240px; background: #5A5D5A; color: white; padding: 16px; }
    .main-content { flex: 1; overflow-y: auto; padding: 24px; background: #f4f5f4; }
  `]
})
export class ShellComponent {}
