import { Routes } from '@angular/router';
import { Home } from './components/Bienvenida/home/home';
import { Login } from './components/login/login';
import { QuienSoy } from './components/quien-soy/quien-soy';
import { Registro } from './components/registro/registro';
import { NotFound } from './pages/not-found/not-found';
import { Ahorcado } from './components/ahorcado/ahorcado';
import {MayorMenor} from './components/mayor-menor/mayor-menor'

export const routes: Routes = [{ path: '', redirectTo: '/home', pathMatch: 'full' }, 
    { path: 'home', component: Home },
    { path: 'Login', component: Login }, 
    { path: 'QuienSoy', component: QuienSoy }, 
    { path: 'Registro', component: Registro },
    { path: 'Ahorcado', component: Ahorcado },
    { path: 'MayorMenor', component: MayorMenor },
    { path: '**', component: NotFound }  
];
