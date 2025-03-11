import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './services/auth.service'; // Your authentication service

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    try {
      const isAuthenticated = this.authService.isAuthenticated();
      const authType = route.data['authType'];

      // console.log("Validating Authorization:", authType)

      if (isAuthenticated) {
        if (authType === 'public') {
          this.router.navigate(['/']);
          return false;
        }
        return true;
      } else {
        if (authType === 'private') {
          this.router.navigate(['/login']);
          return false;
        }
        return true;
      }
    } catch (error) {
      console.error('Auth guard error:', error);
      this.router.navigate(['/login']);
      return false;
    }
  }
}
