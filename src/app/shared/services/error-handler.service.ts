import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor() { }

  handleError(error: HttpErrorResponse) {
    // Customize as needed
    let errorMsg = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMsg = `Error: ${error.error.message}`;
    } else if (error.error && error.error.detail) {
      errorMsg = error.error.detail;
    } else if (error.message) {
      errorMsg = error.message;
    }
    return throwError(() => new Error(errorMsg));
  }
}
