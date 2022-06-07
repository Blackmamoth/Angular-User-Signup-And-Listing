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
  filteredUsers: User[];

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
    if (!searchQuery) {
      this.filteredUsers = null;
      return;
    }
    if (searchQuery.startsWith('629e')) {
      const user = this.users.find(user => {
        if (user._id === searchQuery) {
          return user;
        }
      })
      this.filteredUsers = [user]
      return;
    }


    if (searchQuery === "India" || searchQuery === "USA") {
      const users: User[] = this.users.filter(user => {
        if (searchQuery === "India") {
          return user.country === "India"
        } else {
          return user.country === "USA"
        }
      })
      this.filteredUsers = [...users]
      return;
    }

    if (searchQuery === "Mumbai" || searchQuery === "Delhi" || searchQuery === "Alaska" || searchQuery === "New York") {
      let users: User[];
      switch (searchQuery) {
        case "Mumbai":
          users = this.users.filter(user => user.state === "Mumbai")
          break;
        case "Delhi":
          users = this.users.filter(user => user.state === "Delhi")
          break;
        case "Alaska":
          users = this.users.filter(user => user.state === "Alaska")
          break;
        case "New York":
          users = this.users.filter(user => user.state === "New York")
          break;
        default:
          break;
      }
      this.filteredUsers = users;
      return
    }


    let usersList: User[] = []

    this.users.filter(user => {
      if (user.username.startsWith(searchQuery)) {
        usersList.push(user)
      }
      this.filteredUsers = [...usersList]
      return;
    })

  }

}
