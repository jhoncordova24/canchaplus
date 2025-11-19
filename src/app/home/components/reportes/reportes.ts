import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../interfaces/user.interface';
import { ReservaService } from '../../services/reserva.service';
import { Reserva } from '../../../interfaces/reserva.interface';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './reportes.html',
  styleUrl: './reportes.scss',
})
export class Reportes implements OnInit {
  usuario!: User;
  activeTab: 'reservas' | 'puntos' = 'reservas';

  setTab(tab: 'reservas' | 'puntos') {
    this.activeTab = tab;
  }

  reservas!: Reserva[];

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
    sede: '0',
  };

  reservasFiltradas: Reserva[] = [];
  puntosFiltrados = [...this.puntos];
  canchasNombres: any[] = [];

  resumen = {
    reservasTotales: 0,
    reservasAprobadas: 0,
    canceladasNoShow: 0,
    puntosActuales: 0,
  };

  private readonly userService = inject(UserService);
  private readonly reservaService = inject(ReservaService);

  constructor() {}

  ngOnInit(): void {
    this.usuario = this.userService.getUser();
    this.getReservas();
  }

  getReservas() {
    this.reservaService.getReservasByIdUsuario(this.usuario.usuario_id, 1, 1000).subscribe({
      next: (response: any) => {
        console.log(response);
        this.reservas = response.data.lista;

        const ids = new Set<number>();
        this.canchasNombres = [];

        for (const reserva of this.reservas) {
          if (!ids.has(reserva.cancha_id as number)) {
            ids.add(reserva.cancha_id as number);
            this.canchasNombres.push({
              id: reserva.cancha_id,
              nombre: reserva.cancha_nombre,
            });
          }
        }

        this.calcularResumen();
        this.reservasFiltradas = [...this.reservas];
        console.log(this.canchasNombres);
      },
    });
  }

  aplicarFiltros() {
    this.reservasFiltradas = this.reservas.filter((r) => {
      const fecha = new Date(r.reserva_fecha);

      const desde = this.filtros.fechaDesde ? new Date(this.filtros.fechaDesde) : null;

      const hasta = this.filtros.fechaHasta ? new Date(this.filtros.fechaHasta) : null;

      const matchFecha = (!desde || fecha >= desde) && (!hasta || fecha <= hasta);

      const matchEstado = this.filtros.estado ? r.estadoreserva_id === this.filtros.estado : true;

      const matchSede = this.filtros.sede
        ? r.cancha_id === this.filtros.sede || this.filtros.sede === '0'
        : true;

      return matchFecha && matchEstado && matchSede;
    });
  }

  limpiarFiltros() {
    this.filtros = {
      fechaDesde: '',
      fechaHasta: '',
      estado: '',
      sede: '0',
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
    this.resumen.reservasAprobadas = this.reservas.filter((r) => r.estadoreserva_id === '2').length;

    this.resumen.canceladasNoShow = this.reservas.filter((r) => r.estadoreserva_id === '3').length;

    this.resumen.puntosActuales = this.puntos.length
      ? this.puntos[this.puntos.length - 1].saldo
      : 400;
  }
}
