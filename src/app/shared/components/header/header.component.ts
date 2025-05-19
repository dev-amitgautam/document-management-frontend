import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../../auth/services/auth.service';
import { TokenService } from '../../../auth/services/token.service';
import { UserService } from '../../../users/services/user.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <a class="navbar-brand" routerLink="/">Document Management</a>
        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/documents" routerLinkActive="active">Documents</a>
            </li>
            <li class="nav-item" *ngIf="isAdmin">
              <a class="nav-link" routerLink="/users" routerLinkActive="active">Users</a>
            </li>
          </ul>
          
          <ul class="navbar-nav">
            <ng-container *ngIf="isLoggedIn; else unauthenticated">
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                  {{ currentUser?.username || 'User' }}
                </a>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li><a class="dropdown-item" routerLink="/profile">Profile</a></li>
                  <li><hr class="dropdown-divider"></li>
                  <li><a class="dropdown-item" href="#" (click)="logout($event)">Logout</a></li>
                </ul>
              </li>
            </ng-container>
            
            <ng-template #unauthenticated>
              <li class="nav-item">
                <a class="nav-link" routerLink="/auth/login" routerLinkActive="active">Login</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/auth/register" routerLinkActive="active">Register</a>
              </li>
            </ng-template>
          </ul>
        </div>
      </div>
    </nav>
  `,
  styles: []
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  isAdmin = false;
  currentUser: any = null;
  private isBrowser: boolean;

  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private userService: UserService,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  }

  ngOnInit() {
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    // Only check token in browser environment
    if (this.isBrowser) {
      this.isLoggedIn = this.authService.isLoggedIn();
      
      if (this.isLoggedIn) {
        this.loadUserInfo();
      }
    }
  }

  loadUserInfo() {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.isAdmin = user.role === 'admin';
      },
      error: () => {
        // If there's an error fetching user info, the token might be invalid
        this.handleInvalidToken();
      }
    });
  }

  handleInvalidToken() {
    this.tokenService.clearToken();
    this.isLoggedIn = false;
    this.isAdmin = false;
    this.currentUser = null;
    this.router.navigate(['/auth/login']);
  }

  logout(event: Event) {
    event.preventDefault();
    
    this.authService.logout().subscribe({
      next: () => {
        this.isLoggedIn = false;
        this.isAdmin = false;
        this.currentUser = null;
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        console.error('Logout failed:', err);
        // Even if the API call fails, we should still clear the token
        this.tokenService.clearToken();
        this.isLoggedIn = false;
        this.isAdmin = false;
        this.currentUser = null;
        this.router.navigate(['/auth/login']);
      }
    });
  }
} 