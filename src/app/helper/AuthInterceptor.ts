import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { NotificationsService } from 'angular2-notifications';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    private _accessTokenKey: string = 'tpp-monitoring-authenticate-access-token';

    constructor(private authService: AuthService,
        private notiService: NotificationsService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = sessionStorage.getItem(this._accessTokenKey);

        if (!token) {
            return next.handle(req);
        }

        const req1 = req.clone({
            headers: req.headers.set('x-access-token', token),
        });

        // return next.handle(req1);
        return next.handle(req1).pipe(
            catchError((err: HttpErrorResponse) => {
                if (err instanceof HttpErrorResponse) {
                    if (err.status === 401) {
                        this.handle401Error(req1, next);
                        this.notiService.warn('Session หมดอายุ', 'Session ของท่านหมดอายุ กรุณาเข้าสู่ระบบใหม่อีกครั้ง');
                    }
                }
                return throwError(err);
            }) as any);
    }

    private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
        this.authService.logout();
    }
}

