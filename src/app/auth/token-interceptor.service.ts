import { HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

export const tokenInterceptor = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);
  const accessToken = authService.getAccessToken();

  // Clone the request and add the access token if available
  let authReq = req;
  if (accessToken) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  }

  // Handle the request
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // If a 401 Unauthorized error occurs, try refreshing the token
      if (error.status === 401 && !req.url.includes('refresh')) {
        return authService.refreshAccessToken().pipe(
          switchMap(newAccessToken => {
            // Clone the original request and add the new access token
            const newAuthReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newAccessToken}`
              }
            });
            return next(newAuthReq);
          }),
          catchError(refreshError => {
            authService.logout();
            return throwError(() => refreshError);
          })
        );
      }

      // If another error occurs, return the error
      return throwError(() => error);
    })
  );
};
