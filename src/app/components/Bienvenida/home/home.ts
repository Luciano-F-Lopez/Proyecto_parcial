import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../../../services/supabase';
import { CommonModule } from '@angular/common'; 


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
    usuario: any = null; // Guardamos al usuario logueado (si existe)

  constructor(
    private supabaseService: SupabaseService,
    private router: Router,
    private ngZone: NgZone
  ) {}

  irALogin() {
  this.router.navigate(['/Login']);
}

  irARegistro() {
  this.router.navigate(['/Registro']);
}

irAAhorcado() {
  this.router.navigate(['/Ahorcado']);
}

irAMayorMenor() {
  this.router.navigate(['/MayorMenor']);
}

  async ngOnInit() {
    
    const { data } = await this.supabaseService.client.auth.getUser();
    if (data.user) {
      this.usuario = data.user;
    }

    
    this.supabaseService.client.auth.onAuthStateChange((_event, session) => {
     this.ngZone.run(() => {
        this.usuario = session?.user || null;
      });
    });
  }

  async logout() {
    await this.supabaseService.client.auth.signOut();
    this.usuario = null;
    this.router.navigate(['/']); 
  }

}
