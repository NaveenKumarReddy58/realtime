import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot, RouterStateSnapshot,
  UrlTree, CanActivate, Router
} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FrontGuard implements CanActivate {
  constructor(
    public authService: AuthService,
    public router: Router,
    private toastr: ToastrService
  ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // console.log('guard', this.authService.isLoggedIn)
    if (this.authService.isLoggedIn) {
      // this.toastr.error('', "Access not allowed!");
      this.router.navigate(['/dashboad']);
      return false;
    }
    return true;
  }
}