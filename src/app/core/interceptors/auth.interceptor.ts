import { HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

/**
 * Attaches Authorization header with Bearer token from localStorage.
 * On 401 it clears the token and redirects to the login page.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('auth_token');

  const authReq = token
    ? req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) })
    : req;

  return next(authReq).pipe(
    catchError((err: any) => {
      if (err && err.status === 401) {
        try { localStorage.removeItem('auth_token'); } catch { }
        try { window.location.href = '/login'; } catch { }
      }
      return throwError(() => err);
    })
  );
};
