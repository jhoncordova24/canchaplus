import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';  
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './reportes.html',
  styleUrl: './reportes.scss',
})
export class Reportes {

  activeTab: 'reservas' | 'puntos' = 'reservas';

  setTab(tab: 'reservas' | 'puntos') {
    this.activeTab = tab;
  }
  
  reservas = [
    {
      fecha: '2025-11-12',
      horario: '20:00 - 21:00',
      sede: 'PIURA',
      cancha: 'Cancha 3',
      estado: 'APROBADA',
      monto: 60,
      puntos: 20,
    },
    {
      fecha: '2025-11-10',
      horario: '19:00 - 20:00',
      sede: 'CASTILLA',
      cancha: 'Cancha 1',
      estado: 'CANCELADA',
      monto: 0,
      puntos: 0,
    },
    {
      fecha: '2025-11-05',
      horario: '18:00 - 19:00',
      sede: 'PIURA',
      cancha: 'Cancha 2',
      estado: 'PENDIENTE',
      monto: 60,
      puntos: 0,
    },
  ];

  puntos = [
    {
      fecha: '2025-11-12',
      detalle: 'Reserva Cancha 3 - Piura',
      tipo: 'CREDITO',
      puntos: 20,
      saldo: 320,
    },
    {
      fecha: '2025-11-10',
      detalle: 'Anulación reserva',
      tipo: 'DEBITO',
      puntos: -20,
      saldo: 300,
    },
  ];


  filtros = {
    fechaDesde: '',
    fechaHasta: '',
    estado: '',
    sede: '',
  };

 
  reservasFiltradas = [...this.reservas];
  puntosFiltrados = [...this.puntos];


  resumen = {
    reservasTotales: 0,
    reservasAprobadas: 0,
    canceladasNoShow: 0,
    puntosActuales: 0,
  };

  constructor() {
    this.calcularResumen();
  }

 
  aplicarFiltros() {
    this.reservasFiltradas = this.reservas.filter((r) => {
      const fecha = new Date(r.fecha);

      const desde = this.filtros.fechaDesde
        ? new Date(this.filtros.fechaDesde)
        : null;

      const hasta = this.filtros.fechaHasta
        ? new Date(this.filtros.fechaHasta)
        : null;

      const matchFecha =
        (!desde || fecha >= desde) && (!hasta || fecha <= hasta);

      const matchEstado = this.filtros.estado
        ? r.estado === this.filtros.estado
        : true;

      const matchSede = this.filtros.sede ? r.sede === this.filtros.sede : true;

      return matchFecha && matchEstado && matchSede;
    });
  }

 
  limpiarFiltros() {
    this.filtros = {
      fechaDesde: '',
      fechaHasta: '',
      estado: '',
      sede: '',
    };
    this.reservasFiltradas = [...this.reservas];
  }


  verDetalleReserva(reserva: any) {
    console.log('Detalle de reserva:', reserva);
    // Aquí podría ir un modal
  }

  exportarReservasExcel() {
    const element = document.getElementById('tablaReservas');
    const ws = XLSX.utils.table_to_sheet(element);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Reservas');
    XLSX.writeFile(wb, 'mis_reservas.xlsx');
  }

  exportarPuntosExcel() {
    const element = document.getElementById('tablaPuntos');
    const ws = XLSX.utils.table_to_sheet(element);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Puntos');
    XLSX.writeFile(wb, 'mis_puntos.xlsx');
  }

  exportarReservasCsv() {
    const element = document.getElementById('tablaReservas');
    const ws = XLSX.utils.table_to_sheet(element);
    const csv = XLSX.utils.sheet_to_csv(ws);

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'mis_reservas.csv';
    a.click();
  }

  calcularResumen() {
    this.resumen.reservasTotales = this.reservas.length;
    this.resumen.reservasAprobadas = this.reservas.filter(
      (r) => r.estado === 'APROBADA'
    ).length;

    this.resumen.canceladasNoShow = this.reservas.filter(
      (r) => r.estado === 'CANCELADA' || r.estado === 'NO_SHOW'
    ).length;

    this.resumen.puntosActuales = this.puntos.length
      ? this.puntos[this.puntos.length - 1].saldo
      : 0;
  }
}
