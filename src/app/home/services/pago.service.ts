import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PagoService {
  private readonly api_url = environment.api_url;
  private readonly _http = inject(HttpClient);

  addPago(data: any) {
    return this._http.post(this.api_url + `/pago/pagoAgregar`, data);
  }
}
