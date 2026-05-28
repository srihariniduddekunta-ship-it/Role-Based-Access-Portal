import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserProfile, UserRecord } from '../shared/models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private apiUrl = 'http://localhost:4000/api';

  constructor(private http: HttpClient) {}

  getRecords(user: UserProfile, delayMs = 1200): Observable<{ records: UserRecord[] }> {
    const params = new HttpParams()
      .set('userId', user.id)
      .set('role', user.role)
      .set('delay', delayMs.toString());
    return this.http.get<{ records: UserRecord[] }>(`${this.apiUrl}/records`, { params });
  }
}
