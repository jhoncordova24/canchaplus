import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CanchaService } from '../../../services/cancha.service';
import { Cancha } from '../../../../interfaces/cancha.interface';
import { filter, forkJoin, map, mergeMap } from 'rxjs';
import { TipoCanchas } from '../../../../shared/constants/cancha-tipos';
import { CryptoService } from '../../../services/crypto.service';
import { TarifaService } from '../../../services/tarifa.service';
import { Tarifa } from '../../../../interfaces/tarifa.interface';
import { format } from 'date-fns';
import { fromZonedTime } from 'date-fns-tz';

@Component({
  selector: 'app-canchas',
  imports: [],
  templateUrl: './canchas.html',
  styleUrl: './canchas.scss',
})
export class Canchas implements OnInit {
  canchas!: Cancha[];
  tarifas: Tarifa[] = [];
  hoy: string = format(fromZonedTime(new Date(), 'America/Lima'), 'yyyy-MM-dd');
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly canchaService = inject(CanchaService);
  private readonly cryptoService = inject(CryptoService);
  private readonly tarifaService = inject(TarifaService);
  canchasConTarifa: any[] = [];

  ngOnInit(): void {
    this.getCanchas();
  }

  reservar(id: string | number) {
    this.router.navigate(['..', 'fecha', id], { relativeTo: this.activatedRoute });
  }

  getCanchas() {
    this.canchaService.getCanchas().subscribe((response: any) => {
      const canchas = response.data;

      const llamadasTarifa = canchas.map((cancha: any) =>
        this.tarifaService.getTarifaByCanchaId(cancha.cancha_id, this.hoy).pipe(
          map((tarifaResponse: any) => {
            const tarifas = tarifaResponse?.data;
            if (tarifas && tarifas.length > 0) {
              return {
                ...cancha,
                tipocancha_nombre:
                  TipoCanchas.get(parseInt(cancha.tipocancha_id)) || 'No especifica',
                cancha_id: this.cryptoService.encriptar(cancha.cancha_id),
                tarifaActual: tarifas[0],
              };
            }
            return null;
          })
        )
      );
      forkJoin(llamadasTarifa).subscribe((resultados: any) => {
        this.canchasConTarifa = resultados.filter((c: any) => c !== null);
        console.log('Canchas con tarifa:', this.canchasConTarifa);
        this.canchas = this.canchasConTarifa;
      });
    });
  }
}
