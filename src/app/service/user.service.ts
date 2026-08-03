import { Injectable, signal, computed, inject } from '@angular/core';
import { AuthService, User } from '@auth0/auth0-angular';
import { toSignal } from '@angular/core/rxjs-interop';
import { ConfigService } from '../config/config.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private authService = inject(AuthService, { optional: true });
  private configService = inject(ConfigService);

  // Convert observables to signals only if auth is enabled
  private readonly userSignal = this.configService.config()?.enableDashboardApiServices && this.authService
    ? toSignal(this.authService.user$, { initialValue: null })
    : signal<User | null>(null);

  private readonly claimsSignal = this.configService.config()?.enableDashboardApiServices && this.authService
    ? toSignal(this.authService.idTokenClaims$, { initialValue: null })
    : signal<any>(null);

  // Public computed signals
  readonly user = computed(() => this.userSignal() ?? null);
  readonly tokenClaims = computed(() => this.claimsSignal() ?? null);

  // Helper method to check if user has a specific role
  hasRole(role: string): boolean {
    const claims = this.tokenClaims();
    return claims?.[`urn:raven/${role}`] ?? false;
  }

  // Login method - delegates to AuthService if available and auth is enabled
  loginWithRedirect(options?: any): void {
    if (this.configService.config()?.enableDashboardApiServices) {
      this.authService?.loginWithRedirect(options);
    }
  }

  logout(options?: any): void {
    if (this.configService.config()?.enableDashboardApiServices) {
      this.authService?.logout(options);
    }
  }
}
