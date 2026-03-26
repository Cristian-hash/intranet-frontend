import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  template: `
    <div style="display:flex; justify-content:center; align-items:center; height:100vh; background:#f4f5f4;">
      <div style="background:white; padding:40px; border-radius:12px; border:2px solid #2c2e2c; box-shadow:4px 4px 0 #5A5D5A; text-align:center; min-width:350px;">
        <h1 style="font-size:1.4rem; font-weight:800; margin-bottom:8px;">Colegio San Pedro del Norte</h1>
        <p style="color:#8d9190; margin-bottom:24px;">Sistema de Intranet</p>
        <p style="color:#8EB924; font-weight:700;">✅ Ladrillo 1 completado — Setup listo</p>
        <p style="margin-top:8px; font-size:0.85rem; color:#5A5D5A;">El formulario de Login se construye en el Ladrillo 2</p>
      </div>
    </div>
  `
})
export class LoginComponent {}
