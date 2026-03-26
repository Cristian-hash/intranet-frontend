import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm: FormGroup;
  cargando = signal(false);
  errorMensaje = signal('');

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Si ya tiene sesión, lo mandamos directo al Dashboard
    if (this.authService.estaLogueado()) {
      this.router.navigate(['/app/muro']);
    }

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  get email() { return this.loginForm.get('email')!; }
  get password() { return this.loginForm.get('password')!; }

  iniciarSesion(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.cargando.set(true);
    this.errorMensaje.set('');

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.cargando.set(false);
        this.router.navigate(['/app/muro']);
      },
      error: (err) => {
        this.cargando.set(false);
        if (err.status === 401 || err.status === 403) {
          this.errorMensaje.set('Correo o contraseña incorrectos.');
        } else {
          this.errorMensaje.set('Error de conexión. ¿Está corriendo el servidor?');
        }
      }
    });
  }
}
