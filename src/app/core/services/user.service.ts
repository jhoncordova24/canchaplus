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

  getUser(): User | null {
    if (!localStorage.getItem('usuario')) {
      return null;
    }
    return JSON.parse(localStorage.getItem('usuario')!);
  }

  saveUser(user: User) {
    localStorage.setItem('usuario', JSON.stringify(user));
  }
}
