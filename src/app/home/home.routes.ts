import { Routes } from '@angular/router';
import { Calendario } from './components/calendario/calendario';
import { Ascenso } from './components/ascenso/ascenso';

export default [
  { path: '', component: Calendario, title: 'Canchaplus - Home' },
  { path: 'ascenso', component: Ascenso, title: 'Canchaplus - Ascenso' }
] as Routes;

