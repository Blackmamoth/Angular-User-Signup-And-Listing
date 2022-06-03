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
      'id': new FormControl(null),
      'username': new FormControl(null)
    })


  }

  searchUser() {
    let id: string = this.searchForm.get('id').value
    let searchedUsername: string = this.searchForm.get('username').value;
    let searchedUsers: User[] = [];
    if (this.searchForm.get('id').value) {
      this.userService.getUser(id).subscribe(
        user => this.users = [user]
      )
    } else if (this.searchForm.get('username').value) {
      this.userService.getUsers().subscribe(
        users => {
          users.forEach(user => {
            if (user.username.startsWith(searchedUsername)) {
              searchedUsers.push(user)
            }
          })
        }
      )
      this.users = searchedUsers
    }

  }

}
