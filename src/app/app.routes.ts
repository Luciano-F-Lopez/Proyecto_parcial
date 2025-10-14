import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard';
import { LoginGuard } from './guards/login-guard';
import { AdminGuard } from './guards/admin-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  { 
    path: 'home', 
    loadComponent: () => import('./components/Bienvenida/home/home').then(m => m.Home) 
  },
  { 
    path: 'Login', 
    loadComponent: () => import('./components/login/login').then(m => m.Login), 
    canActivate: [LoginGuard] 
  },
  { 
    path: 'QuienSoy', 
    loadComponent: () => import('./components/quien-soy/quien-soy').then(m => m.QuienSoy) 
  },
  { 
    path: 'Registro', 
    loadComponent: () => import('./components/registro/registro').then(m => m.Registro), 
    canActivate: [LoginGuard] 
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
  },{ 
    path: 'Encuesta', 
    loadComponent: () => import('./components/encuesta/encuesta').then(m => m.Encuesta) 
  },
  { 
    path: 'EncuestaResultado', 
    loadComponent: () => import('./components/encuesta-resultado/encuesta-resultado').then(m => m.EncuestaResultado),
    canActivate: [AdminGuard]  
  },
  { 
    path: '**', 
    loadComponent: () => import('./pages/not-found/not-found').then(m => m.NotFound) 
  }, 
];

