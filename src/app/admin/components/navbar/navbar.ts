import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthFirebaseService } from '../../services/auth-firebase.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  standalone: true,
})
export class Navbar {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthFirebaseService);
  async onLogout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/admin/auth/login']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}
