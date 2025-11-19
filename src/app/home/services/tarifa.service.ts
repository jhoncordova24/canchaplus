import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Tarifa } from '../../interfaces/tarifa.interface';

@Injectable({
  providedIn: 'root',
})
export class TarifaService {
  private readonly api_url = environment.api_url;
  private readonly _http = inject(HttpClient);

  agregarTarifa(data: Tarifa) {
    return this._http.post(this.api_url + `/tarifa/tarifaAgregar`, data);
  }

  getTarifaByCanchaId(idCancha: string | number, fecha: string) {
    return this._http.get(this.api_url + `/tarifa/tarifaObtenerVigentesPorCancha/${idCancha}`, {
      params: { fecha: fecha },
    });
  }

  getTarifasActivas() {
    return this._http.get(this.api_url + `/tarifa/tarifaObtenerActivas`);
  }
}
