import { Component, inject,OnInit } from '@angular/core';
import { Messageservice } from '../services/messageservice';
import { Message } from '../models/message';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { Pagination } from '../models/pagination';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, PaginationModule,ButtonsModule],
  selector: 'app-messages', 
  styleUrl: './messages.css',
  templateUrl: './messages.html',
})
export class Messages implements OnInit {
  messageservice: Messageservice = inject(Messageservice);

  messages?: Message[];
  pagination?:Pagination;
  container='Unread';
  pageNumber=1;
  pageSize=5;
  loading=false;

  ngOnInit() {
    this.loadMessages();
  }
  
  loadMessages() {
    this.loading=true;
    this.messageservice.getMessages(this.pageNumber, this.pageSize, this.container).subscribe({
      next:response => {
        this.messages = response.result;
        this.pagination = response.pagination;
        this.loading=false;
      }
    });
  }
  deleteMessage(id: number) {
    this.messageservice.deleteMessage(id).subscribe({
      next: () => {
        if (this.messages) {
          this.messages = this.messages.filter(m => m.id !== id);
        }
      }
    });
  }
  pageChanged(event: any) {
    if (this.pageNumber !== event.page) {
      this.pageNumber = event.page;
      this.loadMessages();
    }
  }
}
