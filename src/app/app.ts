import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  template: `
    <div id="nav_global"> 
      <nav>
        <a routerLink="/home">Home</a> 
        <a *ngIf="!auth.isLoggedIn()" routerLink="/Login">Login</a> 
        <a *ngIf="!auth.isLoggedIn()" routerLink="/Registro">Registro</a> 
        <a routerLink="/QuienSoy">QuienSoy</a>
      </nav>
    </div>

    <!-- Main con animaciones -->
    <div [@routeAnimations]="prepareRoute(outlet)" class="router-container">
      <router-outlet #outlet="outlet"></router-outlet>
    </div>
  `,
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-in-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ],
  styleUrls: ['./app.css']
})
export class App {
  auth = inject(AuthService);

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
  private router = inject(Router);

  goAbout() { 
    this.router.navigate(['/about']); 
  }

  // Retorna la data de animación de la ruta activa
  getRouteAnimationData(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}

