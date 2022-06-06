import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../User';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  @Input() users: User;

  constructor(private userService: UsersService, private router: Router, private route:ActivatedRoute) { }

  ngOnInit(): void {

  }

  deleteUser(user: User) {
    this.userService.deleteUser(user).subscribe();
    this.router.navigate(['/'])
  }

  edit(user: User) {
    this.router.navigate([user._id, 'edit'], { relativeTo: this.route })
  }

}
