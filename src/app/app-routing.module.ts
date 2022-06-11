import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthComponent } from "./auth/auth.component";
import { UserFormComponent } from "./users/user-form/user-form.component";
import { UsersComponent } from "./users/users.component";

const appRoutes: Routes = [
    { path: '', redirectTo: 'users', pathMatch: 'full' },
    { path: 'users', component: UsersComponent },
    { path: 'login', component: AuthComponent },
    { path: 'register', component: UserFormComponent }

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