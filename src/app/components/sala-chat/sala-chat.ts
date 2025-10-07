import { Component, OnInit, NgZone, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { SupabaseService } from '../../services/supabase';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sala-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sala-chat.html',
  styleUrls: ['./sala-chat.css'],
})
export class SalaChat implements OnInit, OnDestroy {
  mensajes: any[] = [];
  nuevoMensaje: string = '';
  usuarioId: string | null = null;
  usuarioNombre: string = '';
  cargandoUsuario = true;
  mostrarChat = false;

  private canal: any;

  constructor(
    private supabaseService: SupabaseService,
    private ngZone: NgZone,
    private cd: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    await this.cargarUsuario();
    await this.cargarMensajes();
    this.suscribirseAlCanal();
  }

  ngOnDestroy() {
    this.cerrarCanal();
  }

  abrirChat() {
    this.mostrarChat = true;
  }

  private async cargarUsuario() {
    const { data } = await this.supabaseService.client.auth.getUser();
    if (data?.user) {
      this.usuarioId = data.user.id;
      this.usuarioNombre = data.user.email || 'Usuario';
    }
    this.cargandoUsuario = false;
  }

  private async cargarMensajes() {
    const { data, error } = await this.supabaseService.client
      .from('chat')
      .select('*')
      .order('fecha', { ascending: true });

    if (error) {
      console.error('Error cargando mensajes:', error);
      return;
    }

    this.mensajes = data || [];
  }

  private suscribirseAlCanal() {
    if (typeof window === 'undefined') {
      console.warn('SalaChat: no se puede abrir canal Realtime fuera del navegador');
      return;
    }

    this.cerrarCanal();

    this.canal = this.supabaseService.client
      .channel('chat-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat' },
        (payload: any) => {
          this.ngZone.run(() => {
            this.mensajes.push(payload.new);
            this.cd.detectChanges();
          });
        }
      )
      .subscribe(status => {
        console.log('Estado de la suscripción:', status);
      });
  }

  private cerrarCanal() {
    if (this.canal) {
      this.supabaseService.client.removeChannel(this.canal);
      this.canal = null;
    }
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

    if (error) {
      console.error('Error al enviar mensaje:', error);
    } else {
      this.nuevoMensaje = '';
    }
  }
}


