import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="container">
      <div class="row justify-content-center mt-5">
        <div class="col-md-6 col-lg-5">
          <div class="card shadow">
            <div class="card-body p-5">
              <h2 class="text-center mb-4">Register</h2>
              
              <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    formControlName="email" 
                    class="form-control"
                    [ngClass]="{'is-invalid': submitted && registerForm.get('email')?.errors}"
                  >
                  <div *ngIf="submitted && registerForm.get('email')?.errors" class="invalid-feedback">
                    <div *ngIf="registerForm.get('email')?.errors?.['required']">Email is required</div>
                    <div *ngIf="registerForm.get('email')?.errors?.['email']">Email must be valid</div>
                  </div>
                </div>
                
                <div class="mb-3">
                  <label for="username" class="form-label">Username</label>
                  <input 
                    type="text" 
                    id="username" 
                    formControlName="username" 
                    class="form-control"
                    [ngClass]="{'is-invalid': submitted && registerForm.get('username')?.errors}"
                  >
                  <div *ngIf="submitted && registerForm.get('username')?.errors" class="invalid-feedback">
                    Username is required
                  </div>
                </div>
                
                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input 
                    type="password" 
                    id="password" 
                    formControlName="password" 
                    class="form-control"
                    [ngClass]="{'is-invalid': submitted && registerForm.get('password')?.errors}"
                  >
                  <div *ngIf="submitted && registerForm.get('password')?.errors" class="invalid-feedback">
                    <div *ngIf="registerForm.get('password')?.errors?.['required']">Password is required</div>
                    <div *ngIf="registerForm.get('password')?.errors?.['minlength']">Password must be at least 8 characters</div>
                  </div>
                </div>
                
                <div class="mb-3">
                  <label for="role" class="form-label">Role</label>
                  <select 
                    id="role" 
                    formControlName="role" 
                    class="form-select"
                    [ngClass]="{'is-invalid': submitted && registerForm.get('role')?.errors}"
                  >
                    <option value="">Select Role</option>
                    <option value="viewer">Viewer</option>
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                  </select>
                  <div *ngIf="submitted && registerForm.get('role')?.errors" class="invalid-feedback">
                    Role is required
                  </div>
                </div>
                
                <div *ngIf="error" class="alert alert-danger mb-3">
                  {{ error }}
                </div>
                
                <div class="d-grid">
                  <button type="submit" class="btn btn-primary" [disabled]="loading">
                    <span *ngIf="loading" class="spinner-border spinner-border-sm me-1"></span>
                    Register
                  </button>
                </div>
                
                <div class="text-center mt-3">
                  <p>Already have an account? <a routerLink="/auth/login">Login</a></p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  registerForm: FormGroup;
  error: string | null = null;
  loading = false;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      role: ['', Validators.required]
    });
  }

  onSubmit() {
    this.submitted = true;
    this.error = null;
    
    if (this.registerForm.valid) {
      this.loading = true;
      
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.router.navigate(['/auth/login'], { 
            queryParams: { registered: 'success' } 
          });
        },
        error: (err) => {
          this.error = err.error?.detail || 'Registration failed. Please try again.';
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }
} 