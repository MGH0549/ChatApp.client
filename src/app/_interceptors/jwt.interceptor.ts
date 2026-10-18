import { inject, PLATFORM_ID } from '@angular/core';
import {
  HttpInterceptorFn
} from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
   console.log('Interceptor called:', req.url);
    const platformId = inject(PLATFORM_ID); 
    if (!isPlatformBrowser(platformId)) { 
      console.log('Running on server; skipping localStorage');
       return next(req); 
      } 
      const storedUser = localStorage.getItem('user'); 
      console.log('Stored user:', storedUser); 
      if (storedUser) { 
        try { const user = JSON.parse(storedUser);
           const token = user?.token;
           
            if (token) { 
              req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
               
              }
             } 
             catch (error) {
              
               }
               } 
               return next(req);
               };