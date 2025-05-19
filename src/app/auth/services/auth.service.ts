import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { TokenService } from './token.service';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {}

  register(data: { email: string; username: string; password: string; role: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/v1/auth/register`, data);
  }

  login(username: string, password: string): Observable<any> {
    const body = new URLSearchParams();
    body.set('username', username);
    body.set('password', password);
    return this.http.post(`${this.apiUrl}/v1/auth/login`, body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  }

  logout(): Observable<any> {
    // Call the logout API endpoint
    return this.http.post(`${this.apiUrl}/v1/auth/logout`, {}).pipe(
      tap(() => {
        // Clear the token from storage after successful API call
        this.tokenService.clearToken();
      })
    );
  }

  isLoggedIn(): boolean {
    return !!this.tokenService.getToken();
  }
}
