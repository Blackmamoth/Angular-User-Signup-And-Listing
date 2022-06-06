import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, Subject } from 'rxjs';
import { User } from './User';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
}


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }


  baseUrl: string = 'http://localhost:5000/api/users';

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl, httpOptions);
  }

  getUser(id: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`, httpOptions);
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.baseUrl, user, httpOptions);
  }

  updateUser(user: User, newUser: User): Observable<User> {
    const url = `${this.baseUrl}/${user._id}`
    return this.http.patch<User>(url, newUser, httpOptions);
  }

  deleteUser(user: User): Observable<User> {
    return this.http.delete<User>(`${this.baseUrl}/${user._id}`);
  }

}
