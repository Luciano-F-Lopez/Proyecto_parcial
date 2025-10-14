import { Component, ChangeDetectorRef  } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  form: FormGroup;
  errorMessage: string | null = null;

   usuariosRapidos = [
    { email: 'prueba1@gmail.com', password: '123456' },
    { email: 'prueba2@gmail.com', password: '123456' },
    { email: 'prueba3@gmail.com', password: '123456' }
  ];

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private router: Router,
    private cd: ChangeDetectorRef 
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

 async login() {
  this.errorMessage = null;
  if (this.form.invalid) {
    this.errorMessage = "⚠ Debes completar todos los campos antes de enviar.";
    this.form.markAllAsTouched();
    return;
  }

  const { email, password } = this.form.value;
  

  console.log(this.form.value)

  const { data, error } = await this.supabaseService.client.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    this.errorMessage = "❌ Usuario o contraseña inválidos. Intenta nuevamente.";
    this.cd.detectChanges(); 
  } else {
    console.log('Login success:', data);
    this.router.navigate(['/home']); 
  }
}


async loginRapido(usuario: { email: string, password: string }) {
    this.form.setValue({ email: usuario.email, password: usuario.password });
    await this.login();
  }

}
