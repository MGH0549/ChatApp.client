import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AdminService } from '../../services/admin';


@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-roles-modals',
  styleUrl: './roles-modals.css',
  templateUrl: './roles-modals.html',
})
export class RolesModals implements OnInit {
   username = '';
  availableRoles: any[] = [];
  selectedRoles: any[] = [];
  private adminservice = inject(AdminService);
  public bsModalRef=inject(BsModalRef);
  
ngOnInit(): void {  }


updateChecked(checkedValue: string) {
    const index = this.selectedRoles.indexOf(checkedValue);
    index !== -1 ? this.selectedRoles.splice(index, 1) : this.selectedRoles.push(checkedValue);
  }
}
