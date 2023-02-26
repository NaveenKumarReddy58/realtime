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

  add(plan: Plan) {
    return this.http
      .post<Plan>(`${environment.apiUrl}/tenant/plan/`, plan)
      .pipe(
        map((data) => {
          return data;
        }),
        catchError(this.handleError)
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
