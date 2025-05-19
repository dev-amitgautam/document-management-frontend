import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Document } from '../../models/document.model';
import { DocumentService } from '../../services/document.service';
import { IngestionService } from '../../services/ingestion.service';
import { UserService } from '../../../users/services/user.service';

@Component({
  selector: 'app-document-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h2 mb-0">Documents</h1>
        <button *ngIf="canEdit" routerLink="/documents/upload" class="btn btn-primary">
          <i class="bi bi-plus-lg me-1"></i> Upload Document
        </button>
      </div>
      
      <div *ngIf="loading" class="text-center p-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      
      <div *ngIf="error" class="alert alert-danger">
        {{ error }}
      </div>
      
      <div *ngIf="!loading && documents.length === 0" class="text-center p-5">
        <p class="text-muted">No documents found</p>
        <button *ngIf="canEdit" routerLink="/documents/upload" class="btn btn-outline-primary mt-2">
          Upload your first document
        </button>
      </div>
      
      <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <div class="col" *ngFor="let document of documents">
          <div class="card h-100 shadow-sm">
            <div class="card-body">
              <h5 class="card-title">{{ document.title }}</h5>
              <p class="card-text text-muted small">
                {{ document.description || 'No description' }}
              </p>
              <div class="d-flex justify-content-between align-items-center">
                <span class="badge" [ngClass]="getStatusClass(document.status)">
                  {{ document.status }}
                </span>
                <small class="text-muted">
                  {{ document.createdAt | date:'short' }}
                </small>
              </div>
            </div>
            <div class="card-footer bg-transparent">
              <div class="d-flex justify-content-between">
                <button class="btn btn-sm btn-outline-primary" (click)="downloadDocument(document.id)">
                  <i class="bi bi-download me-1"></i> Download
                </button>
                <div *ngIf="canEdit">
                  <button class="btn btn-sm btn-outline-danger" (click)="deleteDocument(document.id)">
                    <i class="bi bi-trash me-1"></i> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DocumentListComponent implements OnInit {
  documents: Document[] = [];
  loading = true;
  error: string | null = null;
  currentUser: any = null;
  canEdit = false;

  constructor(
    private documentService: DocumentService,
    private ingestionService: IngestionService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loadCurrentUser();
    this.loadDocuments();
  }

  loadCurrentUser() {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.canEdit = ['admin', 'editor'].includes(user.role);
      },
      error: () => {
        this.canEdit = false;
      }
    });
  }

  loadDocuments() {
    this.loading = true;
    this.documentService.getDocuments().subscribe({
      next: (docs) => {
        this.documents = docs;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load documents: ' + (err.error?.detail || err.message);
        this.loading = false;
      }
    });
  }

  downloadDocument(id: number) {
    this.documentService.downloadDocument(id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `document_${id}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      error: (err) => {
        alert('Failed to download: ' + (err.error?.detail || err.message));
      }
    });
  }

  deleteDocument(id: number) {
    if (confirm('Are you sure you want to delete this document?')) {
      this.documentService.deleteDocument(id).subscribe({
        next: () => {
          this.documents = this.documents.filter(doc => doc.id !== id);
        },
        error: (err) => {
          alert('Failed to delete: ' + (err.error?.detail || err.message));
        }
      });
    }
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'pending':
        return 'bg-warning text-dark';
      case 'processing':
        return 'bg-info text-dark';
      case 'completed':
        return 'bg-success text-white';
      case 'failed':
        return 'bg-danger text-white';
      default:
        return '';
    }
  }
} 