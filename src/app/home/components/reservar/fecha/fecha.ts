import { Component, inject, OnInit } from '@angular/core';
import { Calendario } from '../../calendario/calendario';
import { ActivatedRoute, Router } from '@angular/router';
import { CryptoService } from '../../../services/crypto.service';
import { CanchaService } from '../../../services/cancha.service';
import { ReservaService } from '../../../services/reserva.service';
import { format } from 'date-fns-tz';

@Component({
  selector: 'app-fecha',
  imports: [Calendario],
  templateUrl: './fecha.html',
  styleUrl: './fecha.scss',
})
export class Fecha implements OnInit {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly cryptoService = inject(CryptoService);
  private readonly reservaService = inject(ReservaService);
  private readonly canchaService = inject(CanchaService);
  private idCancha!: string;

  reservasMonthView = [];
  reservas$: any;
  constructor() {
    this.activatedRoute.params.subscribe((params) => {
      this.idCancha = this.cryptoService.desencriptar(params['idCancha']);
    });
  }

  ngOnInit(): void {
    this.reservas$ = this.reservaService.getReservasByIdCancha(this.idCancha);
  }

  reservarClicked(fecha: Date) {
    const fechaString = format(fecha, "yyyy-MM-dd'T'HH:mm:ss");
    this.router.navigate(
      ['../../confirmar', this.cryptoService.encriptar(this.idCancha), fechaString],
      {
        relativeTo: this.activatedRoute,
      }
    );
  }
}
