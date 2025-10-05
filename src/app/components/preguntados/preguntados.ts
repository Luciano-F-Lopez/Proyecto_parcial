import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '../../services/translate.service';

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
  puntaje: number = 0;

  preguntasLocales: Pregunta[] = [
    {
      category: 'Historia',
      type: 'multiple',
      difficulty: 'easy',
      question: 'De 1940 a 1942, ¿cuál fue la capital en el exilio de Free France?',
      correct_answer: 'Brazzaville',
      incorrect_answers: ['Argel', 'París', 'Túnez']
    },
    {
      category: 'Literatura',
      type: 'multiple',
      difficulty: 'easy',
      question: '¿Cuál de estos libros no fue escrito por Karel Čapek?',
      correct_answer: 'Viaje al centro de la tierra',
      incorrect_answers: ['La guerra con los triples', 'R.R. (Robots Universal de Rossum)', 'Dashenka, o la vida de un cachorro']
    },
    {
      category: 'Videojuegos',
      type: 'multiple',
      difficulty: 'easy',
      question: 'En "Halo", ¿cuál es el nombre del planeta que la Instalación 04 órbita?',
      correct_answer: 'Sanghelios',
      incorrect_answers: ['Límite', 'Sustancia', 'TE']
    },
    {
      category: 'Animales',
      type: 'multiple',
      difficulty: 'easy',
      question: '¿Cuál de los siguientes no es una serpiente venenosa?',
      correct_answer: 'Pitón reticulada',
      incorrect_answers: ['Krait malayo', 'Serpiente de mar bellada amarilla', 'Mamba negra']
    },
    {
      category: 'Geografía',
      type: 'multiple',
      difficulty: 'easy',
      question: '¿Qué pequeño principado se encuentra entre España y Francia?',
      correct_answer: 'Andorra',
      incorrect_answers: ['Liechtenstein', 'Mónaco', 'San Marino']
    },
    {
      category: 'Música',
      type: 'multiple',
      difficulty: 'easy',
      question: '¿Qué cantante apareció en la canción de 2015 de Jack ü "Where Are Ü Now"?',
      correct_answer: 'Justin Bieber',
      incorrect_answers: ['Selena Gomez', 'Ellie Goulding', 'El Weeknd']
    },
    {
      category: 'Videojuegos',
      type: 'multiple',
      difficulty: 'easy',
      question: '¿Cuál es el nombre del desarrollador de juegos que creó "Call of Duty: Zombies"?',
      correct_answer: 'Treyarch',
      incorrect_answers: ['Juegos Sledgehammer', 'Barrio infinito', 'Perro travieso']
    }
  ];

  constructor(
    private http: HttpClient,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.cargarPreguntas();
  }

  async cargarPreguntas() {
    this.cargando = true;

    if (this.preguntasLocales.length > 0) {
      this.preguntas = this.preguntasLocales;
      this.cargando = false;
      return;
    }

    try {
      const url = 'https://opentdb.com/api.php?amount=70&type=multiple';
      const data: any = await this.http.get(url).toPromise();

      if (data?.results?.length) {
        this.preguntas = await Promise.all(
          data.results.map(async (pregunta: Pregunta) => {
            pregunta.question = await this.translateService.traducir(pregunta.question, 'es');
            pregunta.correct_answer = await this.translateService.traducir(pregunta.correct_answer, 'es');
            pregunta.incorrect_answers = await Promise.all(
              pregunta.incorrect_answers.map(async (resp: string) =>
                this.translateService.traducir(resp, 'es')
              )
            );
            return pregunta;
          })
        );
      }
    } catch (error) {
      console.error('Error cargando preguntas:', error);
    } finally {
      this.cargando = false;
    }
  }

  mezclarOpciones(pregunta: Pregunta): string[] {
    return this.shuffle([pregunta.correct_answer, ...pregunta.incorrect_answers]);
  }

  shuffle(array: string[]): string[] {
    return array.sort(() => Math.random() - 0.5);
  }

  verificarRespuesta(pregunta: Pregunta, respuesta: string) {
    if (respuesta === pregunta.correct_answer) {
      this.puntaje += 10;
      alert('✅ ¡Respuesta correcta!');
    } else {
      alert('❌ Respuesta incorrecta');
    }

    this.siguientePregunta();
  }

  siguientePregunta() {
    if (this.preguntaActualIndex < this.preguntas.length - 1) {
      this.preguntaActualIndex++;
    } else {
      alert(`🎉 Juego terminado. Tu puntaje final: ${this.puntaje}`);
      this.reiniciarJuego();
    }
  }

  reiniciarJuego() {
    this.puntaje = 0;
    this.preguntaActualIndex = 0;
  }

  get preguntaActual(): Pregunta {
    return this.preguntas[this.preguntaActualIndex];
  }
}

interface Pregunta {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}










