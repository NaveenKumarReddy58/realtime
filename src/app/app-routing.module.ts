import { Injectable, NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterModule, RouterStateSnapshot, Routes, TitleStrategy } from '@angular/router';
import { DashboardComponent } from './back/dashboard/dashboard.component';
import { ForgotPasswordComponent } from './front/forgot-password/forgot-password.component';

import { LoginComponent } from './front/login/login.component';
import { OtpLoginComponent } from './front/otp-login/otp-login.component';
import { PreComponent } from './front/pre/pre.component';
import { ResetPasswordComponent } from './front/reset-password/reset-password.component';
import { AuthGuard } from './_shared/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: PreComponent,
    // loadComponent: () => import('./front/pre/pre.component').then(m => m.PreComponent),
    title: 'Home'
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login'
  },
  {
    path: 'reset',
    component: ResetPasswordComponent,
    title: 'Reset Password'
  },
  {
    path: 'forgot',
    component: ForgotPasswordComponent,
    title: 'Forgot Password'
  },
  {
    path: 'otplogin',
    component: OtpLoginComponent,
    title: 'OTP Login'
  },
  {
    path: 'dashboad',
    component: DashboardComponent,
    title: 'Dashboard',
    canActivate: [AuthGuard]
  },
  // { path: 'user-profile/:id', component: DashboardComponent, canActivate: [AuthGuard] }
];
//{ path: 'a', loadChildren: () => import('./modulea/modulea.module').then(m => m.ModuleaModule) },
// { path: 'admin', loadComponent: () => import('./app/admin/admin.component').then(mod => mod.AdminComponent), canActivate: [() => inject(ApiService).isLoggedIn()] },
// {
//   path: 'children', loadChildren: () =>
//     import('./app/children/children.routes').then(m => m.CHILDREN_ROUTES)
// },
// { path: '**', component: NotFoundComponent },

@Injectable()
export class TemplatePageTitleStrategy extends TitleStrategy {
  constructor(private readonly title: Title) {
    super();
  }

  override updateTitle(routerState: RouterStateSnapshot) {
    const title = this.buildTitle(routerState);
    if (title !== undefined) {
      this.title.setTitle(`Real Time Track - ${title}`);
    }
  }
}

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    { provide: TitleStrategy, useClass: TemplatePageTitleStrategy }
  ]
})
export class AppRoutingModule { }
