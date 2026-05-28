import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { UserRecord, UserProfile } from '../shared/models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: UserProfile | null = null;
  records: UserRecord[] = [];
  loading = false;
  error = '';
  delayMs = 1300;

  constructor(private authService: AuthService, private apiService: ApiService) {}

  ngOnInit(): void {
    this.user = this.authService.currentUser;
    if (this.user) {
      this.fetchRecords();
    }
  }

  fetchRecords(): void {
    if (!this.user) {
      return;
    }
    this.loading = true;
    this.apiService.getRecords(this.user, this.delayMs).subscribe({
      next: response => {
        this.records = response.records;
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to fetch records right now.';
        this.loading = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
