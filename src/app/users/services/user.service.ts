import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/v1/users/me`);
  }

  updateCurrentUser(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/v1/users/me`, data);
  }

  getUsers(skip = 0, limit = 100): Observable<any> {
    return this.http.get(`${this.apiUrl}/v1/users?skip=${skip}&limit=${limit}`);
  }

  getUserById(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/v1/users/${userId}`);
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/v1/users/${userId}`);
  }

  updateUserRole(userId: number, role: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/v1/users/${userId}/role`, { role });
  }
}
