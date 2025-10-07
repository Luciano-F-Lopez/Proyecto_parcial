import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey,
      {
        realtime: {
          params: {
            eventsPerSecond: 10, // Controla la frecuencia de eventos
          }
        }
      }
    );
  }

  get client() {
    return this.supabase;
  }
}


