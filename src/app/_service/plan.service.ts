import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Plan } from '../_interface/plan';

@Injectable({
  providedIn: 'root',
})
export class PlanService {
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

  list() {
    return this.http.get<any>(`${environment.apiUrl}/tenant/plan/`);
  }

  add(form: any) {
    return this.http.post<any>(`${environment.apiUrl}/tenant/plan/`, form).pipe(
      map((data) => {
        return data;
      }),
      catchError(this.handleError)
    );
  }

  delete(id: Number) {
    return this.http.delete<any>(`${environment.apiUrl}/tenant/plan/${id}`);
  }

  // name: string,
  // country: string,
  // state: string,
  // city: string,
  // description: string,
  // // domain_url: string,
  // admin_email: string,
  // plan_id: Number,
  // first_name: string,
  // last_name: string,
  // phone_number: Number,
  // password: string,
  // // logo: File,
  // user_timezone: string

  cpAdd(form: any) {
    return this.http
      .post<any>(`${environment.apiUrl}/tenant/organization/`, form)
      .pipe(
        map((data) => {
          return data;
        }),
        catchError(this.handleError)
      );
  }

  cplist() {
    return this.http.get<any>(
      `${environment.apiUrl}/tenant/organization-listing/`
    );
  }
}
