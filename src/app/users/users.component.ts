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

  countries: string[] = ['Country'];

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
      this.userService.getCountries().subscribe(countries => {
        countries.forEach(country => {
          this.countries.push(country.name)
        })
      })
    })

    this.searchForm = new FormGroup({
      'id': new FormControl(null),
      'username': new FormControl(null),
      'country': new FormControl('Country'),
      'pinCode': new FormControl(null),
      'role': new FormControl('Role'),
      'category': new FormControl(null),
      'itemsPerPage': new FormControl(5),
    })

    this.itemsPerPage = this.searchForm.get('itemsPerPage').value

  }

  itemsPerPageChanged() {
    const itemsPerPage = this.searchForm.get('itemsPerPage').value;
    this.itemsPerPage = itemsPerPage
  }

  searchUser() {
    const id = this.searchForm.get('id').value
    const username = this.searchForm.get('username').value
    const country = this.searchForm.get('country').value
    const pinCode = this.searchForm.get('pinCode').value
    const role = this.searchForm.get('role').value

    if (!id && !username && country === 'Country' && !pinCode && role === 'Role') {
      this.filteredUsers = null;
      return;
    }

    let usersList = this.users.filter(user => user._id === id)

    if (usersList.length > 0) {
      this.filteredUsers = usersList;
      return;
    }

    if (username) {
      this.users.forEach(user => {
        if (user.username.startsWith(username)) {
          usersList.push(user)
        }
      })
    }

    if (country) {
      this.users.forEach(user => {
        if (user.country === country) {
          usersList.push(user);
        }
      })
    }

    if (pinCode) {
      this.users.forEach(user => {
        if (user.pinCode === pinCode) {
          usersList.push(user)
        }
      })
    }

    if (role) {
      this.users.forEach(user => {
        if (user.roles === role) {
          usersList.push(user)
        }
      })
    }

    let usersSet: any = new Set(usersList);

    this.filteredUsers = [];
    usersSet.forEach(user => {
      this.filteredUsers.push(user)
    })

  }

  onClear() {
    this.filteredUsers = null;
    this.searchForm.reset()
  }

}
