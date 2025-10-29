import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-home',
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './home.html',
  standalone: true,
})
export class Home implements OnInit {
  ngOnInit(): void {
    initFlowbite();
  }
}
