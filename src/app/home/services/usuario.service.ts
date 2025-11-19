import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { User } from '../../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private readonly _http = inject(HttpClient);

  private readonly url = environment.api_url;

  patchUsuario(idUsuario: string | number, data: User) {
    return this._http.put(this.url + `/usuario/usuarioActualizar/${idUsuario}`, data);
  }
}
