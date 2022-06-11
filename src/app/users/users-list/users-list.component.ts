import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { User } from '../User';
import { UserFormComponent } from '../user-form/user-form.component';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  @Input() users: User[];
  @Input() filteredUsers: User[];
  @Input() itemsPerPage: number;

  modalRef?: BsModalRef;

  pageNum: number;

  constructor(private userService: UsersService, private router: Router, private modalService: BsModalService) { }

  ngOnInit(): void {

  }

  deleteUser(user: User) {
    this.userService.deleteUser(user).subscribe();
    this.router.navigate(['/'])
  }

  edit(user: User) {
    // this.router.navigate([user._id, 'edit'], { relativeTo: this.route })
    this.modalRef = this.modalService.show(UserFormComponent, { class: 'modal-xl', id: user._id, initialState: { editMode: true, userId: user._id } },)

  }

  pageChanged(pageNum) {
    this.pageNum = pageNum;
  }

}
