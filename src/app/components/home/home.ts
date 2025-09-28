import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

//components
import { HeroComponent } from '../hero/hero.component';
import { ContentComponent } from '../content/content.component';
import { FeatureComponent } from '../feature/feature';
import { AccordionComponent } from '../accordion/accordion.component';



@Component({
  selector: 'app-home',
    imports: [CommonModule, HeroComponent, ContentComponent, FeatureComponent, AccordionComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent{ 

}
