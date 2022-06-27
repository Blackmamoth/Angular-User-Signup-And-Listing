import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AuthService } from 'src/app/auth/auth.service';
import { FileUploadServices } from '../file-upload.service';
import { User } from '../User';
import { UserFormComponent } from '../user-form/user-form.component';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  @Input() users: User[];
  @Input() filteredUsers: User[];
  @Input() itemsPerPage: number;

  admin: boolean = false;

  user: User = { username: '', email: '', phone: 0, pinCode: 0, country: '', state: '', city: '', password: '', dob: new Date('01-01-01') };
  userProfilePic: string;


  modalRef?: BsModalRef;

  pageNum: number;

  showUpdateProfile: boolean = false;
  showMedicinesBtn: boolean = false;

  constructor(private userService: UsersService, private router: Router, private authService: AuthService, private route: ActivatedRoute,
    private mediaService: FileUploadServices, private modelService: BsModalService) { }

  ngOnInit(): void {
    this.authService.token.subscribe(data => {
      const id = data._id;
      this.userService.getUser(id).subscribe(user => {
        this.user = user
        if (user.admin) {
          this.admin = true
        }
        if (user.roles === 'add') {
          this.showUpdateProfile = true;
        }
        if (user.roles === 'view') {
          this.showMedicinesBtn = true
        }
      })
    })

    const id = JSON.parse(localStorage.getItem('userData'))._id;
    this.mediaService.getImage(id).subscribe(image => {
      if (!image) {
        this.userProfilePic = `/uploads/images/default.jpg`
        return;
      }
      let imageName = image.name;
      this.userProfilePic = `/uploads/images/${imageName}`
    })

  }

  deleteUser(user: User) {
    const proceed = confirm("Are you sure you want to delete this user?")
    if (proceed) {
      this.userService.deleteUser(user).subscribe();
      this.router.navigate(['/'])
    } else {
      return;
    }
  }

  edit(user: User) {
    // if (!this.admin) {
    this.router.navigate(['edit', user._id], { relativeTo: this.route })
    // return;
    // }
  }

  showMedicines() {

    this.router.navigate(['medicines'], { relativeTo: this.route })
  }

  pageChanged(pageNum) {
    this.pageNum = pageNum;
  }

  showImage() {
    this.router.navigate(['media'], { relativeTo: this.route })
  }
}
