import { HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { exhaustMap, take } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return this.authService.token.pipe(take(1), exhaustMap(data => {
            if (!data) {
                return next.handle(req)
            }
            const modifiedRequest = req.clone({ headers: new HttpHeaders().append('Authorization', `Bearer ${data.token}`) })
            return next.handle(modifiedRequest)
        }))
    }
}