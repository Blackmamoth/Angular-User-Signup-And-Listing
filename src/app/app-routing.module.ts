import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthComponent } from "./auth/auth.component";
import { AuthGuard } from "./auth/auth.guard";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { ResetPasswordComponent } from "./forgot-password/reset-password/reset-password.component";
import { PaymentGatewayComponent } from "./payment-gateway/payment-gateway.component";
import { MediaUploadComponent } from "./users/media-upload/media-upload.component";
import { UserFormComponent } from "./users/user-form/user-form.component";
import { AddMedicineComponent } from "./users/user-medicines/add-medicine/add-medicine.component";
import { UserMedicinesComponent } from "./users/user-medicines/user-medicines.component";
import { UsersComponent } from "./users/users.component";

// const userID = (JSON.parse(localStorage.getItem('userData')))._id

const appRoutes: Routes = [
    { path: '', redirectTo: 'users', pathMatch: 'full' },
    {
        path: 'users', component: UsersComponent, canActivate: [AuthGuard], children: [
            { path: 'edit/:id', component: UserFormComponent },
            { path: 'medicines', component: UserMedicinesComponent },
            { path: 'medicines/add', component: AddMedicineComponent },
            { path: 'media', component: MediaUploadComponent },
            { path: 'payment', component: PaymentGatewayComponent }
        ]
    },
    { path: 'login', component: AuthComponent },
    { path: 'register', component: UserFormComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'resetPassword/reset/:tokenID', component: ResetPasswordComponent }

]


@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes),
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule { }