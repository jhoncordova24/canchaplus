import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Cancha } from '../../interfaces/cancha.interface';

@Injectable({
  providedIn: 'root',
})
export class CanchaService {
  private readonly _http = inject(HttpClient);

  private readonly url = environment.api_url;

  addCancha(data: any) {
    return this._http.post(this.url + '/cancha/canchaAgregar', data);
  }

  updateCancha(data: any) {
    return this._http.put(this.url + '/cancha/canchaActualizar', data);
  }

  getCanchas() {
    return this._http.get(this.url + '/cancha/canchaObtenerTodas');
  }

  getCanchasByAdmin(idAdmin: number | string) {
    return this._http.get(this.url + `/cancha/canchaObtenerPorAdmin/${idAdmin}`);
  }

  getCanchaById(idCancha: number) {
    return this._http.get(this.url + `/cancha/canchaObtener/${idCancha}`);
  }
}
