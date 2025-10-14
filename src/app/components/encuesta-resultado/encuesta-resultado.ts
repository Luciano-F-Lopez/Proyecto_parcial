import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase';

@Component({
  selector: 'app-encuesta-resultado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './encuesta-resultado.html',
  styleUrls: ['./encuesta-resultado.css']
})
export class EncuestaResultado implements OnInit {
  encuestas: any[] = [];
  error: string | null = null;

  constructor(
    private supabase: SupabaseService,
    private cd: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    const { data, error } = await this.supabase.client.from('encuestas').select('*');

    if (error) {
      this.error = '⚠ Error al cargar los resultados';
    } else {
      this.encuestas = data ?? [];
      this.cd.detectChanges(); // <--- fuerza la actualización de la vista
    }
  }
}


