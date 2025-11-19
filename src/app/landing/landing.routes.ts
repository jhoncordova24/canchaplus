import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { LandingComponent } from './landing.component';

export default [
  {
    path: '',
    component: LandingComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'login', component: LoginComponent, title: 'Canchaplus - Login', canActivate: [] },
      {
        path: 'register',
        component: RegisterComponent,
        title: 'Canchaplus - Register',
        canActivate: [],
      },
      {
        path: 'home',
        component: HomeComponent,
        title: 'Canchaplus - Landing',
        canActivate: [],
      },
    ],
  },
] as Routes;
