import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { CanchaCardComponent } from './components/cancha-card/cancha-card';
import { TarifaCardComponent } from './components/tarifa-card/tarifa-card';

@Component({
  selector: 'app-agregar-canchas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent,
    CanchaCardComponent,
    TarifaCardComponent
  ],
  templateUrl: './agregar-canchas.html',
  styleUrls: ['./agregar-canchas.scss']
})
export class AgregarCanchasComponent {

  // =====================
  //   DATOS INICIALES
  // =====================

  canchas = [
    {
      id: 1,
      nombre: "Cancha Sintética A",
      estado: "Disponible",
      imagen: "https://blog.meridianbet.pe/wp-content/uploads/2025/06/Cancha-de-futbol-Meridianbet.jpg",
      tarifas: [
        { id: 1, nombre: "Día", precio: 40 },
        { id: 2, nombre: "Noche", precio: 55 }
      ]
    },
    {
      id: 2,
      nombre: "Cancha Sintética B",
      estado: "Mantenimiento",
      imagen: "https://recreasport.com/wp-content/uploads/2017/04/SAM_0191-2.jpg",
      tarifas: [
        { id: 1, nombre: "Día", precio: 35 }
      ]
    }
  ];

  // =====================
  //   ESTADOS DE MODAL
  // =====================

  modalCancha = false;
  modalTarifa = false;

  editandoCancha: any = null;
  editandoTarifa: any = null;

  // =====================
  //       CANCHAS
  // =====================

  agregarCancha() {
    this.editandoCancha = {
      id: Date.now(),
      nombre: "",
      estado: "Disponible",
      imagen: "",
      tarifas: []
    };
    this.modalCancha = true;
  }

  editarCancha(c: any) {
    this.editandoCancha = JSON.parse(JSON.stringify(c));
    this.modalCancha = true;
  }

  guardarCancha() {
    if (!this.editandoCancha) return;

    const index = this.canchas.findIndex(c => c.id === this.editandoCancha.id);

    if (index !== -1) {
      this.canchas[index] = { ...this.editandoCancha };
    } else {
      this.canchas.push({ ...this.editandoCancha });
    }

    this.modalCancha = false;
    this.editandoCancha = null;
  }

  cancelarCancha() {
    this.modalCancha = false;
    this.editandoCancha = null;
  }

  // =====================
  //       TARIFAS
  // =====================

  agregarTarifa(cancha: any) {
    this.editandoCancha = cancha;
    this.editandoTarifa = {
      id: Date.now(),
      nombre: "",
      precio: 0
    };
    this.modalTarifa = true;
  }

  editarTarifa(cancha: any, tarifa: any) {
    this.editandoCancha = cancha;
    this.editandoTarifa = { ...tarifa };
    this.modalTarifa = true;
  }

  guardarTarifa() {
    if (!this.editandoTarifa || !this.editandoCancha) return;

    if (!Array.isArray(this.editandoCancha.tarifas)) {
      this.editandoCancha.tarifas = [];
    }

    const tarifas = this.editandoCancha.tarifas;

    const index = tarifas.findIndex(
      (t: any) => t && t.id === this.editandoTarifa.id
    );

    if (index !== -1) {
      tarifas[index] = { ...this.editandoTarifa };
    } else {
      tarifas.push({ ...this.editandoTarifa });
    }

    this.editandoTarifa = null;
    this.modalTarifa = false;
  }

  cancelarTarifa() {
    this.editandoTarifa = null;
    this.modalTarifa = false;
  }
}
