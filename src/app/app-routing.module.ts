import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { UserFormComponent } from "./users/user-form/user-form.component";
import { UsersComponent } from "./users/users.component";

const appRoutes: Routes = [
    { path: '', redirectTo: 'users', pathMatch: 'full' },
    {
        path: 'users', component: UsersComponent, children: [
            { path: 'signup', component: UserFormComponent },
            { path: ':id/edit', component: UserFormComponent }
        ]
    },

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