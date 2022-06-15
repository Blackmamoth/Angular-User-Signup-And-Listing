import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from '../User';
import { UserFormComponent } from '../user-form/user-form.component';
import { UserMedicinesComponent } from '../user-medicines/user-medicines.component';
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

  modalRef?: BsModalRef;

  pageNum: number;

  constructor(private userService: UsersService, private router: Router, private modalService: BsModalService, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.token.subscribe(data => {
      const id = data._id;
      this.userService.getUser(id).subscribe(user => {
        this.user = user
        if (user.admin) {
          this.admin = true
        }
      })
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
    // this.router.navigate([user._id, 'edit'], { relativeTo: this.route })
    this.modalRef = this.modalService.show(UserFormComponent, { class: 'modal-xl', id: user._id, initialState: { editMode: true, userId: user._id } },)
  }

  showMedicines() {
    this.modalRef = this.modalService.show(UserMedicinesComponent, { class: 'modal-lg', id: this.user._id, initialState: { medicines: this.user.medicines } })
  }

  pageChanged(pageNum) {
    this.pageNum = pageNum;
  }

}
