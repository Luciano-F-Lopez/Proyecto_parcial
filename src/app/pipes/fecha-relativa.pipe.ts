import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechaRelativa',
  standalone: true
})
export class FechaRelativaPipe implements PipeTransform {
  transform(value: string | Date): string {
    const fecha = new Date(value);
    const ahora = new Date();
    const diff = (ahora.getTime() - fecha.getTime()) / 1000; // diferencia en segundos

    if (diff < 60) return 'hace unos segundos';
    if (diff < 3600) return `hace ${Math.floor(diff / 60)} minutos`;
    if (diff < 86400) return `hace ${Math.floor(diff / 3600)} horas`;
    if (diff < 172800) return 'ayer';
    return `${fecha.toLocaleDateString()}`;
  }
}
