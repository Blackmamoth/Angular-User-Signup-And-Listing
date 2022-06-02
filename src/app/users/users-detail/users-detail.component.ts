import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../User';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-users-detail',
  templateUrl: './users-detail.component.html',
  styleUrls: ['./users-detail.component.css']
})
export class UsersDetailComponent implements OnInit {

  @Input() user: User;

  constructor(private router: Router, private route: ActivatedRoute, private userService: UsersService) { }

  ngOnInit(): void {
  }

  edit() {
    this.router.navigate([this.user.id, 'edit'], { relativeTo: this.route })
  }

  deleteUser() {
    this.userService.deleteUser(this.user).subscribe();
    this.router.navigate(['/'])
  }

}
