import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkMode = true;

  toggleTheme() {
    this.darkMode = !this.darkMode;
    document.body.classList.toggle('light-mode', !this.darkMode);
  }

  isDarkMode(): boolean {
    return this.darkMode;
  }
}
