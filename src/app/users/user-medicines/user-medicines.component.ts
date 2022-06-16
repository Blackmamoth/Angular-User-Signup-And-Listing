import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { User } from '../User';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-user-medicines',
  templateUrl: './user-medicines.component.html',
  styleUrls: ['./user-medicines.component.css']
})
export class UserMedicinesComponent implements OnInit {

  // user: User;

  medicines: string[]

  _id: string;

  constructor(private userService: UsersService, private router: Router) { }

  ngOnInit(): void {
    const userData = JSON.parse(localStorage.getItem('userData'));
    this._id = userData._id
    this.userService.getUser(this._id).subscribe(user => {
      this.medicines = user.medicines
    })
  }

  onClose() {
    this.router.navigate([''])
  }

}
