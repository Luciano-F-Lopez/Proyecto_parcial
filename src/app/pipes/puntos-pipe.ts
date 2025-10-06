import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'puntos'
})
export class PuntosPipe implements PipeTransform {

  transform(value: number): string {
    if (value == null) return '0 pts';
    return `${value.toLocaleString()} pts`;
  }

}

