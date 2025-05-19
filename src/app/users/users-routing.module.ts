import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { AuthGuard } from '../core/auth.guard';
import { RoleGuard } from '../core/role.guard';

const routes: Routes = [
  { 
    path: '', 
    component: UserListComponent, 
    canActivate: [AuthGuard, RoleGuard], 
    data: { roles: ['admin'] } 
  },
  { 
    path: 'profile', 
    component: UserProfileComponent, 
    canActivate: [AuthGuard] 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { } 