import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { exhaustMap, Observable, take } from 'rxjs';
import { User } from './User';
import { AuthService } from '../auth/auth.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
}


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient, private authService: AuthService) { }


  baseUrl: string = '/api/users';
  addressUrl: string = '/api/address';

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl, httpOptions);
  }

  getUser(id: string): Observable<User> {
    return this.authService.token.pipe(take(1), exhaustMap(data => {
      if (data?.token) {
        return this.http.get<User>(`${this.baseUrl}/${id}`);
      } else {
        return this.http.get<User>(`${this.baseUrl}/${id}`);
      }
    }))
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.baseUrl, user);
  }

  updateUser(user: User, newUser: User): Observable<User> {
    const url = `${this.baseUrl}/${user._id}`
    return this.http.patch<User>(url, newUser);
  }

  deleteUser(user: User): Observable<User> {
    return this.http.delete<User>(`${this.baseUrl}/${user._id}`);
  }

  getCountries(): Observable<any[]> {
    return this.http.get<any[]>(`${this.addressUrl}/countries`);
  }

  getStates(country): Observable<any[]> {
    return this.http.get<any[]>(`${this.addressUrl}/states`, { params: { country } });
  }

  getCities(state): Observable<any[]> {
    return this.http.get<any[]>(`${this.addressUrl}/cities`, { params: { state } })
  }

}
