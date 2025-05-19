import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DocumentService } from '../../services/document.service';

@Component({
  selector: 'app-document-upload',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  template: `
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <h1 class="h2 mb-4">Upload Document</h1>
          
          <div class="card">
            <div class="card-body">
              <form [formGroup]="uploadForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="title" class="form-label">Title</label>
                  <input
                    type="text"
                    id="title"
                    formControlName="title"
                    class="form-control"
                    placeholder="Enter document title"
                  >
                  @if (uploadForm.get('title')?.invalid && uploadForm.get('title')?.touched) {
                    <div class="text-danger mt-1">Title is required</div>
                  }
                </div>

                <div class="mb-3">
                  <label for="description" class="form-label">Description</label>
                  <textarea
                    id="description"
                    formControlName="description"
                    class="form-control"
                    rows="3"
                    placeholder="Enter document description"
                  ></textarea>
                </div>

                <div class="mb-4">
                  <label for="file" class="form-label">File</label>
                  <input
                    type="file"
                    id="file"
                    (change)="onFileSelected($event)"
                    class="form-control"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.png"
                  >
                  @if (!selectedFile && isSubmitted) {
                    <div class="text-danger mt-1">Please select a file</div>
                  }
                </div>

                <div class="d-flex justify-content-end">
                  <button
                    type="button"
                    routerLink="/documents"
                    class="btn btn-outline-secondary me-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    [disabled]="uploadForm.invalid"
                    class="btn btn-primary"
                  >
                    Upload
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class DocumentUploadComponent {
  uploadForm: FormGroup;
  selectedFile: File | null = null;
  isSubmitted = false;

  constructor(
    private fb: FormBuilder,
    private documentService: DocumentService,
    private router: Router
  ) {
    this.uploadForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    } else {
      this.selectedFile = null;
    }
  }

  onSubmit(): void {
    this.isSubmitted = true;

    if (this.uploadForm.valid && this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      const title = this.uploadForm.get('title')?.value;
      const description = this.uploadForm.get('description')?.value || '';

      this.documentService.createDocument(formData, title, description).subscribe({
        next: () => this.router.navigate(['/documents']),
        error: (err) => alert('Upload failed: ' + err.message)
      });
    }
  }
} 