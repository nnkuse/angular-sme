import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, ErrorHandler, Injector, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { componentRefresh } from '@angular/core/src/render3/instructions';

@Injectable()
export class ApplicationErrorHandle extends ErrorHandler {

  constructor(private injector: Injector, private zone: NgZone) {
    super();
  }

  handleError(errorResponse: HttpErrorResponse | any): void {
    if (errorResponse instanceof HttpErrorResponse){
      
      const error = (typeof errorResponse.error !== 'object') ? JSON.parse(errorResponse.error) : errorResponse.error;
      
      if (errorResponse.status === 400 &&
        (error.error === 'token_expired' || 
         error.error === 'token_invalid' || 
         error.error === 'A token is required' ||
         error.error === 'token_not_provided')) {
        this.goToLogin();
      }
      if (errorResponse.status === 401 && error.error === 'token_has_been_blacklisted') {
        this.goToLogin();
      }
      if (errorResponse.status === 500 && error.message === 'A token is required'){
        this.goToLogin();
      }
    }
    // if (errorResponse.error instanceof ErrorEvent) {
    //   console.error('Client side error: ', errorResponse.error.message);
    // } else {
    //   console.error('Server Side Error', errorResponse);
    // }
    super.handleError(errorResponse);
  }

  goToLogin(): Promise<boolean> {
    const router = this.injector.get(Router);
    return this.zone.run(() => router.navigate(['/auth/login']));
  }
}
