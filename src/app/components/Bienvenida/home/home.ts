import { Component, OnInit, NgZone , ChangeDetectorRef  } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../../../services/supabase';
import { CommonModule } from '@angular/common'; 
import { SalaChat } from '../../sala-chat/sala-chat';
import { Resultados } from '../../../pages/resultados/resultados';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,SalaChat,Resultados],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
    usuario: any = null; 
    mostrarChat = false;

  constructor(
    private supabaseService: SupabaseService,
    private router: Router,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,// <-- agregado
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
mostrarRanking = false;

abrirRanking() {
  this.mostrarRanking = true;
}

cerrarRanking() {
  this.mostrarRanking = false;
}


  async ngOnInit() {
    
    const { data } = await this.supabaseService.client.auth.getUser();
    if (data.user) {
      this.usuario = data.user;
    }

    
    this.supabaseService.client.auth.onAuthStateChange((_event, session) => {
     this.ngZone.run(() => {
        this.usuario = session?.user || null;
        this.cdr.detectChanges();
      });
    });
  }

  async logout() {
    await this.supabaseService.client.auth.signOut();
    this.usuario = null;
    this.router.navigate(['/']); 
  }

}
