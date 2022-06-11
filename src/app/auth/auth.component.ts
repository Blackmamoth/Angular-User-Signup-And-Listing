import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  signInForm: FormGroup;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.signInForm = new FormGroup({
      'email': new FormControl(null, Validators.required),
      'password': new FormControl(null, Validators.required)
    })
  }

  onSubmit() {
    const email = this.signInForm.get('email').value;
    const pass = this.signInForm.get('password').value
    this.authService.loginUser(email, pass).subscribe(response => {
      localStorage.setItem('token', response.token)
    })
  }

}
