import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import {  provideHttpClient, withInterceptors } from '@angular/common/http';
import {  tokenInterceptor } from './_interceptors/jwt.interceptor';
import { provideToastr } from '@relynn/ngx-toastr';
import { LoadingInterceptor } from './_interceptors/loading.interceptor';
import { ErrorInterceptor } from './_interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(),
    provideToastr(),
    provideHttpClient(withInterceptors([ tokenInterceptor,LoadingInterceptor,ErrorInterceptor]))
  ]
  
};
