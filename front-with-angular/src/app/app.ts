import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './header/header';
import { ThemeService } from './services/theme';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('Keycloak 101');

  constructor(
    private readonly themeService: ThemeService,
    public authService: AuthService
  ) {}

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  isDarkMode() {
    return this.themeService.isDarkMode();
  }

  ngOnInit() {
    // Just start the initialization without awaiting
    this.authService
      .init()
      .then((initialized) => {
        console.log('Auth service initialized:', initialized);
      })
      .catch((error) => {
        console.error('Auth initialization failed:', error);
      });
  }
}
