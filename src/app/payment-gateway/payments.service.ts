import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaymentLink } from './PaymentLink';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {

  constructor(private http: HttpClient) { }

  baseUrl: string = "/api/payment"

  getCurrencyData(): any {
    const url = "https://openexchangerates.org/api/currencies.json";
    return this.http.get<any>(url)
  }

  getPaymentLinkData(): Observable<PaymentLink[]> {
    return this.http.get<PaymentLink[]>(`${this.baseUrl}/paymentLinks`)
  }

  generatePaymentLink(data: object): Observable<PaymentLink> {
    return this.http.post<PaymentLink>(`${this.baseUrl}/paymentLinks`, data)
  }

  verifyPayment(data: object): any {
    return this.http.post<any>(`${this.baseUrl}/paymentLinks/verify`, data)
  }
}
