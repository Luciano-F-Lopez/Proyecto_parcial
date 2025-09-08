import { Routes } from '@angular/router';
import { Home } from './components/Bienvenida/home/home';
import { Login } from './components/login/login';
import { QuienSoy } from './components/quien-soy/quien-soy';
import { Registro } from './components/registro/registro';
import { NotFound } from './pages/not-found/not-found';

export const routes: Routes = [{ path: '', redirectTo: '/home', pathMatch: 'full' }, // redirección inicial
    { path: 'home', component: Home },
    { path: 'Login', component: Login }, 
    { path: 'QuienSoy', component: QuienSoy }, 
    { path: 'Registro', component: Registro },
    { path: '**', component: NotFound }  
];
