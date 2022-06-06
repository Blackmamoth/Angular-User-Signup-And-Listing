import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from './User';
import { UsersService } from './users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users: User[];

  searchForm: FormGroup;

  subscription: Subscription;

  constructor(private userService: UsersService, private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.userService.getUsers().subscribe(users => {
          this.users = users
        })
      }
    })
  }

  ngOnInit(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users
    })

    this.searchForm = new FormGroup({
      'searchQuery': new FormControl(null)
    })


  }

  searchUser() {
    let searchQuery = this.searchForm.get('searchQuery').value;
    if(searchQuery.startsWith('629e')) {
      this.users.find(user => {
        if(user._id === searchQuery){
          this.users = [user]
          return;
        }
      })
    }

    let usersList: User[] = []

    this.users.filter(user => {
      if(user.username.startsWith(searchQuery)){
        usersList.push(user)
      }
      this.users = [...usersList]
    })


  }

}
