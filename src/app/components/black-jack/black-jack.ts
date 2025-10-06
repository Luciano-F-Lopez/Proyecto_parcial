import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase';
import { PuntosPipe } from '../../pipes/puntos-pipe';

@Component({
  selector: 'app-black-jack',
  standalone: true,
  imports: [CommonModule,PuntosPipe],
  templateUrl: './black-jack.html',
  styleUrls: ['./black-jack.css']
})
export class Blackjack implements OnInit {
  baraja: any[] = [];
  jugador: any[] = [];
  dealer: any[] = [];
  mensaje: string = '';
  juegoTerminado: boolean = false;
  puntaje: number = 0;

  constructor(private supabase: SupabaseService) {}

  ngOnInit(): void {
    this.reiniciarJuego();
  }

  crearBaraja() {
    const palos = ['clubs', 'diamonds', 'hearts', 'spades'];
    const valores = [
      { nombre: 'A', valor: 11 },
      { nombre: '2', valor: 2 },
      { nombre: '3', valor: 3 },
      { nombre: '4', valor: 4 },
      { nombre: '5', valor: 5 },
      { nombre: '6', valor: 6 },
      { nombre: '7', valor: 7 },
      { nombre: '8', valor: 8 },
      { nombre: '9', valor: 9 },
      { nombre: '10', valor: 10 },
      { nombre: 'J', valor: 10 },
      { nombre: 'Q', valor: 10 },
      { nombre: 'K', valor: 10 },
    ];

    this.baraja = [];
    for (let palo of palos) {
      for (let v of valores) {
        this.baraja.push({
          nombre: v.nombre,
          valor: v.valor,
          img: `assets/cartas/${palo}_${v.nombre}.png`
        });
      }
    }
    this.baraja.sort(() => Math.random() - 0.5);
  }

  tomarCarta(): any {
    return this.baraja.pop();
  }

  valorTotal(mano: any[]): number {
    let total = mano.reduce((acc, c) => acc + c.valor, 0);
    let ases = mano.filter(c => c.nombre === 'A').length;
    while (total > 21 && ases > 0) {
      total -= 10;
      ases--;
    }
    return total;
  }

  iniciarJuego() {
    this.crearBaraja();
    this.jugador = [this.tomarCarta(), this.tomarCarta()];
    this.dealer = [this.tomarCarta(), this.tomarCarta()];
    this.mensaje = '';
    this.juegoTerminado = false;
  }

  pedirCarta() {
    if (this.juegoTerminado) return;
    this.jugador.push(this.tomarCarta());
    if (this.valorTotal(this.jugador) > 21) {
      this.mensaje = '💀 Te pasaste de 21. ¡Perdiste!';
      this.puntaje -= 30;
      this.juegoTerminado = true;
      this.guardarPartida('perdido');
    }
  }

  plantarse() {
    if (this.juegoTerminado) return;

    // Dealer juega hasta llegar a 17 o más
    while (this.valorTotal(this.dealer) < 17) {
      this.dealer.push(this.tomarCarta());
    }

    const totalJugador = this.valorTotal(this.jugador);
    const totalDealer = this.valorTotal(this.dealer);

    if (totalDealer > 21 || totalJugador > totalDealer) {
      this.mensaje = '🎉 ¡Ganaste!';
      this.puntaje += 50;
      this.guardarPartida('ganado');
    } else if (totalJugador === totalDealer) {
      this.mensaje = '🤝 Empate.';
      this.puntaje += 20;
      this.guardarPartida('empate');
    } else {
      this.mensaje = '💀 El dealer gana.';
      this.puntaje -= 30;
      this.guardarPartida('perdido');
    }

    this.juegoTerminado = true;
  }

  async guardarPartida(resultado: string) {
  const { data: user } = await this.supabase.client.auth.getUser();

  await this.supabase.client.from('partidas').insert({
    usuario_id: user?.user?.id,
    usuario_email: user?.user?.email,
    juego: 'blackjack',
    resultado,
    puntaje: this.puntaje,
    detalles: {
      cartas_jugador: this.jugador.map(c => c.nombre),
      cartas_dealer: this.dealer.map(c => c.nombre)
    }
  });
}


  reiniciarJuego() {
    this.puntaje = 0;
    this.iniciarJuego();
  }
}

