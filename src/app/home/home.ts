import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Register } from '../register/register';

@Component({
  imports: [CommonModule, Register],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home implements OnInit {
  registerMode = false;

  registerToggle() {
    this.registerMode = !this.registerMode;
  }

  cancelRegisterMode(event: boolean) {
    this.registerMode = event;
  }
  ngOnInit(): void {
  }

}
