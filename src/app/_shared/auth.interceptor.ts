import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
  HttpEvent,
  HttpResponse,
} from '@angular/common/http';
import { AuthService } from '../_service/auth.service';
import {
  catchError,
  delay,
  delayWhen,
  map,
  Observable,
  retry,
  tap,
  throwError,
} from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authToken = this.authService.getToken;
    if (authToken) {
      req = req.clone({
        setHeaders: {
          Authorization: 'Bearer ' + authToken,
        },
      });
    } else {
      req = req.clone({
        setHeaders: {},
      });
    }
    // return next.handle(req);
    return next.handle(req).pipe(
      retry(2),
      delay(2),
      tap((evt) => {
        if (evt instanceof HttpResponse) {
          if (evt.body.resultCode == 4) {
            this.authService.tokenRefresh();
            return;
          } else {
          }
        }
      }),
      catchError(this.authService.handleError)
    );
  }
}
