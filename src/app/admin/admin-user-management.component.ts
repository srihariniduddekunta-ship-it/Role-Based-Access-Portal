import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppUser } from '../shared/models';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-admin-user-management',
  templateUrl: './admin-user-management.component.html',
  styleUrls: ['./admin-user-management.component.css']
})
export class AdminUserManagementComponent implements OnInit {
  users: AppUser[] = [];
  loading = false;
  manageLoading = false;
  error = '';
  selectedUserId: string | null = null;
  userForm: FormGroup;

  roles = ['General User', 'Admin'];

  constructor(private userService: UserService, private fb: FormBuilder) {
    this.userForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      password: ['', Validators.required],
      role: ['General User', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = '';
    this.userService.getUsers().subscribe({
      next: response => {
        this.users = response.users;
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to load users from the server.';
        this.loading = false;
      }
    });
  }

  submitUser(): void {
    if (this.userForm.invalid) {
      return;
    }
    this.manageLoading = true;
    const payload = this.userForm.value as AppUser;

    if (this.selectedUserId) {
      this.userService.updateUser(this.selectedUserId, payload).subscribe({
        next: () => {
          this.resetForm();
          this.loadUsers();
        },
        error: () => {
          this.error = 'Unable to update user.';
          this.manageLoading = false;
        }
      });
      return;
    }

    this.userService.addUser(payload).subscribe({
      next: () => {
        this.resetForm();
        this.loadUsers();
      },
      error: () => {
        this.error = 'Unable to add user. Confirm the user ID is unique.';
        this.manageLoading = false;
      }
    });
  }

  editUser(user: AppUser): void {
    this.selectedUserId = user.id;
    this.userForm.setValue({
      id: user.id,
      name: user.name,
      password: '',
      role: user.role
    });
  }

  deleteUser(userId: string): void {
    this.manageLoading = true;
    this.userService.deleteUser(userId).subscribe({
      next: () => {
        if (this.selectedUserId === userId) {
          this.resetForm();
        }
        this.loadUsers();
      },
      error: () => {
        this.error = 'Unable to delete the user.';
        this.manageLoading = false;
      }
    });
  }

  resetForm(): void {
    this.selectedUserId = null;
    this.userForm.reset({ role: 'General User' });
    this.manageLoading = false;
  }
}
