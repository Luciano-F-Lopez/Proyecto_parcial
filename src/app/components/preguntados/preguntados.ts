import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreguntasService, Pregunta } from '../../services/preguntas';
import { SupabaseService } from '../../services/supabase';
import { PuntosPipe } from '../../pipes/puntos-pipe';
import { SalaChat } from '../../components/sala-chat/sala-chat';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-preguntados',
  standalone: true,
  imports: [CommonModule, PuntosPipe, SalaChat, FormsModule],
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
  preguntasUsadas: Set<number> = new Set();

  categorias: string[] = [];
  categoriaSeleccionada: string | null = null;

  constructor(
    private preguntasService: PreguntasService,
    private supabase: SupabaseService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias() {
    this.preguntasService.obtenerPreguntas().subscribe({
      next: (data) => {
        this.categorias = Array.from(new Set(data.map(p => p.category))).filter(cat => cat && cat.trim() !== "");;
        this.cargando = false;
      },
      error: (err) => {
        console.error("Error cargando categorías:", err);
        this.cargando = false;
      }
    });
  }

  iniciarJuego(categoria: string) {
    this.categoriaSeleccionada = categoria;
    this.cargarPreguntas();
  }

  cargarPreguntas() {
    this.cargando = true;
    this.juegoTerminado = false;
    this.preguntasUsadas.clear();
    this.preguntaActualIndex = 0;

    this.preguntasService.obtenerPreguntas().subscribe({
      next: (data) => {
        let preguntasFiltradas = data;

        // Solo filtramos si no es "todas"
        if (this.categoriaSeleccionada && this.categoriaSeleccionada !== "todas") {
          preguntasFiltradas = data.filter(p => p.category === this.categoriaSeleccionada);
        }

        const preguntasMezcladas = this.shuffle(preguntasFiltradas);
        const limite = Math.min(this.limitePreguntas, preguntasMezcladas.length);

        this.ngZone.run(() => {
          this.preguntas = preguntasMezcladas.slice(0, limite);
          this.setPreguntaActual();
          this.cargando = false;
        });
      },
      error: (err) => {
        console.error("Error cargando preguntas:", err);
        this.cargando = false;
      }
    });
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
      this.guardarPartida();
    }
  }

  reiniciarJuego() {
    this.puntaje = 0;
    this.preguntaActualIndex = 0;
    this.juegoTerminado = false;
    this.cargarPreguntas();
  }

  async guardarPartida() {
    const { data: user } = await this.supabase.client.auth.getUser();

    await this.supabase.client.from('partidas').insert({
      usuario_id: user?.user?.id,
      usuario_email: user?.user?.email,
      juego: 'preguntados',
      resultado: 'finalizado',
      puntaje: this.puntaje,
      detalles: {
        preguntas_respondidas: this.preguntaActualIndex + 1,
        total_preguntas: this.limitePreguntas,
        categoria: this.categoriaSeleccionada
      }
    });
  }

  get preguntaActual(): Pregunta | null {
    return this.preguntas[this.preguntaActualIndex] || null;
  }
}






















