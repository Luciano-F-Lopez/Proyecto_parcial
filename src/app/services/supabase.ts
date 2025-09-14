import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      'https://lrxtkrqzkdhekqxoyudy.supabase.co', 
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxyeHRrcnF6a2RoZWtxeG95dWR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MzM4MDcsImV4cCI6MjA3MzEwOTgwN30.aSJI5Pb-1CQt7pbc--da33d44T-mUrKlhOoqnIlhYzU'                      
    );
  }

  get client() {
    return this.supabase;
  }
}
