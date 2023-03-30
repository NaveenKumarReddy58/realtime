import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, delay, map, retry } from 'rxjs/operators';
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
  apiUrl = environment.apiUrl;
  _apiUrl = new BehaviorSubject<any>(this.apiUrl);
  _isDashboard = new BehaviorSubject<any>(false);
  _isRole = new BehaviorSubject<any>('0');
  _liveApiUrl = this.apiUrl;

  constructor(
    private http: HttpClient,
    public router: Router,
    private toastr: ToastrService
  ) {
    this.getApiUrl().subscribe((data: any) => {
      this._liveApiUrl = data;
    });
  }

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
    return this.getLS('access_token');
  }

  get getOrgEmail() {
    return this.getLS('org_email');
  }

  get getOrgDomain() {
    return this.getLS('org_domain');
  }

  getDashboard(): Observable<any[]> {
    this._isDashboard.next(this.isLoggedIn);
    return this._isDashboard.asObservable();
  }

  get isLoggedIn(): boolean {
    let authToken = this.getLS('access_token');
    return authToken !== null ? true : false;
  }

  getRole(): Observable<any[]> {
    this._isRole.next(this.isRoleIn);
    return this._isRole.asObservable();
  }

  get isRoleIn(): string {
    let role = this.getLS('role');
    return role !== null ? role : '0';
  }

  getApiUrl(): Observable<any[]> {
    this._apiUrl.next(this.isApiUrlIn);
    return this._apiUrl.asObservable();
  }

  get isApiUrlIn(): string {
    let orgDomain = this.getLS('org_domain');
    return orgDomain !== null ? orgDomain : this.apiUrl;
  }

  get isOrgIn(): boolean {
    let orgEmail = this.getLS('org_email');
    return orgEmail !== null ? true : false;
  }

  setLS(k: any, v: any) {
    return localStorage.setItem(k, v);
  }

  getLS(k: any) {
    return localStorage.getItem(k);
  }

  rmLS(k: any) {
    return localStorage.removeItem(k);
  }

  doLogout() {
    this.rmLS('refresh_token');
    this.rmLS('name');
    this.rmLS('role');
    this.rmLS('user_timezone');

    let removeToken = this.rmLS('access_token');
    if (removeToken == null) {
      this.router.navigate(['/']);
    }

    this._apiUrl.next(this.apiUrl);
    this._isDashboard.next(false);
    this._isRole.next('0');
  }

  // User profile
  getUserProfile(id: any): Observable<any> {
    let api = `${environment.apiUrl}/user-profile/${id}`;
    return this.http.get(api).pipe(
      retry(2),
      delay(2),
      map((res) => {
        return res || {};
      }),
      catchError(this.handleError)
    );
  }

  getOrganization(email: string) {
    return this.http
      .post<any>(`${environment.apiUrl}/tenant/get-organization/`, {
        email,
      })
      .pipe(
        retry(2),
        delay(2),
        map((data) => {
          return data;
        }),
        catchError(this.handleError)
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<any>(`${environment.apiUrl}/account/token/`, {
        email,
        password,
      })
      .pipe(
        retry(2),
        delay(2),
        map((data) => {
          this._isDashboard.next(data?.access_token);
          this._isRole.next(data?.role);
          return data;
        }),
        catchError(this.handleError)
      );
  }

  sendMobileOtp(mobile_no: string) {
    return this.http
      .post<any>(`${environment.apiUrl}/account/send-mobile-otp/`, {
        mobile_no,
      })
      .pipe(
        retry(2),
        delay(2),
        map((data) => {
          return data;
        }),
        catchError(this.handleError)
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
        retry(2),
        delay(2),
        map((data) => {
          this._isDashboard.next(data?.access_token);
          this._isRole.next(data?.role);
          return data;
        }),
        catchError(this.handleError)
      );
  }

  sendResetOtp(email: string) {
    return this.http
      .post<any>(`${environment.apiUrl}/account/send-reset-otp/`, {
        email,
      })
      .pipe(
        retry(2),
        delay(2),
        map((data) => {
          return data;
        }),
        catchError(this.handleError)
      );
  }

  verifyResetOtp(email: string, otp: string) {
    return this.http
      .post<any>(`${environment.apiUrl}/account/verify-reset-otp/`, {
        email,
        otp,
      })
      .pipe(
        retry(2),
        delay(2),
        map((data) => {
          return data;
        }),
        catchError(this.handleError)
      );
  }

  resetPassword(email: string, new_password: string) {
    return this.http
      .put<any>(`${environment.apiUrl}/account/reset-password/`, {
        email,
        new_password,
      })
      .pipe(
        retry(2),
        delay(2),
        map((data) => {
          return data;
        }),
        catchError(this.handleError)
      );
  }

  tokenRefresh() {
    const refresh = this.getLS('refresh_token');
    return this.http
      .post<any>(`${environment.apiUrl}/account/token/refresh/`, {
        refresh,
      })
      .pipe(
        retry(2),
        delay(2),
        map((data) => {
          this.setLS('access_token', data?.access);
          // this.setLS('user', JSON.stringify(data));
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
