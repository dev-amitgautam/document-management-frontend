import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getDocuments(skip = 0, limit = 100): Observable<any> {
    return this.http.get(`${this.apiUrl}/v1/documents?skip=${skip}&limit=${limit}`);
  }

  getDocumentById(documentId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/v1/documents/${documentId}`);
  }

  createDocument(formData: FormData, title: string, description?: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/v1/documents?title=${encodeURIComponent(title)}${description ? `&description=${encodeURIComponent(description)}` : ''}`,
      formData
    );
  }

  updateDocument(documentId: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/v1/documents/${documentId}`, data);
  }

  deleteDocument(documentId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/v1/documents/${documentId}`);
  }

  downloadDocument(documentId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/v1/documents/${documentId}/download`, { responseType: 'blob' });
  }
}
