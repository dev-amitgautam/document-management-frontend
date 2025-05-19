import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
    <div class="container">
      <div class="row justify-content-center mt-5">
        <div class="col-md-6 col-lg-5">
          <div class="card shadow">
            <div class="card-body p-5">
              <h2 class="text-center mb-4">Login</h2>
              
              <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="username" class="form-label">Username</label>
                  <input 
                    type="text" 
                    id="username" 
                    formControlName="username" 
                    class="form-control"
                    [ngClass]="{'is-invalid': submitted && loginForm.get('username')?.errors}"
                  >
                  <div *ngIf="submitted && loginForm.get('username')?.errors" class="invalid-feedback">
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
                    [ngClass]="{'is-invalid': submitted && loginForm.get('password')?.errors}"
                  >
                  <div *ngIf="submitted && loginForm.get('password')?.errors" class="invalid-feedback">
                    Password is required
                  </div>
                </div>
                
                <div *ngIf="error" class="alert alert-danger mb-3">
                  {{ error }}
                </div>
                
                <div class="d-grid">
                  <button type="submit" class="btn btn-primary" [disabled]="loading">
                    <span *ngIf="loading" class="spinner-border spinner-border-sm me-1"></span>
                    Login
                  </button>
                </div>
                
                <div class="text-center mt-3">
                  <p>Don't have an account? <a routerLink="/auth/register">Register</a></p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  error: string | null = null;
  loading = false;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    this.submitted = true;
    this.error = null;
    
    if (this.loginForm.valid) {
      this.loading = true;
      const { username, password } = this.loginForm.value;
      
      this.authService.login(username, password).subscribe({
        next: (res) => {
          this.tokenService.setToken(res.access_token);
          this.router.navigate(['/documents']);
        },
        error: (err) => {
          this.error = err.error?.detail || 'Login failed. Please check your credentials.';
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }
} 