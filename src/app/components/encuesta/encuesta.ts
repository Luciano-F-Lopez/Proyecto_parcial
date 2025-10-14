import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-encuesta',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './encuesta.html',
  styleUrls: ['./encuesta.css']
})
export class Encuesta {
  form: FormGroup;
  enviado = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private supabase: SupabaseService,
    private router: Router
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      edad: ['', [Validators.required, Validators.min(18), Validators.max(99)]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d+$/), Validators.maxLength(10)]],
      pregunta1: ['', Validators.required],
      pregunta2: ['', Validators.required],
      pregunta3: ['', Validators.required]
    });
  }

  async onSubmit() {
    this.enviado = true;
    this.errorMessage = null;

    if (this.form.invalid) {
      this.errorMessage = "⚠ Debes completar todos los campos correctamente.";
      Object.keys(this.form.controls).forEach(field => {
        const control = this.form.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      return;
    }

    // 🔹 Obtener usuario logueado
    const { data: userData, error: userError } = await this.supabase.client.auth.getUser();

    if (userError || !userData?.user) {
      this.errorMessage = "⚠ Debes iniciar sesión para completar la encuesta.";
      return;
    }

    const user = userData.user;

    // 🔹 Insertar en tabla "encuestas"
    const { error } = await this.supabase.client
      .from('encuestas')
      .insert([
        {
          usuario_id: user.id,
          ...this.form.value
        }
      ]);

    if (error) {
      console.error(error);
      this.errorMessage = "⚠ Error al enviar la encuesta.";
      return;
    }

    alert('✅ Encuesta enviada correctamente');
    this.router.navigate(['/home']);
  }
}


