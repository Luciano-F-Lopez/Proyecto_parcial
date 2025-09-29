import { Routes } from '@angular/router';
import { Home } from './components/Bienvenida/home/home';
import { Login } from './components/login/login';
import { QuienSoy } from './components/quien-soy/quien-soy';
import { Registro } from './components/registro/registro';
import { NotFound } from './pages/not-found/not-found';
import { Ahorcado } from './components/ahorcado/ahorcado';
import {MayorMenor} from './components/mayor-menor/mayor-menor'
import {SalaChat} from './components/sala-chat/sala-chat'
import { AuthGuard } from './guards/auth-guard';
import { guestGuard } from './guards/guestGuard';

export const routes: Routes = [{ path: '', redirectTo: '/home', pathMatch: 'full' }, 
    { path: 'home', component: Home },
    { path: 'Login', component: Login,canActivate:[guestGuard] }, 
    { path: 'QuienSoy', component: QuienSoy }, 
    { path: 'Registro', component: Registro,canActivate:[guestGuard] },
    { path: 'Ahorcado', component: Ahorcado, canActivate:[AuthGuard] },
    { path: 'MayorMenor', component: MayorMenor,canActivate:[AuthGuard] },
    { path: 'SalaChat', component: SalaChat ,canActivate:[AuthGuard]},
    { path: '**', component: NotFound }  
];
