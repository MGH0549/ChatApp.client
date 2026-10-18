import { Component, Input, OnInit } from '@angular/core';
import { Member } from '../../models/member';
import { User } from '../../models/user';
import { FileUploader, FileUploadModule } from 'ng2-file-upload';
import { environment } from '../../../environments/environment';
import { AccountService } from '../../services/account.service';
import { MembersService } from '../../services/members.service';
import { take } from 'rxjs';
import { Photo } from '../../models/photo';
import { CommonModule } from '@angular/common';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [CommonModule,ButtonsModule,FormsModule,FileUploadModule],
  selector: 'app-photo-eidtor',
  styleUrl: './photo-eidtor.css',
  templateUrl: './photo-eidtor.html',
})
export class PhotoEidtor implements OnInit {
  @Input() member: Member | undefined;
  uploader: FileUploader | undefined;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  user: User | undefined;
  constructor(private accountService: AccountService, private memberService: MembersService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) this.user = user
      }
    })
  }


  ngOnInit(): void {
    this.initializeUploader();
  }
  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/add-photo',
      authToken: 'Bearer ' + this.user?.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false
    }

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const photo = JSON.parse(response);
        this.member?.photos.push(photo);
        if (photo.isMain && this.user && this.member) {
          this.user.photourl = photo.url;
          this.member.photoUrl = photo.url;
          this.accountService.setCurrentUser(this.user);
        }
      }
    }
  }
  fileOverBase(e: any) {
    this.hasBaseDropZoneOver = e;
  }
  setMainPhoto(photo: Photo) {
    this.memberService.setMainPhoto(photo.id).subscribe({
      next: () => {
        if (this.user && this.member) {
          this.user.photourl = photo.url;
          this.accountService.setCurrentUser(this.user);
          this.member.photoUrl = photo.url;
          this.member.photos.forEach(p => {
            if (p.ismain) p.ismain = false;
            if (p.id === photo.id) p.ismain = true;
          })
        }
      }
    })
  }
  deletePhoto(photoId: number) {
    this.memberService.deletePhoto(photoId).subscribe({
      next: () => {
        if (this.member) {
          this.member.photos = this.member.photos.filter(x => x.id !== photoId);
        }
      }
    })
  }
}
