import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { httpErrorInterceptor } from './core/interceptors/http-error.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';

import { routes } from './app.routes';

import { APP_CONFIG } from './core/config/app-config.token';
import { AppConfig } from './core/config/app-config.interface';


const runtimeConfig: AppConfig = {
  apiBaseUrl: 'https://localhost:7123/api'
};


export const appConfig: ApplicationConfig = {
  providers: [								
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        loadingInterceptor,             
        httpErrorInterceptor            
      ])
    ),
    {
      provide: APP_CONFIG,
      useValue: runtimeConfig
    }
  ]
};
