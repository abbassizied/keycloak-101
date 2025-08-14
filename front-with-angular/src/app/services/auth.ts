import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import Keycloak from 'keycloak-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private keycloak: Keycloak;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();
  private userProfileSubject = new BehaviorSubject<any>(null);
  public userProfile$: Observable<any> = this.userProfileSubject.asObservable();

  constructor() {
    this.keycloak = new Keycloak({
      url: 'http://localhost:7080/auth',
      realm: 'sentinel-nexus-realm',
      clientId: 'angular-101-client'
    });
  }

  async init(): Promise<void> {
    try {
      const authenticated = await this.keycloak.init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
        pkceMethod: 'S256'
      });

      this.isAuthenticatedSubject.next(authenticated);

      if (authenticated) {
        this.loadUserProfile();
      }
    } catch (error) {
      console.error('Keycloak initialization failed', error);
    }
  }

  async login(): Promise<void> {
    await this.keycloak.login({
      redirectUri: window.location.origin
    });
  }

  async logout(): Promise<void> {
    await this.keycloak.logout({
      redirectUri: window.location.origin
    });
  }

  getToken(): string | undefined {
    return this.keycloak.token;
  }

  private async loadUserProfile(): Promise<void> {
    try {
      const profile = await this.keycloak.loadUserProfile();
      this.userProfileSubject.next(profile);
    } catch (error) {
      console.error('Failed to load user profile', error);
    }
  }

  updateToken(minValidity = 30): Promise<boolean> {
    return this.keycloak.updateToken(minValidity);
  }

  getRoles(): string[] {
    return this.keycloak.tokenParsed?.realm_access?.roles || [];
  }

  hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }  
}
