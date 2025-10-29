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

  getCanchas() {
    return this._http.get(this.url + '/cancha/canchaObtenerTodas');
  }

  getCanchasByAdmin(idAdmin: number) {
    return this._http.get(this.url + `/canchaObtenerPorAdmin/${idAdmin}`);
  }

  getCanchaById(idCancha: number) {
    return this._http.get(this.url + `/cancha/canchaObtener/${idCancha}`);
  }
}
