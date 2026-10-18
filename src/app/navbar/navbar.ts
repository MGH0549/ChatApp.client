import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { AccountService } from '../services/account.service';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { ToastrService } from '@relynn/ngx-toastr';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { HasRoleDirective } from '../_directives/has-role.directive';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, RouterLinkActive, FormsModule,HasRoleDirective,BsDropdownModule],
  selector: 'app-navbar',
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
})
export class Navbar implements OnInit{
  model: any = {};
  private toaster=inject(ToastrService);
  public accountService:AccountService=inject(AccountService);
  router:Router=inject(Router);

  logout(){
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
  login(){
    this.accountService.login(this.model).subscribe({
      next:res=>{
        this.router.navigateByUrl('/');
      }
    })
  }
  ngOnInit(): void {
  }
}
