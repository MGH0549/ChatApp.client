import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Messageservice } from '../../services/messageservice';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule,FormsModule],
  selector: 'app-member-messages',
  styleUrl: './member-messages.css',
  templateUrl: './member-messages.html',
})
export class MemberMessages implements OnInit {
  @ViewChild('messageForm') messageForm?: NgForm;
  @Input() userName?: string ;
  messageContent = '';
  loading = false;

    constructor(public messageService: Messageservice) { }
  
  
  ngOnInit(): void {}

  sendMessage() {
    if (!this.messageContent || !this.userName) return;
    this.loading = true;
    this.messageService.sendMessage(this.userName, this.messageContent).then(() => {
      this.messageForm?.reset();
      this.loading = false;
    }).catch(() => {
      this.loading = false;
    });
  }
}
