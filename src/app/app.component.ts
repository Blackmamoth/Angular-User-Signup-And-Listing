import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AuthService } from './auth/auth.service';
import { UserFormComponent } from './users/user-form/user-form.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  modalRef?: BsModalRef;

  constructor(private modelService: BsModalService, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.autoLogin();
    this.authService.autoLogout()
  }

  openRegisterModal() {
    this.modalRef = this.modelService.show(UserFormComponent, { class: 'modal-xl' })
  }

}
