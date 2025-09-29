import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

export default [
  {
    path: '',
    component: HomeComponent,
    title: 'Canchaplus - Home',
  },
  { path: 'login', component: LoginComponent, title: 'Canchaplus - Login', canActivate: [] },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Canchaplus - Register',
    canActivate: [],
  },
] as Routes;
