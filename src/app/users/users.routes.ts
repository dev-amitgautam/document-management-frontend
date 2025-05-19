import { Routes } from '@angular/router';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { RoleGuard } from '../core/role.guard';

export const USERS_ROUTES: Routes = [
  { 
    path: '', 
    component: UserListComponent, 
    canActivate: [RoleGuard], 
    data: { roles: ['admin'] } 
  },
  { path: 'profile', component: UserProfileComponent }
]; 