import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard';
import { guestGuard } from './guards/guestGuard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  { 
    path: 'home', 
    loadComponent: () => import('./components/Bienvenida/home/home').then(m => m.Home) 
  },
  { 
    path: 'Login', 
    loadComponent: () => import('./components/login/login').then(m => m.Login), 
    canActivate: [guestGuard] 
  },
  { 
    path: 'QuienSoy', 
    loadComponent: () => import('./components/quien-soy/quien-soy').then(m => m.QuienSoy) 
  },
  { 
    path: 'Registro', 
    loadComponent: () => import('./components/registro/registro').then(m => m.Registro), 
    canActivate: [guestGuard] 
  },
  { 
    path: 'Ahorcado', 
    loadComponent: () => import('./components/ahorcado/ahorcado').then(m => m.Ahorcado), 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'MayorMenor', 
    loadComponent: () => import('./components/mayor-menor/mayor-menor').then(m => m.MayorMenor), 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'Preguntados', 
    loadComponent: () => import('./components/preguntados/preguntados').then(m => m.Preguntados), 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'BlackJack', 
    loadComponent: () => import('./components/black-jack/black-jack').then(m => m.Blackjack), 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'SalaChat', 
    loadComponent: () => import('./components/sala-chat/sala-chat').then(m => m.SalaChat), 
    canActivate: [AuthGuard] 
  },
  { 
    path: '**', 
    loadComponent: () => import('./pages/not-found/not-found').then(m => m.NotFound) 
  }
];

