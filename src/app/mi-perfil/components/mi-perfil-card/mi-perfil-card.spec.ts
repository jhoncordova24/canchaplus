// mi-perfil-card.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-mi-perfil-card',
  standalone: true,
  template: `
    <div class="p-6 bg-neutral-900 text-white rounded-2xl shadow-xl max-w-4xl mx-auto">
      <h2 class="text-2xl font-bold">Mi perfil</h2>
      <p>Contenido del perfil</p>
    </div>
  `
})
export class MiPerfilCard {}
