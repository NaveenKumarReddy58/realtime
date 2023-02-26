import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from '../_interface/user';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser = {};

  constructor(
    private http: HttpClient,
    public router: Router,
    private toastr: ToastrService
  ) {

  }

  // Sign-up
  signUp(user: User): Observable<any> {
    let api = `${environment.apiUrl}/register-user`;
    return this.http.post(api, user).pipe(catchError(this.handleError));
  }

  // Sign-in
  signIn(user: User) {
    return this.http
      .post<any>(`${environment.apiUrl}/signin`, user)
      .subscribe((res: any) => {
        localStorage.setItem('access_token', res.token);
        this.getUserProfile(res._id).subscribe((res) => {
          this.currentUser = res;
          this.router.navigate(['user-profile/' + res.msg._id]);
        });
      });
  }

  getToken() {
    return localStorage.getItem('access_token');
  }

  get isLoggedIn(): boolean {
    let authToken = localStorage.getItem('access_token');
    return authToken !== null ? true : false;
  }

  doLogout() {
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('name');
    localStorage.removeItem('role');
    localStorage.removeItem('user_timezone');

    let removeToken = localStorage.removeItem('access_token');
    if (removeToken == null) {
      this.router.navigate(['/']);
    }
  }

  // User profile
  getUserProfile(id: any): Observable<any> {
    let api = `${environment.apiUrl}/user-profile/${id}`;
    return this.http.get(api).pipe(
      map((res) => {
        return res || {};
      }),
      catchError(this.handleError)
    );
  }

  // Error
  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }

  getOrganization(email: string) {
    return this.http.get<any>(
      `${environment.apiUrl}/tenant/get-organization/?email=${email}`
    );
  }

  login(email: string, password: string) {
    return this.http
      .post<any>(`${environment.apiUrl}/account/token/`, {
        email,
        password,
      })
      .pipe(
        map((data) => {
          // localStorage.setItem('user', JSON.stringify(data));
          return data;
        }),
        catchError(this.handleError)
      );
  }

  sendMobileOtp(mobile_no: string) {
    return this.http.get<any>(
      `${environment.apiUrl}/account/send-mobile-otp/?mobile_no=${mobile_no}`
    );
  }

  loginByOtp(email: string, password: string, login_by: string = 'otp') {
    return this.http
      .post<any>(`${environment.apiUrl}/account/token/`, {
        email,
        password,
        login_by,
      })
      .pipe(
        map((data) => {
          // localStorage.setItem('user', JSON.stringify(data));
          return data;
        }),
        catchError(this.handleError)
      );
  }

  sendResetOtp(email: string) {
    return this.http.get<any>(
      `${environment.apiUrl}/account/send-reset-otp/?email=${email}`
    );
  }

  verifyResestOtp(email: string, otp: string) {
    return this.http.get<any>(
      `${environment.apiUrl}/account/verify-reset-otp/?email=${email}&otp=${otp}`
    );
  }

  resetPassword(email: string, new_password: string) {
    return this.http
      .put<any>(`${environment.apiUrl}/account/reset-password/`, {
        email,
        new_password,
      })
      .pipe(
        map((data) => {
          return data;
        }),
        catchError(this.handleError)
      );
  }

}