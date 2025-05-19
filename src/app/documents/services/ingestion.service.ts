import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IngestionService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getIngestions(skip = 0, limit = 100): Observable<any> {
    return this.http.get(`${this.apiUrl}/v1/ingestions?skip=${skip}&limit=${limit}`);
  }

  createIngestion(documentId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/v1/ingestions`, { document_id: documentId });
  }

  getIngestionById(ingestionId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/v1/ingestions/${ingestionId}`);
  }

  updateIngestion(ingestionId: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/v1/ingestions/${ingestionId}`, data);
  }

  getIngestionsForDocument(documentId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/v1/ingestions/document/${documentId}`);
  }
}
