import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ConfirmService } from '../services/confirm.service';
import { MemberEdit } from '../Members/member-edit/member-edit';

@Injectable({
  providedIn: 'root'
})
export class PreventUnsavedChangesGuard implements CanDeactivate<MemberEdit> {
  constructor(private confirmService: ConfirmService) {}

  canDeactivate(component: MemberEdit): Observable<boolean> {
    if (component.editForm?.dirty) {
      return this.confirmService.confirm()
    }
    return of(true);
  }
  
}
