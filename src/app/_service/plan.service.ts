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
  ) {}

  private _plans = new BehaviorSubject<object[]>([]);
  private plansData: { plans: object[] } = { plans: [] };

  private _planCount = new BehaviorSubject<object[]>([]);
  private planCountData: { planCount: object[] } = { planCount: [] };

  getPlans(): Observable<any[]> {
    return this._plans.asObservable();
  }

  getPlanCount(): Observable<any[]> {
    return this._planCount.asObservable();
  }
  getNotificationCount(): Observable<any[]> {
    return this._planCount.asObservable();
  }

  planList(id?: Number) {
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
          if (this.authService.resultCodeError(data)) {
            return;
          }

          this.plansData.plans = data;
          this._plans.next(Object.assign({}, this.plansData).plans);
          this.planCount();
        },
        (error) => {
          this.authService.dataError(error);
        }
      );
  }

  planAdd(form: any) {
    return this.http.post<any>(`${this._liveApiUrl}/tenant/plan/`, form).pipe(
      map((data) => {
        return data;
      }),
      catchError(this.authService.handleError)
    );
  }

  planEdit(id: Number, form: any) {
    return this.http
      .put<any>(`${this._liveApiUrl}/tenant/plan/${id}/`, form)
      .pipe(
        map((data) => {
          return data;
        }),
        catchError(this.authService.handleError)
      );
  }

  planDelete(id: Number) {
    return this.http.delete<any>(`${this._liveApiUrl}/tenant/plan/${id}`);
  }

  planCount() {
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
          if (this.authService.resultCodeError(data)) {
            return;
          }

          this.planCountData.planCount = data;
          this._planCount.next(Object.assign({}, this.planCountData).planCount);
        },
        (error) => {
          this.authService.dataError(error);
        }
      );
  }
  notificationCount() {
    return this.http
      .get<any>(`${this.authService._liveApiUrl}/notification/notification-count/`)
  }
  notificationList() {
    let tail = '?page=all'
    return this.http
      .get<any>(`${this.authService._liveApiUrl}/notification/user-notification/${tail}`)
  }
  clearNotification(formData:any) {
    return this.http
      .put<any>(`${this.authService._liveApiUrl}/notification/clear-notification/`, formData)
  }
  deletNotification(formData:any) {
    return this.http
      .post<any>(`${this.authService._liveApiUrl}/notification/clear-notification/`, formData)
  }
  sendNotificationToGroup(formData:any) {
    return this.http
      .post<any>(`${this.authService._liveApiUrl}/notification/send-notification/`,formData)
  }
  sendNotificationToDriverCustomer(formData:any) {
    return this.http
      .post<any>(`${this.authService._liveApiUrl}/notification/send-order-notification/`,formData)
  }

  getAdminSentNotificationList(tabName:string,searchVal:string){
    
    let tail = '';
    let params = new URLSearchParams();
    if (params) {
      if(searchVal && searchVal.length > 0){
         if(tabName == 'all'){
             tabName= '';
         }
      }
        if(tabName && tabName.length > 0){
          params.set('notif_type', tabName)
        }
        if(searchVal && searchVal.length > 0){
          params.set('search_text', searchVal)
        }
    }
    if(tabName || searchVal){
      tail += `?` + params.toString();
    }
   return this.http
      .get<any>(`${this.authService._liveApiUrl}/notification/admin-notification-listing/${tail}`)
      .pipe(
        map((data) => {
          return data;
        }),
        catchError(this.authService.handleError)
      )
      
  }
  clearAdminNotification(formData:any){
    return this.http
      .put<any>(`${this.authService._liveApiUrl}/notification/clear-admin-notification/`,formData)
      .pipe(
        map((data) => {
          return data;
        }),
        catchError(this.authService.handleError)
      )
  }
  clearAllAdminNotification(){
    return this.http
      .put<any>(`${this.authService._liveApiUrl}/notification/clear-admin-notification/all/`,{})
      .pipe(
        map((data) => {
          return data;
        }),
        catchError(this.authService.handleError)
      )
  }
}
