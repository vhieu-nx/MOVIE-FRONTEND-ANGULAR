import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.loggedUser
      .pipe(
        take(1),
        map(user => {
          const isAuthenticated = !!user;
          if (isAuthenticated) {
            return true;
          }
          return this.router.createUrlTree(['/auth/login']);
        })
      );
  }
}
