import { initFlowbite } from 'flowbite';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink} from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
   title = 'web-app';

  ngOnInit(): void {
    initFlowbite();
  }
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  logout() {
    this.userService.clear();
    this.router.navigate(['/landing/login']);
  }
}
