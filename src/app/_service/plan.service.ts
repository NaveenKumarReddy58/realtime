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
  _liveApiUrl: any = this.authService._liveApiUrl;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private toastr: ToastrService,
    public authService: AuthService
  ) {
    console.log('_liveApiUrl', this._liveApiUrl);
  }

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
      .get<any>(`${this._liveApiUrl}/tenant/plan/${tail}`)
      .pipe(
        map((data) => {
          return data;
        }),
        catchError(this.authService.handleError)
      )
      .subscribe(
        (data: any) => {
          this.authService.resultCodeError(data);

          this.plansData.plans = data;
          this._plans.next(Object.assign({}, this.plansData).plans);
          this.plancount();
        },
        (error) => {
          this.authService.dataError(error);
        }
      );
  }

  padd(form: any) {
    return this.http.post<any>(`${this._liveApiUrl}/tenant/plan/`, form).pipe(
      map((data) => {
        return data;
      }),
      catchError(this.authService.handleError)
    );
  }

  pedit(id: Number, form: any) {
    return this.http
      .put<any>(`${this._liveApiUrl}/tenant/plan/${id}/`, form)
      .pipe(
        map((data) => {
          return data;
        }),
        catchError(this.authService.handleError)
      );
  }

  pdelete(id: Number) {
    return this.http.delete<any>(`${this._liveApiUrl}/tenant/plan/${id}`);
  }

  cpAdd(form: any) {
    return this.http
      .post<any>(`${this._liveApiUrl}/tenant/organization/`, form)
      .pipe(
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
      .get<any>(`${this._liveApiUrl}/tenant/organization-listing/${tail}`)
      .pipe(
        map((data) => {
          return data;
        }),
        catchError(this.authService.handleError)
      )
      .subscribe(
        (data: any) => {
          this.authService.resultCodeError(data);

          this.companyData.company = data;
          this._company.next(Object.assign({}, this.companyData).company);
        },
        (error) => {
          this.authService.dataError(error);
        }
      );
  }

  cpdetail(companyid: Number) {
    return this.http.get<any>(
      `${this._liveApiUrl}/tenant/organization/${companyid}/`
    );
  }

  cpdelete(id: Number) {
    return this.http.delete<any>(
      `${this._liveApiUrl}/tenant/organization/${id}`
    );
  }

  cpdeactivate(id: Number, org_status: string) {
    return this.http
      .patch<any>(`${this._liveApiUrl}/tenant/organization/${id}/`, {
        org_status,
      })
      .pipe(
        map((data) => {
          return data;
        }),
        catchError(this.authService.handleError)
      );
  }

  cporgcount() {
    this.http
      .get<any>(`${this._liveApiUrl}/tenant/org-count/`)
      .pipe(
        map((data) => {
          return data;
        }),
        catchError(this.authService.handleError)
      )
      .subscribe(
        (data: any) => {
          this.authService.resultCodeError(data);

          this.orgcountData.orgcount = data;
          this._orgcount.next(Object.assign({}, this.orgcountData).orgcount);
        },
        (error) => {
          this.authService.dataError(error);
        }
      );
  }

  plancount() {
    this.http
      .get<any>(`${this._liveApiUrl}/tenant/plan-count/`)
      .pipe(
        map((data) => {
          return data;
        }),
        catchError(this.authService.handleError)
      )
      .subscribe(
        (data: any) => {
          this.authService.resultCodeError(data);

          this.plancountData.plancount = data;
          this._plancount.next(Object.assign({}, this.plancountData).plancount);
        },
        (error) => {
          this.authService.dataError(error);
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
      .put<any>(`${this._liveApiUrl}/tenant/bookmark/${id}`, {})
      .pipe(
        map((data) => {
          return data;
        }),
        catchError(this.authService.handleError)
      );
  }
}
