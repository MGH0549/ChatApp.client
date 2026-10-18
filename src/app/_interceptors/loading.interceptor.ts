import { inject, } from '@angular/core';
import {
  HttpInterceptorFn
} from '@angular/common/http';
import { delay, finalize, identity, Observable } from 'rxjs';
import { BusyService } from '../services/busy';
import { environment } from '../../environments/environment.development';

export const LoadingInterceptor: HttpInterceptorFn = (request, next) => {
  const busyService = inject(BusyService);

  busyService.busy();

  return next(request).pipe(
    (environment.production ? identity : delay(1000)),
    finalize(() => {
      busyService.idle()
      })
    )
  }

