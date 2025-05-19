import { Routes } from '@angular/router';
import { DocumentListComponent } from './components/document-list/document-list.component';
import { DocumentUploadComponent } from './components/document-upload/document-upload.component';
import { RoleGuard } from '../core/role.guard';

export const DOCUMENTS_ROUTES: Routes = [
  { path: '', component: DocumentListComponent },
  { 
    path: 'upload', 
    component: DocumentUploadComponent, 
    canActivate: [RoleGuard], 
    data: { roles: ['admin', 'editor'] } 
  }
]; 