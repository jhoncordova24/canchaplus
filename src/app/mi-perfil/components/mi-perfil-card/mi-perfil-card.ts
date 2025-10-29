import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// ✅ Interfaz del perfil con firma de índice
interface Perfil {
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  pais: string;
  fechaRegistro: string;
  rol: string;
  [key: string]: string;
}

interface Reservacion {
  cancha: string;
  fecha: string;
  hora: string;
  estado: 'Confirmada' | 'Pendiente' | 'Cancelada';
}

@Component({
  selector: 'app-mi-perfil-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mi-perfil-card.html',
  styleUrls: ['./mi-perfil-card.scss'],
})
export class MiPerfilCardComponent {
  profile: Perfil = {
    nombre: 'Juan',
    apellido: 'Pérez',
    correo: 'juan.perez@example.com',
    telefono: '+51 987654321',
    pais: 'Perú',
    fechaRegistro: '12/03/2024',
    rol: 'Jugador Premium',
  };

  puntos = 2450;
  puntosMax = 5000;
  editMode = false;

  fields = [
    { key: 'nombre', icon: 'fa-user', label: 'Nombre', placeholder: 'Tu nombre' },
    { key: 'apellido', icon: 'fa-user', label: 'Apellido', placeholder: 'Tu apellido' },
    { key: 'correo', icon: 'fa-envelope', label: 'Correo', placeholder: 'correo@ejemplo.com', type: 'email' },
    { key: 'telefono', icon: 'fa-phone', label: 'Teléfono', placeholder: '+51 9XXXXXXX' },
    { key: 'pais', icon: 'fa-globe', label: 'País', placeholder: 'Perú' },
  ];

  // ⚽ Mis últimas reservaciones de cancha
  ultimasReservaciones: Reservacion[] = [
    { cancha: 'Cancha Sintética Los Olivos', fecha: '25/10/2025', hora: '18:00 - 19:00', estado: 'Confirmada' },
    { cancha: 'Complejo Deportivo San Martín', fecha: '23/10/2025', hora: '20:00 - 21:00', estado: 'Pendiente' },
    { cancha: 'Arena Sport Center', fecha: '20/10/2025', hora: '17:00 - 18:00', estado: 'Cancelada' },
  ];

  habilitarEdicion() {
    this.editMode = true;
  }

  cancelar() {
    this.editMode = false;
  }

  guardar() {
    this.editMode = false;
    alert('✅ Perfil actualizado correctamente');
  }

  get porcentajeProgreso() {
    return Math.min((this.puntos / this.puntosMax) * 100, 100);
  }
}
