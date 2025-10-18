// services/auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import Keycloak from 'keycloak-js';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly keycloak: Keycloak;
  private readonly isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$: Observable<boolean> =
    this.isAuthenticatedSubject.asObservable();

  private readonly userProfileSubject = new BehaviorSubject<UserProfile | null>(
    null
  );
  public userProfile$: Observable<UserProfile | null> =
    this.userProfileSubject.asObservable();

  private initialized = false;

  constructor() {
    this.keycloak = new Keycloak({
      url: 'http://localhost:7080',
      realm: 'sentinel-nexus-realm',
      clientId: 'angular-101-client',
    });
  }

  async init(): Promise<boolean> {
    try {
      // CHANGE THIS: Use 'login-required' instead of 'check-sso'
      const authenticated = await this.keycloak.init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri:
        window.location.origin + '/assets/silent-check-sso.html',
      });

      console.log('Keycloak initialized, authenticated:', authenticated);
      this.isAuthenticatedSubject.next(authenticated);
      this.initialized = true;

      if (authenticated) {
        await this.loadUserProfile();
        this.keycloak.onTokenExpired = () => {
          this.updateToken(30);
        };
      }

      return authenticated;
    } catch (error) {
      console.error('Keycloak initialization failed', error);
      this.isAuthenticatedSubject.next(false);
      this.initialized = true;
      return false;
    }
  }

  async login(): Promise<void> {
    try {
      if (!this.initialized) {
        await this.init();
      }

      await this.keycloak.login({
        redirectUri: window.location.origin + '/',
      });
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.keycloak.logout({
        redirectUri: window.location.origin + '/',
      });
      this.userProfileSubject.next(null);
      this.isAuthenticatedSubject.next(false);
    } catch (error) {
      console.error('Logout failed', error);
      throw error;
    }
  }

  getToken(): string | undefined {
    return this.keycloak.token;
  }

  private async loadUserProfile(): Promise<void> {
    try {
      const profile = await this.keycloak.loadUserProfile();
      const userProfile: UserProfile = {
        id: profile.id || '',
        username: profile.username || '',
        email: profile.email || '',
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        token: this.keycloak.token || '',
      };
      this.userProfileSubject.next(userProfile);
    } catch (error) {
      console.error('Failed to load user profile', error);
    }
  }

  async updateToken(minValidity: number = 5): Promise<boolean> {
    try {
      const refreshed = await this.keycloak.updateToken(minValidity);
      if (refreshed) {
        console.log('Token refreshed');
        await this.loadUserProfile();
      }
      return refreshed;
    } catch (error) {
      console.error('Failed to refresh token', error);
      return false;
    }
  }

  getRoles(): string[] {
    return this.keycloak.tokenParsed?.realm_access?.roles || [];
  }

  hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }

  isLoggedIn(): boolean {
    return this.keycloak.authenticated || false;
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}
