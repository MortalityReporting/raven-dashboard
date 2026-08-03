import {Injectable, signal} from '@angular/core';
import {Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedHttpErrorService {
  // Signals for error state
  private errorDetectedSignal = signal<boolean>(false);
  private errorMessageSignal = signal<string>('');
  private targetComponentSignal = signal<string | null>(null);

  private readonly DEFAULT_ERROR_MESSAGE = 'Server Error Detected';

  // Expose read-only signals
  readonly errorDetected = this.errorDetectedSignal.asReadonly();
  readonly errorMessage = this.errorMessageSignal.asReadonly();
  readonly targetComponent = this.targetComponentSignal.asReadonly();

  /**
   * Sets error message and target component
   * @param message - Error message to display
   * @param componentName - Optional component name where error should be displayed. If null, displays on main page.
   * This is used if we want top render an error message in the modal or directly inside a component.
   */
  setErrorMessage(message: string | null, componentName: string | null = null) {
    if (message) {
      this.errorDetectedSignal.set(true);
      this.errorMessageSignal.set(message);
      this.targetComponentSignal.set(componentName);
    } else {
      this.errorMessageSignal.set('');
      this.errorDetectedSignal.set(false);
      this.targetComponentSignal.set(null);
    }
  }

  showErrorComponent() {
    this.errorDetectedSignal.set(true);
  }

  hideErrorComponent() {
    this.setErrorMessage(null);
  }

  /**
   * Handle HTTP errors consistently across all services
   * @param error - The error object from the HTTP request
   * @param errMsg - Optional custom error message
   * @param componentName - Optional component name where error should be displayed. If not provided, displays on main page.
   * @returns Observable that throws the error
   */
  handleError(error: any, errMsg?: string, componentName?: string): Observable<never> {
    let errorMsg = '';
    console.error(error);
    if (error.status === 404) {
      errorMsg = "404. Unable to reach the API";
    } else if (error.status === 500) {
      errorMsg = '500. Fatal API error detected, see API server logs';
    } else {
      errorMsg = this.DEFAULT_ERROR_MESSAGE;
    }

    this.setErrorMessage(errorMsg, componentName || null);
    return throwError(() => error);
  }
}
