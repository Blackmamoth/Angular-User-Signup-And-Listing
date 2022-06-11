import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  loginUrl: string = 'http://localhost:5000/api/users/login'

  loginUser(email, password): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(this.loginUrl, { email, password })
  }

}
