import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  template: `
    <div class="app-shell">
      <app-sidebar />
      <main class="main-content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .app-shell    { display: flex; height: 100vh; overflow: hidden; }
    .main-content { flex: 1; overflow-y: auto; padding: 24px; background: #f4f5f4; }
  `]
})
export class ShellComponent {}
