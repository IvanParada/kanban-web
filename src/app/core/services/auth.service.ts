import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { AuthResponse, AuthStatus, User } from '../models/auth.models';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _http = inject(HttpClient);
  private readonly _tokenService = inject(TokenService);
  private readonly baseUrl = environment.apiUrl;

  private _currentUser = signal<User | null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);

  public currentUser = this._currentUser.asReadonly();
  public authStatus = this._authStatus.asReadonly();

  constructor() {
    this.checkAuthStatus().subscribe();
  }

  checkAuthStatus(): Observable<boolean> {
    const token = this._tokenService.getToken();

    if (!token) {
      this.logout();
      return of(false);
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this._http.get<AuthResponse>(`${this.baseUrl}/auth/renew-token`, { headers }).pipe(
      map(({ data }) => {
        this.setSession(data);
        return true;
      }),
      catchError(() => {
        this.logout();
        return of(false);
      }),
    );
  }

  login(email: string, password: string): Observable<boolean> {
    const url = `${this.baseUrl}/auth/login`;
    return this._http.post<AuthResponse>(url, { email, password }).pipe(
      map(({ data }) => {
        this.setSession(data);
        return true;
      }),
      catchError((err) => {
        this._authStatus.set(AuthStatus.notAuthenticated);
        return throwError(() => err);
      }),
    );
  }

  register(name: string, email: string, password: string): Observable<boolean> {
    const url = `${this.baseUrl}/auth/register`;
    return this._http.post<AuthResponse>(url, { name, email, password }).pipe(
      map(({ data }) => {
        this.setSession(data);
        return true;
      }),
      catchError((err) => {
        this._authStatus.set(AuthStatus.notAuthenticated);
        return throwError(() => err);
      }),
    );
  }

  logout() {
    this._tokenService.removeToken();
    this._currentUser.set(null);
    this._authStatus.set(AuthStatus.notAuthenticated);
  }

  private setSession(data: AuthResponse['data']) {
    this._currentUser.set({
      id: data.id,
      email: data.email,
      name: data.name ?? '',
      isActive: data.isActive ?? true,
      role: data.role ?? [],
    });
    this._authStatus.set(AuthStatus.authenticated);
    this._tokenService.saveToken(data.token);
  }
}
