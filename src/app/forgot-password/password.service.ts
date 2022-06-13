import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {

  constructor(private http: HttpClient) { }

  baseUrl: string = '/api/resetPassword'

  forgotPassword(email) {
    return this.http.post<any>(this.baseUrl, { email });
  }

  resetPassword(password, tokenID) {
    const url = `${this.baseUrl}/reset/${tokenID}`
    return this.http.post<any>(url, { password })
  }

}
