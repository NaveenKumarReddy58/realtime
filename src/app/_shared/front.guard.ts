import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  CanActivate,
  Router,
} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthService } from '../_service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class FrontGuard implements CanActivate {
  isLoggedIn: any = false;
  constructor(
    public authService: AuthService,
    public router: Router,
    private toastr: ToastrService
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    this.authService.getDashboard().subscribe((data: any) => {
      this.isLoggedIn = data;
    });
    if (this.isLoggedIn) {
      this.router.navigate(['/' + this.authService._isRoleName + '/dashboad']);
      return false;
    }
    return true;
  }
}
