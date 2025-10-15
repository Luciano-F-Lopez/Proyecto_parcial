import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase';
import { PuntosPipe } from '../../pipes/puntos-pipe';
import { FechaRelativaPipe } from '../../pipes/fecha-relativa.pipe';

@Component({
  selector: 'app-resultados',
  standalone: true,
  imports: [CommonModule, PuntosPipe, FechaRelativaPipe],
  templateUrl: './resultados.html',
  styleUrls: ['./resultados.css']
})
export class Resultados implements OnInit {
  blackjack: any[] = [];
  mayorMenor: any[] = [];
  preguntados: any[] = [];
  ahorcado: any[] = [];

  filtroJuego: string = 'todos'; // <-- filtro seleccionado

  constructor(private supabase: SupabaseService, private cd: ChangeDetectorRef) {}

  async ngOnInit() {
    await this.cargarResultados();
  }

  async cargarResultados() {
    const juegos = [
    { key: 'blackjack', prop: 'blackjack' },
    { key: 'mayor_menor', prop: 'mayorMenor' },
    { key: 'preguntados', prop: 'preguntados' },
    { key: 'ahorcado', prop: 'ahorcado' }
  ];

    for (const juego of juegos) {
      const { data } = await this.supabase.client
        .from('partidas')
        .select('*')
        .eq('juego', juego.key)
        .order('puntaje', { ascending: false })
        .order('tiempo_jugado', { ascending: true })
        .limit(5);

      (this as any)[juego.prop] = data ?? [];
    }

    this.cd.detectChanges();
  }

  setFiltro(juego: string) {
    this.filtroJuego = juego;
  }

  mostrarTabla(juego: string) {
    return this.filtroJuego === 'todos' || this.filtroJuego === juego;
  }
}




