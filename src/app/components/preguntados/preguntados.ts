import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase';

@Component({
  selector: 'app-preguntados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preguntados.html',
  styleUrls: ['./preguntados.css']
})
export class Preguntados implements OnInit {
  preguntas: Pregunta[] = [];
  cargando = true;
  preguntaActualIndex = 0;
  puntaje = 0;
  opcionesActuales: string[] = [];
  limitePreguntas = 10; 
  juegoTerminado = false; 
  preguntasUsadas: Set<number> = new Set(); // IDs de preguntas ya usadas

  constructor(
    private supabase: SupabaseService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.cargarPreguntas();
  }

  async cargarPreguntas() {
    this.cargando = true;
    this.juegoTerminado = false;
    this.preguntasUsadas.clear();
    this.preguntaActualIndex = 0;

    try {
      const { data, error } = await this.supabase.client
        .from('preguntas')
        .select('*');

      if (error) throw error;

      if (data && Array.isArray(data) && data.length) {
        const preguntasMezcladas = this.shuffle(data);
        this.ngZone.run(() => {
          this.preguntas = preguntasMezcladas.slice(0, this.limitePreguntas);
          this.setPreguntaActual();
          this.cargando = false;
        });
      } else {
        console.warn("No hay preguntas en la base");
        this.ngZone.run(() => this.cargando = false);
      }
    } catch (err) {
      console.error("Error cargando preguntas:", err);
      this.ngZone.run(() => this.cargando = false);
    }
  }

  setPreguntaActual() {
    if (this.preguntaActual) {
      this.preguntasUsadas.add(this.preguntaActual.id);
      this.opcionesActuales = this.shuffle([
        this.preguntaActual.correct_answer,
        ...this.preguntaActual.incorrect_answers
      ]);
    }
  }

  shuffle(array: any[]): any[] {
    return array.sort(() => Math.random() - 0.5);
  }

  verificarRespuesta(respuesta: string) {
    if (!this.preguntaActual) return;

    if (respuesta === this.preguntaActual.correct_answer) {
      this.puntaje += 10;
      alert("✅ ¡Respuesta correcta!");
    } else {
      alert("❌ Respuesta incorrecta");
    }

    this.siguientePregunta();
  }

  siguientePregunta() {
    if (this.preguntaActualIndex < this.limitePreguntas - 1) {
      this.preguntaActualIndex++;
      this.setPreguntaActual();
    } else {
      this.juegoTerminado = true;
    }
  }

  reiniciarJuego() {
    this.puntaje = 0;
    this.preguntaActualIndex = 0;
    this.juegoTerminado = false;
    this.cargarPreguntas();
  }

  get preguntaActual(): Pregunta | null {
    return this.preguntas[this.preguntaActualIndex] || null;
  }
}

export interface Pregunta {
  id: number;
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}


















