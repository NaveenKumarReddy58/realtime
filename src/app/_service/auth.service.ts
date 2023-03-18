import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  toggleDashboard = new BehaviorSubject<any>(false);

  constructor(
    private http: HttpClient,
    public router: Router,
    private toastr: ToastrService
  ) {}

  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      msg = error.error.message;
    } else {
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log('e', msg);
    return throwError(msg);
  }

  get getToken() {
    return localStorage.getItem('access_token');
  }

  get getOrgEmail() {
    return localStorage.getItem('org_email');
  }

  get getOrgDomain() {
    return localStorage.getItem('org_domain');
  }

  activeDashboard(): Observable<any[]> {
    this.toggleDashboard.next(this.isLoggedIn);
    return this.toggleDashboard.asObservable();
  }

  get isLoggedIn(): boolean {
    let authToken = localStorage.getItem('access_token');
    return authToken !== null ? true : false;
  }

  get isOrgIn(): boolean {
    let orgEmail = localStorage.getItem('org_email');
    return orgEmail !== null ? true : false;
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

    this.toggleDashboard.next(false);
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
          this.toggleDashboard.next(data?.access_token);
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
          this.toggleDashboard.next(data?.access_token);
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

  verifyResetOtp(email: string, otp: string) {
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

  tokenRefresh() {
    const refresh = localStorage.getItem('refresh_token');
    return this.http
      .post<any>(`${environment.apiUrl}/account/token/refresh/`, {
        refresh,
      })
      .pipe(
        map((data) => {
          localStorage.setItem('access_token', data?.access);
          // localStorage.setItem('user', JSON.stringify(data));
          return data;
        }),
        catchError(this.handleError)
      )
      .subscribe(
        (data: any) => {
          if (
            data?.resultCode === '0' ||
            data?.resultCode == 4 ||
            data?.resultCode == 0
          ) {
            console.log('Api Data Err', data);
            return;
          }
          console.log('tokenRefresh');
        },
        (error) => {
          console.log('Api Err', error);
        }
      );
  }
}
