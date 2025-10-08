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
  styleUrls: ['./registro.css']
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
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      nombre: ['', [
        Validators.required,
        Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/),
        Validators.maxLength(50)
      ]],
      apellido: ['', [
        Validators.required,
        Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/),
        Validators.maxLength(50)
      ]],
      edad: ['', [
        Validators.required,
        Validators.min(12),
        Validators.max(120)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).{6,}$/)

      ]],
      confirmPassword: ['', Validators.required],
      aceptoTerminos: [false, Validators.requiredTrue]
    }, {
      validator: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ mismatch: true });
    } else {
      form.get('confirmPassword')?.setErrors(null);
    }
  }

  async onSubmit() {
  this.errorMessage = null;

  if (this.form.invalid) {
    this.errorMessage = "⚠ Debes completar todos los campos antes de enviar.";

    // Marca todos los campos como tocados para mostrar mensajes
    Object.keys(this.form.controls).forEach(field => {
      const control = this.form.get(field);
      control?.markAsTouched({ onlySelf: true });
    });

    return;
  }

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

