import { inject, Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, user, User } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthFirebaseService {
  private auth: Auth = inject(Auth);

  user$: Observable<User | null> = user(this.auth);

  async loginWithEmail(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      console.log('Usuario ha iniciado sesión con email:', email);
    } catch (error) {
      console.error('Error al iniciar sesión con email:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      console.log('Usuario ha cerrado sesión');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  }
}
