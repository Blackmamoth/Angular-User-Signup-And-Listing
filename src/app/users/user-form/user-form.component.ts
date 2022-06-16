import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Form, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { User } from '../User';
import { UserMedicinesComponent } from '../user-medicines/user-medicines.component';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {


  @Output() userAdd = new EventEmitter<User>()

  userForm: FormGroup;

  modalRef2: BsModalRef | null;

  usernames: string[] = [];
  emails: string[] = [];
  phones: number[] = [];

  countries: string[] = [];
  states: string[] = [];
  cities: string[] = [];

  editMode: boolean = false;
  user: User;
  userId: string;

  medicines: FormArray = new FormArray([]);

  writePrivilege: boolean = false;

  adminMode: boolean = false;

  privileges: string[] = ['read', 'readwrite', 'admin']


  constructor(private userService: UsersService, private router: Router, public modalRef: BsModalRef, private modalService: BsModalService, private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.params.subscribe(
      (params: Params) => {
        if (params['id']) {
          this.editMode = true
          this.userId = params['id']
        }
        if (this.editMode) {
          this.userService.getUser(this.userId).subscribe(user => {
            this.user = user;
            console.log(this.user.privilege)
            this.userForm.patchValue({
              'username': this.user.username,
              'phone': this.user.phone,
              'email': this.user.email,
              'dob': this.user.dob,
              'country': this.user.country,
              'state': this.user.state,
              'city': this.user.city,
              'pinCode': this.user.pinCode,
              'privilege': this.user.privilege
            })
            if (this.user.medicines) {
              user.medicines.forEach((medicine) => {
                this.medicines.push(
                  new FormControl(medicine)
                )
              })
            }
            const userData = JSON.parse(localStorage.getItem('userData'))
            const adminUser = this.userService.getUser(userData._id).subscribe(user => {
              if (user.admin) {
                this.adminMode = true
              }
            })
            this.cities = [user.city]
            this.writePrivilege = this.user.privilege === 'read' ? false : true;
          })
        }
      }

    )



    this.userService.getUsers().subscribe(users => {
      users.forEach(user => {
        this.usernames.push(user.username);
        this.emails.push(user.email);
        this.phones.push(user.phone);
      })
    })

    this.userService.getCities().subscribe(cities => {
      cities.forEach(city => {
        this.pushToArrayIfNotItemExists(this.countries, city.country_name)
        this.pushToArrayIfNotItemExists(this.states, city.state_name)
      })
    })

    this.userForm = new FormGroup({
      'username': new FormControl(null, [Validators.required, this.usernameTaken.bind(this)]),
      'email': new FormControl(null, [Validators.required, Validators.email, this.emailTaken.bind(this)]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(6)]),
      'phone': new FormControl(null, [Validators.required, this.phoneTaken.bind(this), this.tenDigitRequired.bind(this)]),
      'dob': new FormControl(null, Validators.required),
      'country': new FormControl(null, Validators.required),
      'state': new FormControl(null, Validators.required),
      'city': new FormControl(null, Validators.required),
      'pinCode': new FormControl(null, [Validators.required, this.sixDigitRequired.bind(this)]),
      'medicines': this.medicines,
      'privilege': new FormControl(null),
    })

  }

  usernameTaken(control: FormControl): { [s: string]: boolean } {
    if (this.usernames.indexOf(control.value) !== -1) {
      return { 'usernameIsTaken': true }
    }
    return null;
  }

  emailTaken(control: FormControl): { [s: string]: boolean } {
    if (this.emails.indexOf(control.value) !== -1) {
      return { 'emailIsTaken': true }
    }
    return null;
  }

  phoneTaken(control: FormControl): { [s: string]: boolean } {
    if (this.phones.indexOf(control.value) !== -1) {
      return { 'phoneIsTaken': true }
    }
    return null;
  }

  tenDigitRequired(control: FormControl): { [s: string]: boolean } {
    const numberValue = String(control.value);
    if (numberValue.length !== 10) {
      return { 'tenDigitRequired': true }
    }
    return null;
  }

  sixDigitRequired(control: FormControl): { [s: string]: boolean } {
    const numberValue = String(control.value);
    if (numberValue.length !== 6) {
      return { 'sixDigitRequired': true }
    }
    return null;
  }

  onSubmit() {
    const user: User = { username: this.userForm.get('username').value, phone: this.userForm.get('phone').value, email: this.userForm.get('email').value, dob: new Date(this.userForm.get('dob').value), country: this.userForm.get('country').value, state: this.userForm.get('state').value, city: this.userForm.get('city').value, pinCode: this.userForm.get('pinCode').value, privilege: this.userForm.get('privilege').value || this.user.privilege, password: this.userForm.get('password').value || this.user.password, medicines: this.userForm.get('medicines').value };
    if (this.editMode) {
      const proceed = confirm('Are you sure you want to update this information?')
      if (proceed) {
        this.userService.updateUser(this.user, user).subscribe();
      }
    } else {
      this.userService.addUser(user).subscribe();
    }
    this.router.navigate(['/'])
    this.modalRef.hide()
  }

  onAddMedicine() {
    const control = new FormControl(null, Validators.required);
    (<FormArray>this.userForm.get('medicines')).push(control)
  }

  getMedicineControls() {
    return (<FormArray>this.userForm.get('medicines')).controls;
  }

  onCancel() {
    this.router.navigate(['/'])
  }

  openModal() {
    this.modalRef2 = this.modalService.show(UserMedicinesComponent, { class: 'modal-lg', initialState: { medicines: this.user.medicines } })
  }

  countryChanged() {
    const country = this.userForm.get('country').value
    this.cities = [];
    this.states = [];
    this.userService.getStates().subscribe(states => {
      states.forEach(state => {
        if (state.country_name === country) {
          this.states.push(state.name)
        }
      })
    })
    this.userService.getCities().subscribe(cities => {
      cities.forEach(city => {
        if (city.country_name === country) {
          this.cities.push(city.name)
        }
      })
    })
  }

  stateChanged() {
    const state = this.userForm.get('state').value;
    this.cities = [];
    this.userService.getCities().subscribe(cities => {
      cities.forEach(city => {
        if (city.state_name === state) {
          this.cities.push(city.name)
        }
      })
    })
    console.log('called')
  }


  pushToArrayIfNotItemExists(arr: string[], item: string) {
    if (!arr.includes(item)) {
      arr.push(item);
      return;
    }
  }

}
