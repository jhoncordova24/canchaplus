import { initFlowbite } from 'flowbite';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { SidebarLink } from './sidebar-link.interface';
import { User } from '../../../interfaces/user.interface';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  usuario!: User;
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    initFlowbite();
    this.getUser();
  }

  getUser() {
    this.usuario = this.userService.getUser();
  }

  links: SidebarLink[] = [
    {
      path: 'reservar/canchas',
      icon: 'add_circle',
      label: 'Reservar',
    },
    {
      path: 'calendario',
      icon: 'calendar_month',
      label: 'Calendario',
    },
    {
      path: '#',
      icon: 'confirmation_number',
      label: 'Mis Reservas',
    },
    
  ];

  logout() {
    this.userService.clear();
    this.router.navigate(['/landing/login']);
  }
}
