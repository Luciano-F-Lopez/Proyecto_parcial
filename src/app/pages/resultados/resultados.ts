import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase';
import { PuntosPipe } from '../../pipes/puntos-pipe';

@Component({
  selector: 'app-resultados',
  standalone: true,
  imports: [CommonModule,PuntosPipe],
  templateUrl: './resultados.html',
  styleUrls: ['./resultados.css']
})
export class Resultados implements OnInit {
  blackjack: any[] = [];
  mayorMenor: any[] = [];
  preguntados: any[] = [];
  ahorcado: any[] = [];

  constructor(private supabase: SupabaseService) {}

  async ngOnInit() {
    await this.cargarResultados();
  }

  async cargarResultados() {
    const { data: blackjackData } = await this.supabase.client
      .from('partidas')
      .select('*')
      .eq('juego', 'blackjack')
      .order('puntaje', { ascending: false });
    this.blackjack = blackjackData ?? [];

    const { data: mayorMenorData } = await this.supabase.client
      .from('partidas')
      .select('*')
      .eq('juego', 'mayor_menor')
      .order('puntaje', { ascending: false });
    this.mayorMenor = mayorMenorData ?? [];

    const { data: preguntadosData } = await this.supabase.client
      .from('partidas')
      .select('*')
      .eq('juego', 'preguntados')
      .order('puntaje', { ascending: false });
    this.preguntados = preguntadosData ?? [];

    const { data: ahorcadoData } = await this.supabase.client
      .from('partidas')
      .select('*')
      .eq('juego', 'ahorcado')
      .order('puntaje', { ascending: false });
    this.ahorcado = ahorcadoData ?? [];
  }
}


