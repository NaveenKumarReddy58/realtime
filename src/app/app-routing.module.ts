import { Injectable, NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterModule, RouterStateSnapshot, Routes, TitleStrategy } from '@angular/router';
import { CompanyAddComponent } from './back/company-list/company-add/company-add.component';
import { CompanyListComponent } from './back/company-list/company-list.component';
import { DashboardComponent } from './back/dashboard/dashboard.component';
import { PlanAddComponent } from './back/plan-list/plan-add/plan-add.component';
import { PlanListComponent } from './back/plan-list/plan-list.component';
import { ProfileComponent } from './back/profile/profile.component';
import { TicketDetailComponent } from './back/ticket-list/ticket-detail/ticket-detail.component';
import { TicketListComponent } from './back/ticket-list/ticket-list.component';
import { ForgotPasswordComponent } from './front/forgot-password/forgot-password.component';

import { LoginComponent } from './front/login/login.component';
import { OtpLoginComponent } from './front/otp-login/otp-login.component';
import { PreComponent } from './front/pre/pre.component';
import { ResetPasswordComponent } from './front/reset-password/reset-password.component';
import { AuthGuard } from './_shared/auth.guard';
import { FrontGuard } from './_shared/front.guard';

const routes: Routes = [
  {
    path: '',
    component: PreComponent,
    title: 'Home',
    canActivate: [FrontGuard]
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login',
    canActivate: [FrontGuard]
  },
  {
    path: 'reset',
    component: ResetPasswordComponent,
    title: 'Reset Password',
    canActivate: [FrontGuard]
  },
  {
    path: 'forgot',
    component: ForgotPasswordComponent,
    title: 'Forgot Password',
    canActivate: [FrontGuard]
  },
  {
    path: 'otplogin',
    component: OtpLoginComponent,
    title: 'OTP Login',
    canActivate: [FrontGuard]
  },
  {
    path: 'dashboad',
    component: DashboardComponent,
    title: 'Dashboard',
    canActivate: [AuthGuard]
  },
  {
    path: 'plans',
    component: PlanListComponent,
    title: 'Plans',
    canActivate: [AuthGuard]
  },
  {
    path: 'plans/add',
    component: PlanAddComponent,
    title: 'Add Plans',
    canActivate: [AuthGuard]
  },
  {
    path: 'tickets',
    component: TicketListComponent,
    title: 'Tickets',
    canActivate: [AuthGuard]
  },
  {
    path: 'tickets/:id',
    component: TicketDetailComponent,
    title: 'Ticket',
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    title: 'My Profile',
    canActivate: [AuthGuard]
  },
  {
    path: 'company',
    component: CompanyListComponent,
    title: 'Company List',
    canActivate: [AuthGuard]
  },
  {
    path: 'company/add',
    component: CompanyAddComponent,
    title: 'Add Company',
    canActivate: [AuthGuard]
  },
  {
    path: 'report',
    component: CompanyListComponent,
    title: 'Report',
    canActivate: [AuthGuard]
  },
];

// { path: 'user-profile/:id', component: DashboardComponent, canActivate: [AuthGuard] }
// { path: 'a', loadChildren: () => import('./modulea/modulea.module').then(m => m.ModuleaModule) },
// { path: 'admin', loadComponent: () => import('./app/admin/admin.component').then(mod => mod.AdminComponent), canActivate: [() => inject(authService).isLoggedIn()] },
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
