import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  
  httpOptions: any = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      // Authorization: 'my-auth-token'
    })
  };
  flag: boolean = false

  constructor(private http: HttpClient, private toastr: ToastrService) { }

  isLoggedIn() {
    return this.flag
  }

  getOrganization(email: string) {
    return this.http.get<any>(
      `${environment.apiUrl}/tenant/get-organization/?email=${email}`
    );
  }

  getToken(email: string, password: string) {
    return this.http
      .post<any>(`${environment.apiUrl}/account/token/`, {
        email,
        password,
      })
      .pipe(
        map((data) => {
          // localStorage.setItem('user', JSON.stringify(data));
          return data;
        })
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
        })
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
      }, this.httpOptions)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
}
