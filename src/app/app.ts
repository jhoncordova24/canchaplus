import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { Navbar } from './components/navbar/navbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { ContentComponent } from './components/content/content.component';
import { FeatureComponent } from './components/feature/feature';
import { AccordionComponent } from './components/accordion/accordion.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  imports: [Navbar, HeroComponent, ContentComponent, FeatureComponent, AccordionComponent, FooterComponent],
})
export class App implements OnInit {
  title = 'web-app';

  ngOnInit(): void {
    initFlowbite();
  }
}