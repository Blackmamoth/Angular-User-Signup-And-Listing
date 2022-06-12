import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import { User } from './user.model';


interface ResponseData {
  token: string,
  success: false
}

interface UserData {
  token: string,
  _id: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  token = new BehaviorSubject<UserData>(null);

  constructor(private http: HttpClient, private router: Router) { }

  loginUrl: string = 'http://localhost:5000/api/users/login'

  loginUser(email, password): Observable<ResponseData> {
    return this.http.post<ResponseData>(this.loginUrl, { email, password }).pipe(tap(resData => {
      this.handleAuth(resData)
    }))
  }

  logoutUser() {
    this.token.next(null);
    this.router.navigate(['/login'])
    localStorage.removeItem('userData')
  }

  autoLogout() {
    let userData: any = JSON.parse(localStorage.getItem('userData'))
    if (!userData) {
      return;
    }
    let payload: any = JSON.parse(atob(userData.token.split('.')[1]))
    const exp = new Date(payload.exp * 1000)
    const now = new Date();
    if (now >= exp) {
      this.logoutUser()
    }
  }

  autoLogin() {
    let userData: any = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }
    this.handleAuth(userData)
  }

  private handleAuth(userData) {
    this.token.next(userData)
    localStorage.setItem('userData', JSON.stringify(userData));
  }

}
