import { Component } from '@angular/core';
import { SidebarComponent } from '../home/components/sidebar/sidebar.component';
import { MiPerfilCardComponent } from './components/mi-perfil-card/mi-perfil-card';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [SidebarComponent, MiPerfilCardComponent],
  templateUrl: './mi-perfil.html',
})
export class MiPerfil {}
