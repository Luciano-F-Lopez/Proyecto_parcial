import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {
  form: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private supabase: SupabaseService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(1)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async onSubmit() {
    if (this.form.invalid) return;

    const { email, password, nombre, apellido, edad } = this.form.value;

   
    const { data, error } = await this.supabase.client.auth.signUp({
      email,
      password,
    });

    if (error) {
      this.errorMessage = error.message;
      return;
    }

    if (data.user) {
      
      const { error: dbError } = await this.supabase.client
        .from('usuarios')
        .insert([
          {
            id: data.user.id, 
            nombre,
            apellido,
            edad,
            email,
          },
        ]);

      if (dbError) {
        this.errorMessage = dbError.message;
        return;
      }

      
      this.router.navigate(['/home']);
    }
  }
}
