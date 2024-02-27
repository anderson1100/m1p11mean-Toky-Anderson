import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
    constructor(private router: Router, private cookieService: CookieService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const baseUrl = "http://localhost:3000/api";
        const apiReq = req.clone({ url: `${baseUrl}/${req.url}`, withCredentials: true });

        //console.log(apiReq.url)

        let role : string = "";

        const jwtToken = this.cookieService.get('jwtAccess');
        if (jwtToken) {
            const decodedToken: any = jwtDecode(jwtToken);
            //{ header: true }
            //console.log(decodedToken)
            role = decodedToken.role;
            //console.log("jwt decode", decodedToken);
        }

        return next.handle(apiReq).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 403) {
                    console.log("Unauthorized access. Redirecting to login based on role...");
                    console.log(role);
                    if (role === 'client') {
                        //console.log("Navigate to client login");
                        this.router.navigate(['/login']);
                    } else if (role === 'employe') {
                        //console.log("Navigate to employee login");
                        this.router.navigate(['employe','login']);

                    } else if (role === 'manager') {
                        //console.log("Navigate to employee login");
                        console.log("here");
                        this.router.navigate(['manager','login']);
                    } else {
                        console.log("Unknown role in JWT token");
                        this.router.navigate(['/login']);
                    }
                }
                return throwError(() => error);
            })
        );
    }
}