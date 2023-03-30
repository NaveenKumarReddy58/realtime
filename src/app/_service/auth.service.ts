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
  port = environment.port;
  _apiUrl = new BehaviorSubject<any>(this.apiUrl);
  _isDashboard = new BehaviorSubject<any>(false);
  _isRole = new BehaviorSubject<any>('0');
  _liveApiUrl = this.apiUrl;

  constructor(
    private http: HttpClient,
    public router: Router,
    private toastr: ToastrService
  ) {
    this.getApiUrl.subscribe((data: any) => {
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
    console.log('Err', msg);
    return throwError(msg);
  }

  dataError(error: any) {
    console.log('Api Err', error);
  }

  resultCodeError(data: any) {
    if (
      data?.resultCode == '0' ||
      data?.resultCode == 4 ||
      data?.resultCode == 0
    ) {
      console.log('Api Data Err', data);
      this.toastr.error(data?.errorMessage);
      return true;
    } else {
      return false;
    }
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

  get isOrgIn(): boolean {
    let orgEmail = this.getLS('org_email');
    return orgEmail !== null ? true : false;
  }

  getDashboard(): Observable<any[]> {
    let authToken = this.getLS('access_token');
    this._isDashboard.next(authToken !== null ? true : false);
    return this._isDashboard.asObservable();
  }

  getRole(): Observable<any[]> {
    let role = this.getLS('role');
    this._isRole.next(role !== null ? role : '0');
    return this._isRole.asObservable();
  }

  get getApiUrl(): Observable<any[]> {
    let orgDomain = this.getLS('org_domain');
    this._apiUrl.next(
      orgDomain !== null ? orgDomain + ':' + this.port : this.apiUrl
    );
    return this._apiUrl.asObservable();
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
    let api = `${this._liveApiUrl}/user-profile/${id}`;
    return this.http.get(api).pipe(
      map((res) => {
        return res || {};
      }),
      catchError(this.handleError)
    );
  }

  getOrganization(email: string) {
    return this.http
      .post<any>(`${this._liveApiUrl}/tenant/get-organization/`, {
        email,
      })
      .pipe(
        map((data) => {
          return data;
        }),
        catchError(this.handleError)
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<any>(`${this._liveApiUrl}/account/token/`, {
        email,
        password,
      })
      .pipe(
        map((data) => {
          if (data?.access_token != undefined) {
            this._isDashboard.next(data?.access_token);
            this._isRole.next(data?.role);
          }
          return data;
        }),
        catchError(this.handleError)
      );
  }

  sendMobileOtp(mobile_no: string) {
    return this.http
      .post<any>(`${this._liveApiUrl}/account/send-mobile-otp/`, {
        mobile_no,
      })
      .pipe(
        map((data) => {
          return data;
        }),
        catchError(this.handleError)
      );
  }

  loginByOtp(email: string, password: string, login_by: string = 'otp') {
    return this.http
      .post<any>(`${this._liveApiUrl}/account/token/`, {
        email,
        password,
        login_by,
      })
      .pipe(
        map((data) => {
          if (data?.access_token != undefined) {
            this._isDashboard.next(data?.access_token);
            this._isRole.next(data?.role);
          }
          return data;
        }),
        catchError(this.handleError)
      );
  }

  sendResetOtp(email: string) {
    return this.http
      .post<any>(`${this._liveApiUrl}/account/send-reset-otp/`, {
        email,
      })
      .pipe(
        map((data) => {
          return data;
        }),
        catchError(this.handleError)
      );
  }

  verifyResetOtp(email: string, otp: string) {
    return this.http
      .post<any>(`${this._liveApiUrl}/account/verify-reset-otp/`, {
        email,
        otp,
      })
      .pipe(
        map((data) => {
          return data;
        }),
        catchError(this.handleError)
      );
  }

  resetPassword(email: string, new_password: string) {
    return this.http
      .put<any>(`${this._liveApiUrl}/account/reset-password/`, {
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
    const refresh = this.getLS('refresh_token');
    return this.http
      .post<any>(`${this._liveApiUrl}/account/token/refresh/`, {
        refresh,
      })
      .pipe(
        map((data) => {
          this.setLS('access_token', data?.access);
          // this.setLS('user', JSON.stringify(data));
          return data;
        }),
        catchError(this.handleError)
      )
      .subscribe(
        (data: any) => {
          if (this.resultCodeError(data)) {
            return;
          }

          console.log('TokenRefresh');
        },
        (error) => {
          this.dataError(error);
        }
      );
  }
}
