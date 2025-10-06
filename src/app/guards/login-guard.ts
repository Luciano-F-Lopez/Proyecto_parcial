import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(
    private supabase: SupabaseService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {
    const { data: { user } } = await this.supabase.client.auth.getUser();

    if (user) {
      
      this.router.navigate(['/home']);
      return false;
    }

    
    return true;
  }
}

