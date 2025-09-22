import { Component, OnInit,NgZone  } from '@angular/core';
import { SupabaseService } from '../../services/supabase';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-sala-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sala-chat.html',
  styleUrl: './sala-chat.css',
})
export class SalaChat implements OnInit {
  mensajes: any[] = [];
  nuevoMensaje: string = '';
  usuarioId: string | null = null;
  usuarioNombre: string = '';

  constructor(private supabaseService: SupabaseService, private ngZone: NgZone) {}

  async ngOnInit() {
   
    const userResponse = await this.supabaseService.client.auth.getUser();
    if (userResponse.data?.user) {
      this.usuarioId = userResponse.data.user.id;
      this.usuarioNombre = userResponse.data?.user?.email || '';
    }

   
    const { data } = await this.supabaseService.client
      .from('chat')
      .select('*')
      .order('fecha', { ascending: true });
    this.mensajes = data || [];

    
    this.supabaseService.client
      .channel('chat-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat' },
        (payload) => {
      this.ngZone.run(() => {
        this.mensajes.push(payload.new);
      });
    }
  )
      .subscribe();
  }

  async enviarMensaje() {
    if (!this.nuevoMensaje.trim() || !this.usuarioNombre) return;
    const { error } = await this.supabaseService.client
      .from('chat')
      .insert([
        {
          usuario: this.usuarioNombre,
          mensaje: this.nuevoMensaje,
          fecha: new Date().toISOString()
        }
      ]);

    this.ngZone.run(() => {
      if (error) {
        console.error('Error al enviar mensaje:', error);
      } else {
        this.nuevoMensaje = '';
      }
    });
  }
}
