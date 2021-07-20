import { Injectable } from '@angular/core';
import {of, Observable, BehaviorSubject} from 'rxjs';
import { catchError, mapTo, tap } from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {ResponseData} from '../models/response-data';
import {User} from '../models/user';
import {NotifierService} from 'angular-notifier';
import {ErrorMessages} from '../../shared/error-messages';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenExpirationTimer: any;
  private readonly USER_DATA = 'userData';
  loggedUser = new BehaviorSubject<User>(null);
  isLoading = false;

  constructor(private http: HttpClient, private notifierService: NotifierService) {}

  register(user: { email: string, password: string }): Observable<boolean> {
    return this.http.post<any>(`${environment.backend_base_url}/register`, user)
      .pipe(
        tap(() => this.notifierService.notify('success', 'Your account was created. Please log in')),
        mapTo(true),
        catchError(error => {
          if (error.status === 400) {
            this.handleError(error.error);
          } else {
            this.notifierService.notify('error', ErrorMessages.UNKNOWN_ERROR);
          }
          return of(false);
        }));
  }

  login(user: { email: string, password: string }): Observable<boolean> {
    this.isLoading = true;
    return this.http.post<any>(`${environment.backend_base_url}/login`, user)
      .pipe(
        tap((data: ResponseData) => {
          this.doLoginUser(data.userId, data.email, data.jwtToken, +data.expiresIn);
          this.isLoading = false;
        }),
        mapTo(true),
        catchError(error => {
          this.isLoading = false;
          if (error.status === 401) {
            this.handleError(error.error);
          } else {
            this.notifierService.notify('error', ErrorMessages.UNKNOWN_ERROR);
          }

          return of(false);
        }));
  }

  logout(): Observable<boolean> {
    return this.http.post<any>(`${environment.backend_base_url}/sign-out`, {})
      .pipe(
        tap(() => {
          this.doLogoutUser();
        }),
        mapTo(true),
        catchError(() => {
          this.doLogoutUser();
          this.notifierService.notify('error', ErrorMessages.UNKNOWN_ERROR);
          return of(false);
      }));
  }

  private doLoginUser(id: number, email: string, token: string, expiresIn: number): void {
    const expirationDate = new Date(new Date().getTime() + expiresIn);
    const user = new User(id, email, token, expirationDate);
    this.loggedUser.next(user);
    this.saveUserData(user);
    this.autoLogout(expiresIn);
  }

  private doLogoutUser(): void {
    this.loggedUser.next(null);
    this.removeUserData();
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  getJwtToken(): string {
    const user: User = JSON.parse(localStorage.getItem(this.USER_DATA));
    if (user) {
      return user.jwtToken;
    }
  }

  isLoggedIn(): boolean {
    return !!this.getJwtToken();
  }

  autoLogin(): void {
    const user = JSON.parse(localStorage.getItem(this.USER_DATA));
    if (!user) {
      return;
    }

    const retrievedUser = new User(user.id, user.email, user.jwtToken, user.tokenExpirationDate);

    if (retrievedUser.token) {
      this.loggedUser.next(retrievedUser);
      const expirationDuration = new Date(user.tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  autoLogout(expirationDuration: number): void {
    this.tokenExpirationTimer = setTimeout(() => {
      this.doLogoutUser();
    }, expirationDuration);
  }

  emailExists(emailDto: { email: string }): Observable<boolean> {
    return this.http.post<boolean>(`${environment.backend_base_url}/email-check`, emailDto);
  }

  private saveUserData(user: User): void {
    localStorage.setItem(this.USER_DATA, JSON.stringify(user));
  }

  private removeUserData(): void {
    localStorage.removeItem(this.USER_DATA);
  }

  handleError(errors: string[]): void {
    errors.forEach(err => {
      this.notifierService.notify('error', err);
    });
  }

}
