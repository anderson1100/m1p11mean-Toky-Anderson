import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
    constructor(private router: Router, private cookieService: CookieService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const baseUrl = "http://localhost:3000/api";
        const apiReq = req.clone({ url: `${baseUrl}/${req.url}`, withCredentials: true });
        //console.log("req body angular",req.body)

        return next.handle(apiReq).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 403) {
                    console.log("Unauthorized access. Redirecting to login based on role...");
                    const jwtToken = this.cookieService.get('jwtAccess');
                    if (jwtToken) {
                        const decodedToken: any = jwtDecode(jwtToken);
                        //{ header: true }
                        console.log(decodedToken)
                        const role = decodedToken.role;
                        console.log("jwt decode", decodedToken);
                        if (role === 'client') {
                            console.log("Navigate to client login");
                            this.router.navigate(['/login']);
                        } else if (role === 'employe') {
                            console.log("Navigate to employee login");
                            this.router.navigate(['/login_employe']);
                        } else {
                            console.log("Unknown role in JWT token");
                        }
                    } else {
                        console.log("JWT token not found in cookie");
                    }
                }
                return throwError(() => error);
            })
        );
    }
}