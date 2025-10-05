import { Injectable } from '@angular/core';
import translate from 'translate';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {

  constructor() {
    translate.engine = 'google'; 
  }

  async traducir(texto: string, idiomaDestino: string = 'es'): Promise<string> {
    try {
      return await translate(texto, { to: idiomaDestino });
    } catch (error) {
      console.error('Error traduciendo:', error);
      return texto; 
    }
  }
}
