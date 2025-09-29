import { Component } from '@angular/core';
import { AccordionComponent } from '../accordion/accordion.component';
import { FeatureComponent } from '../feature/feature.component';
import { ContentComponent } from '../content/content.component';
import { HeroComponent } from '../hero/hero.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent, ContentComponent, FeatureComponent, AccordionComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
