import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CanActivate } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AccountService } from '../services/account.service';
import { ToastrService } from '@relynn/ngx-toastr';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private accountService: AccountService, private toastr: ToastrService) {}
    private platformId = inject(PLATFORM_ID);

  canActivate(): Observable<boolean> {
    return this.accountService.currentUser$.pipe(
      map(user => {
        if (user) return true;
        else {
          if (!isPlatformBrowser(this.platformId)) {
            return false;
          }
          this.toastr.error('You shall not pass!');
          return false
        }
      })
    )
  }
  
}
