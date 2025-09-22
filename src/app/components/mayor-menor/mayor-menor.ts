import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../../services/supabase';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mayor-menor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mayor-menor.html',
  styleUrls: ['./mayor-menor.css'],
})
export class MayorMenor implements OnInit {

  baraja: { valor: number, img: string }[] = [];
  numeroActual!: { valor: number, img: string };
  cartasAcertadas: number = 0;
  totalIntentos: number = 0;
  intentosMax: number = 10;
  mensajeFinal: string = '';

  constructor(private supabase: SupabaseService) {}

  ngOnInit(): void {
    this.reiniciarJuego();
  }

  crearBaraja() {
    this.baraja = [];

    const palos = ['clubs', 'diamonds', 'hearts', 'spades'];
    const valores = [
      {nombre: 'A', valor: 1},
      {nombre: '2', valor: 2},
      {nombre: '3', valor: 3},
      {nombre: '4', valor: 4},
      {nombre: '5', valor: 5},
      {nombre: '6', valor: 6},
      {nombre: '7', valor: 7},
      {nombre: '8', valor: 8},
      {nombre: '9', valor: 9},
      {nombre: '10', valor: 10},
      {nombre: 'J', valor: 11},
      {nombre: 'Q', valor: 12},
      {nombre: 'K', valor: 13},
    ];

    for (let palo of palos) {
      for (let v of valores) {
        this.baraja.push({
          valor: v.valor,
          img: `assets/cartas/${palo}_${v.nombre}.png`
        });
      }
    }

    
    this.baraja.sort(() => Math.random() - 0.5);
  }

  siguienteNumero() {
    if (this.baraja.length === 0) return;
    this.numeroActual = this.baraja.pop()!;
    console.log('Carta actual:', this.numeroActual);
  }

  adivinar(mayor: boolean) {
    if (this.mensajeFinal) return;
    const proximoCarta = this.baraja[this.baraja.length - 1];

    if (!proximoCarta) {
      this.mensajeFinal = `Juego terminado. Cartas acertadas: ${this.cartasAcertadas}`;
      this.guardarPartida();
      return;
    }

    const acierto = (mayor && proximoCarta.valor > this.numeroActual.valor) ||
                    (!mayor && proximoCarta.valor < this.numeroActual.valor);

    if (acierto) this.cartasAcertadas++;
    this.totalIntentos++;
    this.siguienteNumero();

    if (this.totalIntentos >= this.intentosMax) {
      this.mensajeFinal = `Juego terminado. Cartas acertadas: ${this.cartasAcertadas}`;
      this.guardarPartida();
    }
  }

  async guardarPartida() {
    const { data: user } = await this.supabase.client.auth.getUser();
    if (!user?.user?.id) return;

    await this.supabase.client.from('mayor_o_menor').insert({
      usuario_id: user.user.id,
      cartas_acertadas: this.cartasAcertadas,
      total_intentos: this.totalIntentos,
      resultado: this.cartasAcertadas >= this.intentosMax / 2 ? 'ganado' : 'perdido'
    });
  }

  reiniciarJuego() {
    this.cartasAcertadas = 0;
    this.totalIntentos = 0;
    this.mensajeFinal = '';
    this.crearBaraja();
    this.siguienteNumero();
  }
}



