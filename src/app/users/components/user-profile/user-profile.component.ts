import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="container mt-4">
      <div class="row">
        <div class="col-md-8 mx-auto">
          <div class="card shadow">
            <div class="card-header bg-primary text-white">
              <h3 class="mb-0">My Profile</h3>
            </div>
            <div class="card-body">
              <div *ngIf="loading" class="text-center p-5">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
              
              <form *ngIf="!loading" [formGroup]="profileForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input type="email" id="email" formControlName="email" class="form-control">
                  <div *ngIf="submitted && profileForm.get('email')?.errors" class="text-danger mt-1">
                    <div *ngIf="profileForm.get('email')?.errors?.['email']">Please enter a valid email</div>
                  </div>
                </div>
                
                <div class="mb-3">
                  <label for="username" class="form-label">Username</label>
                  <input type="text" id="username" formControlName="username" class="form-control">
                </div>
                
                <div class="mb-3">
                  <label for="password" class="form-label">New Password (leave blank to keep current)</label>
                  <input type="password" id="password" formControlName="password" class="form-control">
                  <div *ngIf="submitted && profileForm.get('password')?.errors" class="text-danger mt-1">
                    <div *ngIf="profileForm.get('password')?.errors?.['minlength']">Password must be at least 8 characters</div>
                  </div>
                </div>
                
                <div class="mb-3">
                  <label class="form-label">Role</label>
                  <input type="text" [value]="currentUser?.role" class="form-control" disabled>
                </div>
                
                <div *ngIf="error" class="alert alert-danger">{{ error }}</div>
                <div *ngIf="success" class="alert alert-success">{{ success }}</div>
                
                <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button type="submit" class="btn btn-primary" [disabled]="updating">
                    <span *ngIf="updating" class="spinner-border spinner-border-sm me-1"></span>
                    Update Profile
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class UserProfileComponent implements OnInit {
  profileForm: FormGroup;
  currentUser: any = null;
  loading = true;
  updating = false;
  submitted = false;
  error: string | null = null;
  success: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.profileForm = this.fb.group({
      email: ['', [Validators.email]],
      username: [''],
      password: ['', [Validators.minLength(8)]]
    });
  }

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.loading = true;
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.profileForm.patchValue({
          email: user.email,
          username: user.username
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load profile: ' + (err.error?.detail || err.message);
        this.loading = false;
      }
    });
  }

  onSubmit() {
    this.submitted = true;
    this.error = null;
    this.success = null;
    
    // Only include fields that have values
    const updateData: any = {};
    const formValue = this.profileForm.value;
    
    if (formValue.email) updateData.email = formValue.email;
    if (formValue.username) updateData.username = formValue.username;
    if (formValue.password) updateData.password = formValue.password;
    
    if (Object.keys(updateData).length === 0) {
      this.error = 'No changes to update';
      return;
    }
    
    this.updating = true;
    this.userService.updateCurrentUser(updateData).subscribe({
      next: (user) => {
        this.currentUser = user;
        this.success = 'Profile updated successfully';
        this.updating = false;
        this.profileForm.get('password')?.reset();
      },
      error: (err) => {
        this.error = 'Failed to update profile: ' + (err.error?.detail || err.message);
        this.updating = false;
      }
    });
  }
} 