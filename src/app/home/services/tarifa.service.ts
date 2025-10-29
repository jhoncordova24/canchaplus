import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TarifaService {
  private readonly api_url = environment.api_url;
  private readonly _http = inject(HttpClient);

  getTarifaByCanchaId(idCancha: string | number, fecha: string) {
    return this._http.get(this.api_url + `/tarifa/tarifaObtenerVigentesPorCancha/${idCancha}`, {
      params: { fecha: fecha },
    });
  }

  getTarifasActivas() {
    return this._http.get(this.api_url + `/tarifa/tarifaObtenerActivas`);
  }
}
