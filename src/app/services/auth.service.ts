import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { AuthResponse, UserLoginPayload, UserProfile } from '../shared/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:4000/api';
  private userSubject = new BehaviorSubject<UserProfile | null>(this.readUser());
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(payload: UserLoginPayload): Observable<UserProfile> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, payload).pipe(
      map(response => {
        localStorage.setItem('app-token', response.token);
        localStorage.setItem('app-user', JSON.stringify(response.user));
        this.userSubject.next(response.user);
        return response.user;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('app-token');
    localStorage.removeItem('app-user');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  get currentUser(): UserProfile | null {
    return this.userSubject.value;
  }

  get isAuthenticated(): boolean {
    return !!localStorage.getItem('app-token') && !!this.currentUser;
  }

  private readUser(): UserProfile | null {
    const raw = localStorage.getItem('app-user');
    return raw ? (JSON.parse(raw) as UserProfile) : null;
  }
}
