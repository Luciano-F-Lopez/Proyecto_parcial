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

  baraja: number[] = [];
  numeroActual!: number;
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
    for (let i = 1; i <= 13; i++) {
      this.baraja.push(i);
    }
    this.baraja.sort(() => Math.random() - 0.5); 
  }

  siguienteNumero() {
    if (this.baraja.length === 0) return;
    this.numeroActual = this.baraja.pop()!;
  }

  adivinar(mayor: boolean) {
    if (this.mensajeFinal) return;
    const proximoNumero = this.baraja[this.baraja.length - 1];

    if (!proximoNumero) {
      this.mensajeFinal = `Juego terminado. acertadas: ${this.cartasAcertadas}`;
      this.guardarPartida();
      return;
    }

    const acierto = (mayor && proximoNumero > this.numeroActual) ||
                    (!mayor && proximoNumero < this.numeroActual);

    if (acierto) this.cartasAcertadas++;
    this.totalIntentos++;
    this.siguienteNumero();

    if (this.totalIntentos >= this.intentosMax) {
      this.mensajeFinal = `Juego terminado. acertadas: ${this.cartasAcertadas}`;
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


