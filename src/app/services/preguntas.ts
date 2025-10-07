
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Pregunta {
  id: number;
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

@Injectable({
  providedIn: 'root'
})
export class PreguntasService {
  private url = 'assets/data/preguntas.json';

  constructor(private http: HttpClient) {}

  obtenerPreguntas(): Observable<Pregunta[]> {
    return this.http.get<Pregunta[]>(this.url);
  }
}

