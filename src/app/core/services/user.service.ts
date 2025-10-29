import { Injectable } from '@angular/core';
import { User } from '../../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  clear() {
    localStorage.clear();
  }

  getUser(): User {
    if (!localStorage.getItem('usuario')) {
      console.log('Usuario no logeado');
    }
    return JSON.parse(localStorage.getItem('usuario')!);
  }

  saveUser(user: User) {
    localStorage.setItem('usuario', JSON.stringify(user));
  }
}
