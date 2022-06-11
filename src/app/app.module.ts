import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'
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

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    UsersListComponent,
    UserFormComponent,
    AuthComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    NgxPaginationModule,
    ModalModule.forRoot(),
  ],
  providers: [UsersService],
  bootstrap: [AppComponent]
})
export class AppModule { }
