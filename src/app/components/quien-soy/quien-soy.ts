import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-quien-soy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quien-soy.html',
  styleUrl: './quien-soy.css'
})

export class QuienSoy {
  userData: any;
  loading = true;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const username = 'Luciano-F-Lopez'; 
    this.http.get(`https://api.github.com/users/${username}`).subscribe({
      next: (data) => { this.userData = data; this.loading = false; },
      error: (err) => { console.error(err); this.loading = false; }
    });
  }
}
