import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PaymentLink } from './PaymentLink';
import { PaymentsService } from './payments.service';

@Component({
  selector: 'app-payment-gateway',
  templateUrl: './payment-gateway.component.html',
  styleUrls: ['./payment-gateway.component.css']
})
export class PaymentGatewayComponent implements OnInit {

  _id: string;

  currencyData: string[] = ['Select Currency'];

  paymentForm: FormGroup;
  paymentLinkData: PaymentLink[] = [];

  routeParams: object;

  noPaymentLinkData: boolean = false;

  constructor(private paymentService: PaymentsService, private route: ActivatedRoute) { }

  ngOnInit(): void {

    this._id = (JSON.parse(localStorage.getItem('userData')))._id
    this.paymentService.getCurrencyData().subscribe(data => {
      Object.keys(data).forEach(key => {
        this.currencyData.push(key)
      })
    })
    this.paymentForm = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'contact': new FormControl(null, [Validators.required, this.tenDigitRequired.bind(this)]),
      'currency': new FormControl('Select Currency', Validators.required),
      'description': new FormControl(null, Validators.required),
      'amount': new FormControl(null, Validators.required)
    })
    this.paymentService.getPaymentLinkData().subscribe(data => {
      this.paymentLinkData = data;
      this.paymentLinkData = this.paymentLinkData.reverse()
      this.noPaymentLinkData = this.paymentLinkData.length > 0
    })

  }

  onSubmit() {
    let data = this.paymentForm.value;
    data = { ...data, amount: data.amount * 100, contact: data.contact.toString() }
    this.paymentService.generatePaymentLink(data).subscribe(data => {
      const proceed = confirm("Do you want to visit the payment link now?")
      if (proceed) {
        window.location.href = data.short_url
      } else {
        this.onClose()
      }
      this.paymentService.getPaymentLinkData().subscribe(data => {
        this.paymentLinkData = data;
        this.paymentLinkData = this.paymentLinkData.reverse()
      })
      return;
    })
  }

  openModal() {
    const container = document.querySelector('#modal')
    container.classList.toggle('modal')
    container.classList.toggle('modal-backdrop')
  }

  onClose() {
    const container = document.querySelector('#modal')
    container.classList.toggle('modal')
    container.classList.toggle('modal-backdrop')
  }

  tenDigitRequired(control: FormControl): { [s: string]: boolean } {
    const numberValue = String(control.value);
    if (numberValue.length !== 10) {
      return { 'tenDigitRequired': true }
    }
    return null;
  }

}
