import { Component, inject, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AdminService } from '../../services/admin';
import { RolesModals } from '../../Modals/roles-modals/roles-modals';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-user-managment',
  styleUrl: './user-managment.css',
  templateUrl: './user-managment.html',
})
export class UserManagment  implements OnInit {

  users: User[] = [];
  bsModalRef: BsModalRef<RolesModals> = new BsModalRef<RolesModals>();
  availableRoles = [
    'Admin',
    'Moderator',
    'Member'
  ]
  private adminService=inject(AdminService);
  private bsModalService=inject(BsModalService);
  ngOnInit(): void {
    this.getUsersWithRoles();
  }

  getUsersWithRoles() {
    this.adminService.getUsersWithRoles().subscribe({
      next: users => this.users = users
    })
  }
  openRolesModal(user: User) {
    const config = {
      class: 'modal-dialog-centered',
      initialState: {
        username: user.username,
        availableRoles: this.availableRoles,
        selectedRoles: [...user.roles]
      }
    }
    this.bsModalRef = this.bsModalService.show(RolesModals, config);
    this.bsModalRef.onHide?.subscribe({
      next: () => {
        const selectedRoles = this.bsModalRef.content?.selectedRoles;
        if (!this.arrayEqual(selectedRoles!, user.roles)) {
          this.adminService.updateUserRoles(user.username, selectedRoles!).subscribe({
            next: roles => user.roles = roles
          })
        }
      }
    })
  }

  private arrayEqual(arr1: any[], arr2: any[]) {
    return JSON.stringify(arr1.sort()) === JSON.stringify(arr2.sort());
  }

}
