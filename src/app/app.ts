import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';

@Component({
selector: 'app-root',
standalone: true,
imports: [RouterOutlet, RouterLink],
template: `
<div id=nav_global> <nav>
<a routerLink="/home">Home</a> 
<a routerLink="/Login">Login</a> 
<a routerLink="/Registro">Registro</a> 
<a routerLink="/QuienSoy">QuienSoy</a>
</nav></div>
<router-outlet></router-outlet>
`
})
export class App {
private router = inject(Router);
goAbout() { this.router.navigate(['/about']); }
}

