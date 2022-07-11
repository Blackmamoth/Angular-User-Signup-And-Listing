import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { NgxPaginationModule } from 'ngx-pagination';
import { ModalModule } from 'ngx-bootstrap/modal'

import { AppComponent } from './app.component';
import { UsersComponent } from './users/users.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { UsersService } from './users/users.service';
import { UsersListComponent } from './users/users-list/users-list.component';
import { UserFormComponent } from './users/user-form/user-form.component';
import { AuthComponent } from './auth/auth.component';
import { HeaderComponent } from './header/header.component';
import { AuthInterceptor } from './auth/auth-interceptor.service';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './forgot-password/reset-password/reset-password.component';
import { UserMedicinesComponent } from './users/user-medicines/user-medicines.component';
import { MediaUploadComponent } from './users/media-upload/media-upload.component';
import { SanitizeUrlPipe } from './sanitize-url.pipe';
import { AddMedicineComponent } from './users/user-medicines/add-medicine/add-medicine.component';
import { PaymentGatewayComponent } from './payment-gateway/payment-gateway.component';

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    UsersListComponent,
    UserFormComponent,
    AuthComponent,
    HeaderComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    UserMedicinesComponent,
    MediaUploadComponent,
    SanitizeUrlPipe,
    AddMedicineComponent,
    PaymentGatewayComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    NgxPaginationModule,
    ModalModule.forRoot(),
  ],
  providers: [UsersService, { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
