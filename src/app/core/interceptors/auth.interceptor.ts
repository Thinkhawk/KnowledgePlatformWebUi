import { HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { inject } from '@angular/core';
import { AppConfig } from '../config/app-config.interface';
import { APP_CONFIG } from '../config/app-config.token';
import { AuthService } from '../services/auth.service';


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const config = inject<AppConfig>(APP_CONFIG);

  if (!req.url.startsWith(config.apiBaseUrl)) {
    return next(req);
  }

  const token = authService.getToken();

  if (!token) {
    return next(req);
  }


  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });


  /** Forward the modified request. */
  return next(authReq);
};
