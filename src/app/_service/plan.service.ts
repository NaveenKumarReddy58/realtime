import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Plan } from '../_interface/plan';

@Injectable({
  providedIn: 'root'
})
export class PlanService {

  constructor(
    private http: HttpClient,
    public router: Router,
    private toastr: ToastrService
  ) {

  }

  list() {
    return this.http.get<any>(
      `${environment.apiUrl}/tenant/plan/`
    );
  }

  // plan: Plan
  add(
    title: string,
    max_drivers: Number,
    max_admin: Number,
    valid_for: Number,
    desecription: string,
    // img: File,
    price: Number
  ) {
    return this.http
      .post<Plan>(`${environment.apiUrl}/tenant/plan/`, {
        title,
        max_drivers,
        max_admin,
        valid_for,
        desecription,
        // img,
        price
      })
      .pipe(
        map((data) => {
          return data;
        }),
        catchError(this.handleError)
      );
  }

  delete(id: Number) {
    return this.http.delete<any>(
      `${environment.apiUrl}/tenant/plan/${id}`
    );
  }

  cpAdd(
    name: string,
    country: string,
    state: string,
    city: string,
    description: string,
    // domain_url: string,
    admin_email: string,
    plan_id: Number,
    first_name: string,
    last_name: string,
    phone_number: Number,
    password: string,
    // logo: File,
    user_timezone: string
  ) {
    return this.http
      .post<Plan>(`${environment.apiUrl}/tenant/organization/`, {
        name,
        country,
        state,
        city,
        description,
        // domain_url,
        admin_email,
        plan_id,
        first_name,
        last_name,
        phone_number,
        password,
        // logo,
        user_timezone
      })
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

}
