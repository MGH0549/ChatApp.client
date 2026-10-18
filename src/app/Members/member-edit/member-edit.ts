import { Component, Host, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { User } from '../../models/user';
import { Member } from '../../models/member';
import { AccountService } from '../../services/account.service';
import { MembersService } from '../../services/members.service';
import { ToastrService } from '@relynn/ngx-toastr';
import { take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PhotoEidtor } from '../photo-eidtor/photo-eidtor';
import { TabsModule } from 'ngx-bootstrap/tabs';

@Component({
  imports: [CommonModule,FormsModule,PhotoEidtor,TabsModule],
  selector: 'app-member-edit',
  styleUrl: './member-edit.css',
  templateUrl: './member-edit.html',
})
export class MemberEdit implements OnInit{
  @ViewChild("editForm") editForm: NgForm | undefined;
  @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
    if (this.editForm?.dirty) {
      $event.returnValue = true;
    }
  }
  member: Member | undefined;
  user: User | null = null;

  constructor(private accountService: AccountService, private memberService: MembersService, 
      private toastr: ToastrService) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => this.user = user
    })
  }
  loadMember() {
    if (!this.user) return;
    this.memberService.getMember(this.user.username).subscribe({
      next: member => this.member = member
    })
  }
  
  ngOnInit(): void {
    this.loadMember();
  }
  updateMember() {
    this.memberService.updateMember(this.editForm?.value).subscribe({
      next: () => {
        this.toastr.success('Profile updated successfully');
        this.editForm?.reset(this.member);
      }
    })
  }
}
