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
  itemsPerPage: number;

  searchForm: FormGroup;

  subscription: Subscription;

  constructor(private userService: UsersService, private router: Router) {
    // this.router.events.subscribe(event => {
    //   if (event instanceof NavigationEnd) {
    //     this.userService.getUsers().subscribe(users => {
    //       this.users = users
    //     })
    //   }
    // })
  }

  ngOnInit(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users
    })

    this.searchForm = new FormGroup({
      'searchQuery': new FormControl(null),
      'itemsPerPage': new FormControl(5),
    })

    this.itemsPerPage = this.searchForm.get('itemsPerPage').value

  }

  itemsPerPageChanged() {
    const itemsPerPage = this.searchForm.get('itemsPerPage').value;
    this.itemsPerPage = itemsPerPage
    console.log(this.itemsPerPage)
  }

  searchUser() {
    let searchQuery = this.searchForm.get('searchQuery').value;
    if (!searchQuery) {
      alert('Please enter a value to search a user by');
      return;
    }

    let users = this.users.filter(user => user.state === searchQuery)

    if (users.length > 0) {
      this.filteredUsers = users;
      return;
    }

    users = this.users.filter(user => user.city === searchQuery)

    if (users.length > 0) {
      this.filteredUsers = users;
      return;
    }

    users = this.users.filter(user => user.pinCode === +searchQuery)

    if (users.length > 0) {
      this.filteredUsers = users;
      return;
    }

    users = this.users.filter(user => user.username.startsWith(searchQuery))

    if (users.length > 0) {
      this.filteredUsers = users;
      return
    }

    users = this.users.filter(user => user._id === searchQuery)

    if (users.length > 0) {
      this.filteredUsers = users;
      return;
    }

    users = this.users.filter(user => user.country === searchQuery)

    if (users.length > 0) {
      this.filteredUsers = users;
      return
    }

    alert('No user with that filter found')
  }

  onClear() {
    this.filteredUsers = null;
    this.searchForm.reset()
  }

}
