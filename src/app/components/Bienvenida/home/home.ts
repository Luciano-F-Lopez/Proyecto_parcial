import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../../../services/supabase';
import { CommonModule } from '@angular/common'; 
import { SalaChat } from '../../sala-chat/sala-chat';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,SalaChat],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
    usuario: any = null; 
    mostrarChat = false;

  constructor(
    private supabaseService: SupabaseService,
    private router: Router,
    private ngZone: NgZone
  ) {}

  abrirChat() {
    this.mostrarChat = true;
  }

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

irAPreguntados() {
  this.router.navigate(['/Preguntados']);
}

irASalaChat(){
  this.router.navigate(['/SalaChat']);
}

irABlackjack(){
  this.router.navigate(['/BlackJack']);
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
