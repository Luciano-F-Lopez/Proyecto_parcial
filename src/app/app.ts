import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
selector: 'app-root',
standalone: true,
imports: [RouterOutlet, RouterLink,CommonModule],
template: `
<div id=nav_global> <nav>
<a routerLink="/home">Home</a> 
<a *ngIf="!auth.isLoggedIn()" routerLink="/Login">Login</a> 
<a *ngIf="!auth.isLoggedIn()" routerLink="/Registro">Registro</a> 
<a routerLink="/QuienSoy">QuienSoy</a>
</nav></div>
<router-outlet></router-outlet>
`
})
export class App {
auth = inject(AuthService);
private router = inject(Router);
goAbout() { this.router.navigate(['/about']); }
}

