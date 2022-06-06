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
  @Input() index: number;

  constructor(private router: Router, private route: ActivatedRoute, private userService: UsersService) { }

  ngOnInit(): void {
  }

  

  

}
