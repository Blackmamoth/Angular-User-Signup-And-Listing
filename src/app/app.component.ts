import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { UserFormComponent } from './users/user-form/user-form.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  modalRef?: BsModalRef;

  constructor(private modelService: BsModalService) { }


  openRegisterModal() {
    this.modalRef = this.modelService.show(UserFormComponent, { class: 'modal-xl' })
  }

}
