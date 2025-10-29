import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Login } from '../../interfaces/login.interface';
import { Register } from '../../interfaces/register.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _http = inject(HttpClient);

  private readonly url = environment.api_url;

  constructor() {}

  login(data: Login) {
    return this._http.post(this.url + '/auth/login', data);
  }

  register(data: Register) {
    return this._http.post(this.url + '/auth/register', data);
  }
}
