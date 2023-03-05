import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Plan } from '../_interface/plan';
import { BehaviorSubject, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlanService {
  constructor(
    private http: HttpClient,
    public router: Router,
    private toastr: ToastrService
  ) {}

  private _plans = new BehaviorSubject<object[]>([]);
  private plansData: { plans: object[] } = { plans: [] };

  get_plans(): Observable<any[]> {
    return this._plans.asObservable();
  }

  private _company = new BehaviorSubject<object[]>([]);
  private companyData: { company: object[] } = { company: [] };

  get_company(): Observable<any[]> {
    return this._company.asObservable();
  }

  plist(id?: Number) {
    let tail = '';
    if (id) {
      tail = `${id}`;
    }

    this.http.get<any>(`${environment.apiUrl}/tenant/plan/${tail}`).subscribe(
      (data) => {
        if (
          data?.resultCode === '0' ||
          data?.resultCode == 4 ||
          data?.resultCode == 0
        ) {
          console.log('Api Data Err', data);
          this.toastr.error(data.errorMessage);
          return;
        }

        this.plansData.plans = data;
        this._plans.next(Object.assign({}, this.plansData).plans);
      },
      (error) => {
        console.log('Api Err', error);
      }
    );
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

  cplist(id?: Number, filter?: any) {
    let tail = '';
    if (id) {
      tail += id;
    }
    let params = new URLSearchParams();
    for (let key in filter) {
      params.set(key, filter[key]);
    }
    if (filter) {
      tail += `?` + params.toString();
    }
    this.http
      .get<any>(`${environment.apiUrl}/tenant/organization-listing/${tail}`)
      .subscribe(
        (data) => {
          if (
            data?.resultCode === '0' ||
            data?.resultCode == 4 ||
            data?.resultCode == 0
          ) {
            console.log('Api Data Err', data);
            this.toastr.error(data.errorMessage);
            return;
          }

          this.companyData.company = data;
          this._company.next(Object.assign({}, this.companyData).company);
        },
        (error) => {
          console.log('Api Err', error);
        }
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

  private _plancount = new BehaviorSubject<object[]>([]);
  private plancountData: { plancount: object[] } = { plancount: [] };

  get_plancount(): Observable<any[]> {
    return this._plancount.asObservable();
  }

  plancount() {
    this.http.get<any>(`${environment.apiUrl}/tenant/plan-count/`).subscribe(
      (data) => {
        if (
          data?.resultCode === '0' ||
          data?.resultCode == 4 ||
          data?.resultCode == 0
        ) {
          console.log('Api Data Err', data);
          this.toastr.error(data.errorMessage);
          return;
        }

        this.plancountData.plancount = data;
        this._plancount.next(Object.assign({}, this.plancountData).plancount);
      },
      (error) => {
        console.log('Api Err', error);
      }
    );
  }
}
