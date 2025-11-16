import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TarifaCardComponent } from '../tarifa-card/tarifa-card';

@Component({
  selector: 'app-cancha-card',
  standalone: true,
  imports: [CommonModule, TarifaCardComponent],
  templateUrl: './cancha-card.html',
  styleUrls: ['./cancha-card.scss']
})
export class CanchaCardComponent {
  @Input() cancha: any;
  @Output() editar = new EventEmitter();
}
