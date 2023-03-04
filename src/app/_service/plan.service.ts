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

  plist() {
    return this.http.get<any>(`${environment.apiUrl}/tenant/plan/`);
  }

  pget(id: Number) {
    return this.http.get<any>(`${environment.apiUrl}/tenant/plan/${id}`);
  }

  padd(form: any) {
    return this.http.post<any>(`${environment.apiUrl}/tenant/plan/`, form).pipe(
      map((data) => {
        return data;
      }),
      catchError(this.handleError)
    );
  }

  pedit(id: Number, form: any) {
    return this.http
      .put<any>(`${environment.apiUrl}/tenant/plan/${id}/`, form)
      .pipe(
        map((data) => {
          return data;
        }),
        catchError(this.handleError)
      );
  }

  pdelete(id: Number) {
    return this.http.delete<any>(`${environment.apiUrl}/tenant/plan/${id}`);
  }

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

  cpdetail(companyid: Number) {
    return this.http.get<any>(
      `${environment.apiUrl}/tenant/organization/${companyid}/`
    );
  }

  cpdelete(id: Number) {
    return this.http.delete<any>(
      `${environment.apiUrl}/tenant/organization/${id}`
    );
  }

  cpdeactivate(id: Number, org_status: string) {
    return this.http
      .patch<any>(`${environment.apiUrl}/tenant/organization/${id}/`, {
        org_status,
      })
      .pipe(
        map((data) => {
          return data;
        }),
        catchError(this.handleError)
      );
  }

  cporgcount() {
    return this.http.get<any>(`${environment.apiUrl}/tenant/org-count/`);
  }

  plancount() {
    return this.http.get<any>(`${environment.apiUrl}/tenant/plan-count/`);
  }
}
