import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from '@relynn/ngx-toastr';
import { isPlatformBrowser } from '@angular/common';


export const ErrorInterceptor: HttpInterceptorFn = (request, next) => {
  const router: Router = inject(Router);
  const toastr: ToastrService = inject(ToastrService);
  const platformId = inject(PLATFORM_ID);
    return next(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error) {
          switch (error.status) {
            case 400:
              if (error.error.errors) {
                const modelStateErrors = [];
                for (const key in error.error.errors) {
                  if (error.error.errors[key]) {
                    modelStateErrors.push(error.error.errors[key])
                  }
                }
                throw modelStateErrors.flat();
              } else {
                if (isPlatformBrowser(platformId)) {
                toastr.error(error.error, error.status.toString())
              }
              }
              break;
            case 401:
              if (isPlatformBrowser(platformId)) {
              toastr.error('Unauthorised', error.status.toString());
              }
              break;
            case 404:
              router.navigateByUrl('/not-found');
              break;
            case 500:
              const navigationExtras: NavigationExtras = {state: {error: error.error}};
              router.navigateByUrl('/server-error', navigationExtras);
              break;
            default:
              if (isPlatformBrowser(platformId)) {
              toastr.error('Something unexpected went wrong');
              }
              console.log(error);
              break;
          }
        }
        throw error;
      })
    )
  }

