import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Form, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AuthService } from 'src/app/auth/auth.service';
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

  countries: string[] = ['Select Country'];
  states: string[] = ['Select State'];
  cities: string[] = ['Select City'];

  editMode: boolean = false;
  user: User;
  userId: string;

  medicines: FormArray = new FormArray([]);

  roles: string[] = ["none", "view", "add",]

  adminMode: boolean = false;

  showUpdateProfile: boolean = false;

  constructor(private userService: UsersService, private router: Router, public modalRef: BsModalRef, private modalService: BsModalService, private route: ActivatedRoute, private authService: AuthService) { }

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
            const date = new Date(this.user.dob);
            const dob = date.toISOString().split('T')[0]
            this.userForm.patchValue({
              'username': this.user.username,
              'phone': this.user.phone,
              'email': this.user.email,
              'dob': dob,
              'country': this.user.country,
              'state': this.user.state,
              'city': this.user.city,
              'pinCode': this.user.pinCode,
              'role': this.user.roles
            })
            if (this.user.medicines) {
              user.medicines.forEach((medicine) => {
                this.medicines.push(
                  new FormControl(medicine)
                )
              })
            }
            const userData = JSON.parse(localStorage.getItem('userData'))
            this.userService.getUser(userData._id).subscribe(user => {
              if (user.admin) {
                this.adminMode = true
              }
            })
            this.countryChanged()
            this.stateChanged()
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



    // this.userService.getCities('').subscribe(cities => {
    //   cities.forEach(city => {
    //     this.pushToArrayIfNotItemExists(this.countries, city.country_name)
    //   })
    // })
    this.userService.getCountries().subscribe(countries => {
      countries.forEach(country => {
        this.pushToArrayIfNotItemExists(this.countries, country.name)
      })
    })

    this.userForm = new FormGroup({
      'username': new FormControl(null, [Validators.required, this.usernameTaken.bind(this)]),
      'email': new FormControl(null, [Validators.required, Validators.email, this.emailTaken.bind(this)]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(6)]),
      'phone': new FormControl(null, [Validators.required, this.phoneTaken.bind(this), this.tenDigitRequired.bind(this)]),
      'dob': new FormControl(null, Validators.required),
      'country': new FormControl('Select Country', [Validators.required, this.countryValidator.bind(this)]),
      'state': new FormControl('Select State', [Validators.required, this.stateValidator.bind(this)]),
      'city': new FormControl('Select City', [Validators.required, this.cityValidator.bind(this)]),
      'pinCode': new FormControl(null, [Validators.required, this.sixDigitRequired.bind(this)]),
      'medicines': this.medicines,
      'role': new FormControl('none'),
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

  countryValidator(control: FormControl): { [s: string]: boolean } {
    if (control.value === 'Select Country') { return { 'selectionError': true } }
    return null;
  }

  stateValidator(control: FormControl): { [s: string]: boolean } {
    if (control.value === 'Select State') { return { 'selectionError': true } }
    return null;
  }

  cityValidator(control: FormControl): { [s: string]: boolean } {
    if (control.value === 'Select City') { return { 'selectionError': true } }
    return null;
  }

  onSubmit() {
    const user: User = { username: this.userForm.get('username').value, phone: this.userForm.get('phone').value, email: this.userForm.get('email').value, dob: new Date(this.userForm.get('dob').value), country: this.userForm.get('country').value, state: this.userForm.get('state').value, city: this.userForm.get('city').value, pinCode: this.userForm.get('pinCode').value, roles: this.userForm.get('role').value || 'read', password: this.userForm.get('password').value || this.user.password, medicines: this.userForm.get('medicines').value };
    if (this.editMode) {
      const proceed = confirm('Are you sure you want to update this information?')
      if (proceed) {
        this.userService.updateUser(this.user, user).subscribe();
        this.router.navigate(['/'])
      }
    } else {
      this.userService.addUser(user).subscribe(userData => {
        localStorage.setItem('userData', JSON.stringify({ success: userData.success, token: userData.token, _id: userData._id }))
        this.authService.autoLogin()
        this.router.navigate(['/users'])
      });
    }
  }

  onAddMedicine() {
    const control = new FormControl(null, Validators.required);
    (<FormArray>this.userForm.get('medicines')).push(control)
  }

  getMedicineControls() {
    return (<FormArray>this.userForm.get('medicines')).controls;
  }

  onCancel() {
    if (this.userForm.touched) {
      const proceed = confirm('Are you sure you want to discard these changes?')
      if (!proceed) {
        return
      }
    }
    this.router.navigate(['/'])
  }

  openModal() {
    this.modalRef2 = this.modalService.show(UserMedicinesComponent, { class: 'modal-lg', initialState: { medicines: this.user.medicines } })
  }

  countryChanged() {
    const country = this.userForm.get('country').value
    this.states = ['Select State'];
    this.userService.getStates(country).subscribe(states => {
      states.forEach(state => {
        this.states.push(state.name)
      })
    })
  }

  stateChanged() {
    const state = this.userForm.get('state').value;
    this.cities = ['Select City'];
    this.userService.getCities(state).subscribe(citiesArr => {
      citiesArr.forEach(city => {
        this.cities.push(city.name)
      })
    })
  }


  pushToArrayIfNotItemExists(arr: string[], item: string) {
    if (!arr.includes(item)) {
      arr.push(item);
      return;
    }
  }

}
