import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  signInForm: FormGroup;
  errorMessage: string;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.signInForm = new FormGroup({
      'email': new FormControl(null, Validators.required),
      'password': new FormControl(null, [Validators.required, Validators.minLength(6)])
    })
  }

  onSubmit() {
    const email = this.signInForm.get('email').value;
    const pass = this.signInForm.get('password').value
    this.authService.loginUser(email, pass).subscribe(response => {
      this.router.navigate(['/'])
    }, (err) => {
      this.errorMessage = err.error.message
      setTimeout(() => {
        this.errorMessage = null
      }, 5000)
      console.log(err)
    })
    this.signInForm.reset()
  }

  toSignUp() {
    this.router.navigate(['/register']);
  }


}
