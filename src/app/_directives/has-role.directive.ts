import {
  Directive,
  inject,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import { AccountService } from '../services/account.service';
import { User } from '../models/user';

@Directive({
  selector: '[appHasRole]',
  standalone: true
})
export class HasRoleDirective implements OnInit {
  @Input() appHasRole: string[] = [];

  private accountService = inject(AccountService);
  private viewContainerRef = inject(ViewContainerRef);
  private templateRef = inject(TemplateRef<unknown>);

  private hasView = false;
  private user: User | null = null;

  ngOnInit(): void {
    this.accountService.currentUser$.subscribe(user => {
      this.user = user;
      this.updateView();
    });
  }

  private updateView(): void {
    const hasRole = this.user?.roles?.some(role =>
      this.appHasRole.includes(role)
    ) ?? false;

    if (hasRole && !this.hasView) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!hasRole && this.hasView) {
      this.viewContainerRef.clear();
      this.hasView = false;
    }
  }
}