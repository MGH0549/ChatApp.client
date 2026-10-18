import { Component, OnInit } from '@angular/core';
import { UserManagment } from '../user-managment/user-managment';
import { PhotoManagment } from '../photo-managment/photo-managment';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { HasRoleDirective } from '../../_directives/has-role.directive';

@Component({
  standalone: true,
  imports: [UserManagment, PhotoManagment,TabsModule,HasRoleDirective],
  selector: 'app-admin-panel',
  styleUrl: './admin-panel.css',
  templateUrl: './admin-panel.html',
})
export class AdminPanel implements OnInit {

  ngOnInit(): void {
  }
}
