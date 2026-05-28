import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppUser } from '../shared/models';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:4000/api';

  constructor(private http: HttpClient) {}

  getUsers(delayMs = 1100): Observable<{ users: AppUser[] }> {
    const params = new HttpParams().set('delay', delayMs.toString());
    return this.http.get<{ users: AppUser[] }>(`${this.apiUrl}/users`, { params });
  }

  addUser(user: AppUser): Observable<{ user: AppUser }> {
    return this.http.post<{ user: AppUser }>(`${this.apiUrl}/users`, user);
  }

  updateUser(userId: string, user: Partial<AppUser>): Observable<{ user: AppUser }> {
    return this.http.put<{ user: AppUser }>(`${this.apiUrl}/users/${userId}`, user);
  }

  deleteUser(userId: string): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/users/${userId}`);
  }
}
