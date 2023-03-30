import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, delay, map, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Plan } from '../_interface/plan';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class PlanService {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private toastr: ToastrService,
    public authService: AuthService
  ) {}

  private _plans = new BehaviorSubject<object[]>([]);
  private plansData: { plans: object[] } = { plans: [] };

  private _company = new BehaviorSubject<object[]>([]);
  private companyData: { company: object[] } = { company: [] };

  private _plancount = new BehaviorSubject<object[]>([]);
  private plancountData: { plancount: object[] } = { plancount: [] };

  private _orgcount = new BehaviorSubject<object[]>([]);
  private orgcountData: { orgcount: object[] } = { orgcount: [] };

  get_plans(): Observable<any[]> {
    return this._plans.asObservable();
  }

  get_company(): Observable<any[]> {
    return this._company.asObservable();
  }

  get_plancount(): Observable<any[]> {
    return this._plancount.asObservable();
  }

  get_orgcount(): Observable<any[]> {
    return this._orgcount.asObservable();
  }

  plist(id?: Number) {
    let tail = '';
    if (id) {
      tail = `${id}`;
    }

    this.http
      .get<any>(`${environment.apiUrl}/tenant/plan/${tail}`)
      .pipe(
        // retry(2),
        // delay(2),
        map((data) => {
          return data;
        }),
        catchError(this.authService.handleError)
      )
      .subscribe(
        (data: any) => {
          if (
            data?.resultCode === '0' ||
            data?.resultCode == 4 ||
            data?.resultCode == 0
          ) {
            console.log('Api Data Err', data);
            // this.toastr.error(data.errorMessage);
            return;
          }

          this.plansData.plans = data;
          this._plans.next(Object.assign({}, this.plansData).plans);
          this.plancount();
        },
        (error) => {
          console.log('Api Err', error);
        }
      );
  }

  padd(form: any) {
    return this.http.post<any>(`${environment.apiUrl}/tenant/plan/`, form).pipe(
      // retry(2),
      // delay(2),
      map((data) => {
        return data;
      }),
      catchError(this.authService.handleError)
    );
  }

  pedit(id: Number, form: any) {
    return this.http
      .put<any>(`${environment.apiUrl}/tenant/plan/${id}/`, form)
      .pipe(
        // retry(2),
        // delay(2),
        map((data) => {
          return data;
        }),
        catchError(this.authService.handleError)
      );
  }

  pdelete(id: Number) {
    return this.http.delete<any>(`${environment.apiUrl}/tenant/plan/${id}`);
  }

  cpAdd(form: any) {
    return this.http
      .post<any>(`${environment.apiUrl}/tenant/organization/`, form)
      .pipe(
        // retry(2),
        // delay(2),
        map((data) => {
          return data;
        }),
        catchError(this.authService.handleError)
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
      .pipe(
        // retry(2),
        // delay(2),
        map((data) => {
          return data;
        }),
        catchError(this.authService.handleError)
      )
      .subscribe(
        (data: any) => {
          if (
            data?.resultCode === '0' ||
            data?.resultCode == 4 ||
            data?.resultCode == 0
          ) {
            console.log('Api Data Err', data);
            // this.toastr.error(data.errorMessage);
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
        // retry(2),
        // delay(2),
        map((data) => {
          return data;
        }),
        catchError(this.authService.handleError)
      );
  }

  cporgcount() {
    this.http
      .get<any>(`${environment.apiUrl}/tenant/org-count/`)
      .pipe(
        // retry(2),
        // delay(2),
        map((data) => {
          return data;
        }),
        catchError(this.authService.handleError)
      )
      .subscribe(
        (data: any) => {
          if (
            data?.resultCode === '0' ||
            data?.resultCode == 4 ||
            data?.resultCode == 0
          ) {
            console.log('Api Data Err', data);
            // this.toastr.error(data.errorMessage);
            return;
          }

          this.orgcountData.orgcount = data;
          this._orgcount.next(Object.assign({}, this.orgcountData).orgcount);
        },
        (error) => {
          console.log('Api Err', error);
        }
      );
  }

  plancount() {
    this.http
      .get<any>(`${environment.apiUrl}/tenant/plan-count/`)
      .pipe(
        // retry(2),
        // delay(2),
        map((data) => {
          return data;
        }),
        catchError(this.authService.handleError)
      )
      .subscribe(
        (data: any) => {
          if (
            data?.resultCode === '0' ||
            data?.resultCode == 4 ||
            data?.resultCode == 0
          ) {
            console.log('Api Data Err', data);
            // this.toastr.error(data.errorMessage);
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

  clearrouter() {
    this.router.navigate(['/dashboad'], {
      relativeTo: this.route,
      queryParams: {
        plan: null,
        search_text: null,
        bookmarked: null,
        deactivated: null,
        start_date: null,
        end_date: null,
      },
      queryParamsHandling: 'merge', //preserve
    });
  }

  setrouter(object: any) {
    this.clearrouter();
    this.router.navigate(['/dashboad'], {
      relativeTo: this.route,
      queryParams: object,
      queryParamsHandling: 'merge', //merge
    });
  }

  cbookmark(id: Number) {
    return this.http
      .put<any>(`${environment.apiUrl}/tenant/bookmark/${id}`, {})
      .pipe(
        // retry(2),
        // delay(2),
        map((data) => {
          return data;
        }),
        catchError(this.authService.handleError)
      );
  }
}
