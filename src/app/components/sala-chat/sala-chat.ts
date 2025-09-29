import { Component, OnInit,NgZone, OnDestroy  } from '@angular/core';
import { SupabaseService } from '../../services/supabase';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-sala-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sala-chat.html',
  styleUrl: './sala-chat.css',
})
export class SalaChat implements OnInit, OnDestroy {
  mensajes: any[] = [];
  nuevoMensaje: string = '';
  usuarioId: string | null = null;
  usuarioNombre: string = '';
  cargandoUsuario = true;
  mostrarChat = false

  private subscription: any;
  private canal: any;

  constructor(private supabaseService: SupabaseService, private ngZone: NgZone,private cd: ChangeDetectorRef) {}

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
    const userResponse = await this.supabaseService.client.auth.getUser();
    if (userResponse.data?.user) {
      this.usuarioId = userResponse.data.user.id;
      this.usuarioNombre = userResponse.data.user.email || '';
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
    this.cerrarCanal();

    this.canal = this.supabaseService.client.channel('chat-channel');

    this.subscription = this.canal
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat' },
        (payload:any) => {
          console.log('Nuevo mensaje recibido:', payload);
          this.ngZone.run(() => {
            this.mensajes.push(payload.new);
          });
        }
      )
      .subscribe();

    console.log('Estado inicial de suscripción:', this.subscription.state);

    // Escuchar eventos de conexión
    this.canal.on('presence', () => {
      console.log('Canal activo');
    });
  }

  private cerrarCanal() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
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

    this.ngZone.run(() => {
    if (error) {
      console.error('Error al enviar mensaje:', error);
    } else {
      this.nuevoMensaje = '';
      this.cd.detectChanges(); 
    }
  });
}}
