import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../../services/supabase';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ahorcado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ahorcado.html',
  styleUrl: './ahorcado.css', 
})
export class Ahorcado implements OnInit {
  palabras: string[] = [
  'PERRO', 'GATO', 'ELEFANTE', 'LAPIZ', 'COMPUTADORA', 'TECLADO', 'LIBRO', 'MONTANA', 'PLAYA', 'SOL',
  'LUNA', 'PLANETA', 'ARBOLES', 'CIUDAD', 'AUTOMOVIL', 'AVION', 'BARCO', 'RELOJ', 'CUADERNO', 'CAMARA',
  'TELEFONO', 'CASA', 'PUERTA', 'VENTANA', 'SILLA', 'MESA', 'COCHE', 'BICICLETA', 'PATINETE', 'PARAGUAS',
  'CIELO', 'NUBE', 'LLUVIA', 'NEVE', 'VIENTO', 'FUEGO', 'AGUA', 'TIERRA', 'ARENA', 'ROCA',
  'MONEDA', 'BOLSA', 'MOCHILA', 'ZAPATO', 'CAMISA', 'PANTALON', 'SOMBRERO', 'GORRA', 'GUANTES', 'BUFANDA',
  'FRUTA', 'MANZANA', 'BANANA', 'NARANJA', 'FRESA', 'MELON', 'PERA', 'CEREZA', 'SANDIA', 'PIÑA',
  'ANIMAL', 'TIGRE', 'LEON', 'OSO', 'JIRAFA', 'MONO', 'CONEJO', 'CERDO', 'VACA', 'CABALLO',
  'COLOR', 'ROJO', 'AZUL', 'VERDE', 'AMARILLO', 'NEGRO', 'BLANCO', 'MORADO', 'NARANJA', 'ROSADO',
  'INSTRUMENTO', 'GUITARRA', 'PIANO', 'BATERIA', 'VIOLIN', 'FLAUTA', 'TROMPETA', 'SAXOFON', 'CLARINETE', 'ACORDEON',
  'PAIS', 'ARGENTINA', 'BRASIL', 'CHILE', 'PERU', 'COLOMBIA', 'MEXICO', 'ESPAÑA', 'FRANCIA', 'ITALIA'
];
  palabra: string = ''; 
  letras: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  progreso: string[] = [];
  letrasSeleccionadas: string[] = [];
  intentosMax: number = 6;
  intentos: number = 0;
  mensajeFinal: string = '';

  constructor(private supabase: SupabaseService) {}

  ngOnInit(): void {
    this.iniciarJuego();
  }

  iniciarJuego() {
    this.palabra = this.palabras[Math.floor(Math.random() * this.palabras.length)];
    this.progreso = Array(this.palabra.length).fill('_');
    this.letrasSeleccionadas = [];
    this.intentos = 0;
    this.mensajeFinal = '';
  }

  seleccionar(letra: string) {
    if (this.mensajeFinal) return; 

    this.letrasSeleccionadas.push(letra);
    let acierto = false;

    this.palabra.split('').forEach((l, i) => {
      if (l === letra) {
        this.progreso[i] = letra;
        acierto = true;
      }
    });

    if (!acierto) {
      this.intentos++;
    }

    if (!this.progreso.includes('_')) {
      this.mensajeFinal = '🎉 ¡Ganaste!';
      this.guardarPartida('ganado');
    } else if (this.intentos >= this.intentosMax) {
      this.mensajeFinal = '💀 Perdiste. La palabra era: ' + this.palabra;
      this.guardarPartida('perdido');
    }
  }

  async guardarPartida(resultado: string) {
    const { data: user } = await this.supabase.client.auth.getUser();

    await this.supabase.client.from('ahorcado_partidas').insert({
      usuario_id: user?.user?.id,
      palabra: this.palabra,
      letras_seleccionadas: this.letrasSeleccionadas,
      resultado: resultado
    });
  }
}

