import { Component, OnInit } from '@angular/core';
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

  constructor(public modalRef: BsModalRef) { }

  ngOnInit(): void {

  }

}
