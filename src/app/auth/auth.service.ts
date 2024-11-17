import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import {environment} from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = `${environment.apiBaseUrl}Auth/login`; // Login endpoint
  private refreshUrl = `${environment.apiBaseUrl}Auth/refresh`; // Refresh token endpoint

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { username: string, password: string }): Observable<{ accessToken: string, refreshToken: string }> {
    return this.http.post<{ accessToken: string, refreshToken: string }>(this.authUrl, credentials).pipe(
      tap(response => {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
      })
    );
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.router.navigate(['/login']);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  refreshAccessToken(): Observable<string> {
    const refreshToken = this.getRefreshToken();
    const accessToken = this.getAccessToken();

    if (!refreshToken || !accessToken) {
      return throwError(() => new Error('No tokens available for refresh'));
    }

    return this.http.post<{ accessToken: string, refreshToken?: string }>(this.refreshUrl, {
      accessToken,
      refreshToken
    }).pipe(
      tap(response => {
        localStorage.setItem('accessToken', response.accessToken);  // Update access token
        if (response.refreshToken) {
          localStorage.setItem('refreshToken', response.refreshToken);  // Update refresh token if provided
        }
      }),
      switchMap(response => of(response.accessToken)),  // Return Observable<string>
      catchError((error: HttpErrorResponse) => {
        this.logout();
        return throwError(() => error);  // Ensures Observable<string> return type in case of error
      })
    );
  }


}
