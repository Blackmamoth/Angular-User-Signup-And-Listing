import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PasswordService } from '../password.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {

  err: string = null;

  constructor(private route: ActivatedRoute, private passwordService: PasswordService, private router: Router) { }

  subcription: Subscription;
  tokenID: string;

  passwordResetForm: FormGroup;

  ngOnInit(): void {

    this.passwordResetForm = new FormGroup({
      'password': new FormControl(null, [Validators.required, Validators.minLength(6)]),
      'password2': new FormControl(null, [Validators.required, Validators.minLength(6)])
    })

    this.subcription = this.route.params.subscribe(
      (params: Params) => {
        this.tokenID = params['tokenID']
      }
    )
  }

  onSubmit() {
    const pass1 = this.passwordResetForm.get('password').value;
    const pass2 = this.passwordResetForm.get('password2').value;

    if (pass1 !== pass2) {
      alert("Passwords don't match");
      return;
    }
    this.passwordService.resetPassword(pass1, this.tokenID).subscribe(success => {
      this.router.navigate(['/'])
    }, err => {
      this.err = "Token expired or invalid";
    })
  }


  ngOnDestroy(): void {
    this.subcription.unsubscribe()
  }

}
