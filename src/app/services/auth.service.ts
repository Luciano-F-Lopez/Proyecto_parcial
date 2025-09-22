import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase';
import { Session, User } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private session: Session | null = null;

  constructor(private supabaseService: SupabaseService) {
    this.supabaseService.client.auth.onAuthStateChange((_event, session) => {
      this.session = session;
    });
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabaseService.client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    this.session = data.session;
    return data;
  }

  async signOut() {
    const { error } = await this.supabaseService.client.auth.signOut();
    if (error) throw error;
    this.session = null;
  }

  getUser(): User | null {
    return this.session?.user ?? null;
  }

  isLoggedIn(): boolean {
    return !!this.session?.user;
  }
}


