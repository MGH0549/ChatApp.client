import { Component, OnInit } from '@angular/core';
import { Member } from '../models/member';
import { Pagination } from '../models/pagination';
import { MembersService } from '../services/members.service';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from 'ngx-bootstrap/pagination';
import { MembersCard } from '../Members/members-card/members-card';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [CommonModule, PaginationComponent, MembersCard,FormsModule],
  selector: 'app-list',
  styleUrl: './list.css',
  templateUrl: './list.html',
})
export class List implements OnInit {
  members: Member[] | undefined;
  predicate = 'liked';
  pageNumber = 1;
  pageSize = 5;
  pagination: Pagination | undefined;

  constructor(private memberService: MembersService) { }

  ngOnInit(): void {
    this.loadLikes();
  }

  loadLikes() {
    this.memberService.getLikes(this.predicate, this.pageNumber, this.pageSize).subscribe({
      next: response => {
        this.members = response.result;
        this.pagination = response.pagination;
      }
    })
  }

  pageChanged(event: any) {
    if (this.pageNumber !== event.page) {
      this.pageNumber = event.page;
      this.loadLikes();
    }
  }

}
