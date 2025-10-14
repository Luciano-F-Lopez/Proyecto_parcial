import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private supabase: SupabaseService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    // 1️⃣ Obtener usuario logueado
    const { data: userData, error: userError } = await this.supabase.client.auth.getUser();

    if (userError || !userData?.user) {
      this.router.navigate(['/login']);
      return false;
    }

    const userId = userData.user.id;

    // 2️⃣ Consultar rol en tabla 'usuarios'
    const { data: userRecord, error: roleError } = await this.supabase.client
      .from('usuarios')
      .select('role')
      .eq('id', userId)
      .single(); // devuelve un solo registro

    if (roleError || !userRecord) {
      this.router.navigate(['/home']);
      return false;
    }

    // 3️⃣ Validar rol
    if (userRecord.role !== 'admin') {
      this.router.navigate(['/home']);
      return false;
    }

    return true; // ✅ Es admin
  }
}



