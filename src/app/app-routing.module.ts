import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthComponent } from "./auth/auth.component";
import { AuthGuard } from "./auth/auth.guard";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { ResetPasswordComponent } from "./forgot-password/reset-password/reset-password.component";
import { UserFormComponent } from "./users/user-form/user-form.component";
import { UsersComponent } from "./users/users.component";

const appRoutes: Routes = [
    { path: '', redirectTo: 'users', pathMatch: 'full' },
    { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
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