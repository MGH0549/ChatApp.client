import { Component, Input, OnInit } from '@angular/core';
import { Member } from '../../models/member';
import { MembersService } from '../../services/members.service';
import { ToastrService } from '@relynn/ngx-toastr';
import { PresenceService } from '../../services/presence.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

@Component({
  imports: [CommonModule,RouterLink,ButtonsModule],
  selector: 'app-members-card',
  styleUrl: './members-card.css',
  templateUrl: './members-card.html',
})
export class MembersCard implements OnInit {
  @Input() member: Member | undefined;

  constructor(private memberService: MembersService, private toastr: ToastrService, 
      public presenceService: PresenceService) { }

  ngOnInit(): void {
  }

  addLike(member: Member) {
    this.memberService.addLike(member.userName).subscribe({
      next: () => this.toastr.success('You have liked ' + member.knownas)
    })
  }
}
