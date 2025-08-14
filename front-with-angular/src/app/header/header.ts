import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth'; // You'll need to create this

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  isAuthenticated = false; // This should come from your AuthService
  username: string | null = null;

  constructor(private readonly authService: AuthService) {
    authService.isAuthenticated$.subscribe((isAuth) => {
      this.isAuthenticated = isAuth;
    });

    authService.userProfile$.subscribe((profile) => {
      this.username = profile?.username || null;
    });
  }

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }
}
