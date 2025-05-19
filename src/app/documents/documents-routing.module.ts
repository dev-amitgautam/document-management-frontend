import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentListComponent } from './components/document-list/document-list.component';
import { DocumentUploadComponent } from './components/document-upload/document-upload.component';
import { AuthGuard } from '../core/auth.guard';
import { RoleGuard } from '../core/role.guard';

const routes: Routes = [
  { path: '', component: DocumentListComponent, canActivate: [AuthGuard] },
  { path: 'upload', component: DocumentUploadComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['admin', 'editor'] } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentsRoutingModule { } 