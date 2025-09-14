import { Component } from '@angular/core';
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

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

 async login() {
  this.errorMessage = null;
  const { email, password } = this.form.value;

  console.log(this.form.value)

  const { data, error } = await this.supabaseService.client.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    this.errorMessage = error.message;
  } else {
    console.log('Login success:', data);
    this.router.navigate(['/home']); // redirigir al home
  }
}

}
