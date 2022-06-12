import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private tokenSub: Subscription;

  isAuthenticated: boolean = false;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.tokenSub = this.authService.token.subscribe(data => {
      if (data) {
        this.isAuthenticated = true
      } else {
        this.isAuthenticated = false
      }
    })
  }

  logoutUser() {
    console.log('clicked')
    this.authService.logoutUser()
  }

  ngOnDestroy(): void {
    // this.tokenSub.unsubscribe()
  }

}
