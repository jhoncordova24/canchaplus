import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';

@Component({
  selector: 'app-admin',
  imports: [RouterOutlet, Navbar],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
  standalone: true,
})
export class Admin {}
