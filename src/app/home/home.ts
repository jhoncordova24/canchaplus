import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@Component({
  selector: 'app-home',
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './home.html',
  standalone: true,
})
export class Home {}
