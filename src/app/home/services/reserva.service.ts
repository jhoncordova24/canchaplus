import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Reserva } from '../../interfaces/reserva.interface';

@Injectable({
  providedIn: 'root',
})
export class ReservaService {
  private readonly _http = inject(HttpClient);

  private readonly url = environment.api_url;

  addReserva(data: Reserva) {
    return this._http.post(this.url + `/reserva/reservaAgregar`, data);
  }

  getReservasByIdCancha(idCancha: string | number) {
    return this._http.get(this.url + `/reserva/reservaObtenerPorCancha/${idCancha}`);
  }

  getReservasById(id: string) {
    return this._http.get(this.url + `/reserva/reservaObtener/${id}`);
  }

  getReservasByIdUsuario(idUsuario: string | number, pagina: number, cantidadRegistros: number) {
    return this._http.get(
      this.url + `/reserva/reservaObtenerPorUsuario/${idUsuario}/${pagina}/${cantidadRegistros}`
    );
  }

  getReservasPendientesByCliente(idUsuario: string | number) {
    return this._http.get(this.url + `/reserva/reservasPendientesByCliente/${idUsuario}`);
  }

  getReservasPendientesByCanchaId(idCancha: string | number) {
    return this._http.get(this.url + `/reserva/reservasPendientesByCancha/${idCancha}`);
  }

  patchReserva(reserva: Reserva) {
    return this._http.put(this.url + `/reserva/reservaActualizar`, reserva,);
  }
}
