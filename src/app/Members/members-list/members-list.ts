import { Component, inject, OnInit } from '@angular/core';
import { Member } from '../../models/member';
import { Pagination } from '../../models/pagination';
import { UserParam } from '../../models/userparam';
import { MembersService } from '../../services/members.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { MembersCard } from '../members-card/members-card';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

@Component({
  imports: [CommonModule, FormsModule, PaginationModule, MembersCard,ButtonsModule],
  selector: 'app-members-list',
  styleUrl: './members-list.css',
  templateUrl: './members-list.html',
})
export class MembersList implements OnInit {
  members :Member[] = [];
  pagination: Pagination | undefined;
  userParams: UserParam|undefined;  
  genderList = [{value:'male', display:'Males'}, {value:'female', display:'Females'}];

  private memberService=inject(MembersService);
   constructor() {
    this.userParams = this.memberService.getUserParams();
  }

  ngOnInit(): void {
    this.loadMembers();
  }
  loadMembers() {
    if(this.userParams){
      this.memberService.setUserParams(this.userParams);
      this.memberService.getMembers(this.userParams).subscribe({
        next: response => {
          if (response.result && response.pagination) {
            this.members = response.result;
            this.pagination = response.pagination;
          }
        }
      })
    }
  }

  resetFilters() {
    this.userParams = this.memberService.resetUserParams();
    this.loadMembers();
  }
  pageChanged(event: any) {
    if(this.userParams && this.userParams.pageNumber !== event.page){
      this.userParams.pageNumber = event.page;
      this.memberService.setUserParams(this.userParams);
      this.loadMembers();
    }
  }

}
