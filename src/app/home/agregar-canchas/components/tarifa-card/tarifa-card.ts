import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tarifa-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tarifa-card.html',
  styleUrls: ['./tarifa-card.scss']
})
export class TarifaCardComponent {
  @Input() tarifa: any;
}
