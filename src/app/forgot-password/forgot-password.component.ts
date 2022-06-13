import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PasswordService } from './password.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  emailForm: FormGroup;

  constructor(private passwordService: PasswordService, private router: Router) { }

  ngOnInit(): void {
    this.emailForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email])
    })
  }

  onSubmit() {
    const email = this.emailForm.get('email').value;
    this.passwordService.forgotPassword(email).subscribe(user => {
      this.router.navigate(['/resetPassword', 'reset', user.token._id])
    }, (err) => {
      alert('User with that email not found')
    })
    this.emailForm.reset()
  }

}
