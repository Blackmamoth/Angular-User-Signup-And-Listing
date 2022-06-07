import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { User } from '../User';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {


  @Output() userAdd = new EventEmitter<User>()

  userForm: FormGroup;

  usernames: string[] = [];
  emails: string[] = [];
  phones: number[] = [];

  countries: string[] = [];
  states: string[] = [];
  cities: string[] = [];

  editMode: boolean = false;

  user: User;

  userId: string;

  constructor(private userService: UsersService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.params.subscribe(
      (params: Params) => {
        if (params['id']) {
          this.editMode = true
          this.userId = params['id']
          this.userService.getUser(this.userId).subscribe(user => {
            this.user = user;
            const date = new Date(this.user.dob);
            const dob = `${date.getFullYear()}-0${date.getMonth() + 1}-${date.getDate()}`
            this.userForm.patchValue({
              'username': this.user.username,
              'phone': this.user.phone,
              'email': this.user.email,
              'dob': dob,
              'country': this.user.country,
              'state': this.user.state,
              'pinCode': this.user.pinCode
            })
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

    this.userService.getCountries().subscribe(countries => {
      countries.forEach(country => {
        this.countries.push(country.name)
      })
    })

    this.userForm = new FormGroup({
      'username': new FormControl(null, [Validators.required, this.usernameTaken.bind(this)]),
      'email': new FormControl(null, [Validators.required, Validators.email, this.emailTaken.bind(this)]),
      'phone': new FormControl(null, [Validators.required, this.phoneTaken.bind(this), this.tenDigitRequired.bind(this)]),
      'dob': new FormControl(null, Validators.required),
      'country': new FormControl(null, Validators.required),
      'state': new FormControl(null, Validators.required),
      'pinCode': new FormControl(null),
      'city': new FormControl(null, Validators.required)
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

  onSubmit() {
    const user: User = { username: this.userForm.get('username').value, phone: this.userForm.get('phone').value, email: this.userForm.get('email').value, dob: new Date(this.userForm.get('dob').value), country: this.userForm.get('country').value, state: this.userForm.get('state').value, pinCode: +this.userForm.get('pinCode').value, city: this.userForm.get('city').value };
    if (this.editMode) {
      this.userService.updateUser(this.user, user).subscribe()
    } else {
      this.userService.addUser(user).subscribe();
    }
    this.router.navigate(['/'])
  }

  onCancel() {
    this.router.navigate(['/'])
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
  }

}
