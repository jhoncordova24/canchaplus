import { Component, inject, OnInit } from '@angular/core';
import { SolicitudesService } from '../../../services/solicitudes.service';
import { CryptoService } from '../../../../home/services/crypto.service';
import { SolicitudAdmin } from '../../../../interfaces/solicitud.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-solicitudes-lista',
  imports: [],
  templateUrl: './solicitudes-lista.html',
  styleUrl: './solicitudes-lista.scss',
  standalone: true,
})
export class SolicitudesLista implements OnInit {
  solicitudes!: SolicitudAdmin[];

  private readonly solicitudesServices = inject(SolicitudesService);
  private readonly cryptoService = inject(CryptoService);
  private readonly router = inject(Router);

  constructor() {}

  ngOnInit(): void {
    this.getSolicitudes();
  }

  getSolicitudes() {
    this.solicitudesServices
      .listAll()
      .then((data) => {
        this.solicitudes = data.filter((solicitud) => solicitud.estado === 'pendiente');
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
        this.solicitudes = [];
      });
  }

  verDetalle(idSolicitud: string) {
    console.log(idSolicitud);
    this.router.navigate(['/admin/home/solicitudes/', this.cryptoService.encriptar(idSolicitud)]);
  }
}
