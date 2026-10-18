
import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';

import { User } from '../../models/user';
import { Message } from '../../models/message';
import { Member } from '../../models/member';
import { AccountService } from '../../services/account.service';
import { PresenceService } from '../../services/presence.service';
import { Messageservice } from '../../services/messageservice';
import { MemberMessages } from '../member-messages/member-messages';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TabsetComponent,
    TabDirective,
    MemberMessages
  ],
  selector: 'app-member-datail',
  styleUrl: './member-datail.css',
  templateUrl: './member-datail.html',
})
export class MemberDatail {
  @ViewChild('memberTabs', { static: true })
  memberTabs?: TabsetComponent;

  member: Member = {} as Member;
  activeTab?: TabDirective;
  messages: Message[] = [];
  user?: User;

  selectedPhotoIndex = 0;

  // Images for the native Angular gallery
  get galleryImages(): string[] {
    return this.member?.photos?.map(photo => photo.url) ?? [];
  }

  get selectedPhotoUrl(): string | null {
    return this.galleryImages[this.selectedPhotoIndex] ?? null;
  }

  constructor(
    private accountService: AccountService,
    private route: ActivatedRoute,
    private messageService: Messageservice,
    public presenceService: PresenceService,
    private router: Router
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) this.user = user;
      }
    });

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.route.data.subscribe({
      next: data => {
        this.member = data['member'];
        this.selectedPhotoIndex = 0;
      }
    });

    this.route.queryParams.subscribe({
      next: params => {
        if (params['tab']) {
          this.selectTab(params['tab']);
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }

  selectPhoto(index: number): void {
    this.selectedPhotoIndex = index;
  }

  selectTab(heading: string): void {
    const tab = this.memberTabs?.tabs.find(
      x => x.heading() === heading
    );

    if (tab) {
      tab.active = true;
    }
  }

  loadMessages(): void {
    if (this.member?.userName) {
      this.messageService
        .getMessageThread(this.member.userName)
        .subscribe({
          next: messages => this.messages = messages
        });
    }
  }

  onTabActivated(data: TabDirective): void {
    this.activeTab = data;

    if (this.activeTab.heading() === 'Messages' && this.user) {
      this.messageService.createHubConnection(
        this.user,
        this.member.userName
      );
    } else {
      this.messageService.stopHubConnection();
    }
  }
}
