import { Injectable, NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  RouterModule,
  RouterStateSnapshot,
  Routes,
  TitleStrategy,
} from '@angular/router';
import { ForgotPasswordComponent } from '../app/front/forgot-password/forgot-password.component';
import { LoginComponent } from '../app/front/login/login.component';
import { OtpLoginComponent } from '../app/front/otp-login/otp-login.component';
import { ResetPasswordComponent } from '../app/front/reset-password/reset-password.component';
import { ProfileComponent } from './back/common/profile/profile.component';
import { SettingComponent } from './back/common/setting/setting.component';
import { TicketDetailComponent } from './back/common/ticket-list/ticket-detail/ticket-detail.component';
import { TicketListComponent } from './back/common/ticket-list/ticket-list.component';
import { DashboardComponent } from './back/dashboard/dashboard.component';
import { OrderAddComponent } from './back/superadmin/order-list/order-add/order-add.component';
import { SuperAdminComponent } from './back/superadmin/super-admin.component';
import { CompanyAddComponent } from './back/supersuperadmin/company-list/company-add/company-add.component';
import { CompanyListComponent } from './back/supersuperadmin/company-list/company-list.component';
import { PlanAddComponent } from './back/supersuperadmin/plan-list/plan-add/plan-add.component';
import { PlanListComponent } from './back/supersuperadmin/plan-list/plan-list.component';
import { SuperSuperAdminComponent } from './back/supersuperadmin/super-super-admin.component';
import { NotFoundComponent } from './front/not-found/not-found.component';
import { PreComponent } from './front/pre/pre.component';
import { AuthGuard } from './_shared/auth.guard';
import { FrontGuard } from './_shared/front.guard';
import { WarehouseListComponent } from './back/superadmin/warehouse-list/warehouse-list.component';
import { WarehouseAddComponent } from './back/superadmin/warehouse-list/warehouse-add/warehouse-add.component';
import { DriverListComponent } from './back/superadmin/driver-list/driver-list.component';
import { DriverAddComponent } from './back/superadmin/driver-list/driver-add/driver-add.component';
import { LocateDriverComponent } from './back/superadmin/locate-driver/locate-driver.component';
import { NotificationListComponent } from './back/common/notification-list/notification-list.component';

const routes: Routes = [
  {
    path: '',
    component: PreComponent,
    title: 'Home',
    canActivate: [FrontGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login',
    canActivate: [FrontGuard],
  },
  {
    path: 'reset',
    component: ResetPasswordComponent,
    title: 'Reset Password',
    canActivate: [FrontGuard],
  },
  {
    path: 'forgot',
    component: ForgotPasswordComponent,
    title: 'Forgot Password',
    canActivate: [FrontGuard],
  },
  {
    path: 'otplogin',
    component: OtpLoginComponent,
    title: 'OTP Login',
    canActivate: [FrontGuard],
  },
  {
    path: 'superadmin',
    canActivate: [AuthGuard],
    title: 'Super Super Admin',
    children: [
      {
        path: 'dashboad',
        component: DashboardComponent,
        title: 'Dashboard',
        canActivate: [AuthGuard],
      },
      {
        path: 'company',
        component: CompanyListComponent,
        title: 'Company List',
        canActivate: [AuthGuard],
      },
      {
        path: 'company/add',
        component: CompanyAddComponent,
        title: 'Add Company',
        canActivate: [AuthGuard],
      },
      {
        path: 'plans',
        component: PlanListComponent,
        title: 'Plans',
        canActivate: [AuthGuard],
      },
      {
        path: 'plans/add',
        component: PlanAddComponent,
        title: 'Add Plan',
        canActivate: [AuthGuard],
      },
      {
        path: 'plans/:id',
        component: PlanAddComponent,
        title: 'Edit Plan',
        canActivate: [AuthGuard],
      },
      {
        path: 'tickets',
        component: TicketListComponent,
        title: 'Tickets',
        canActivate: [AuthGuard],
      },
      {
        path: 'tickets/:id',
        component: TicketDetailComponent,
        title: 'Ticket',
        canActivate: [AuthGuard],
      },
      {
        path: 'notification',
        component: NotificationListComponent,
        title: 'Notification List',
        canActivate: [AuthGuard],
      },
      {
        path: 'report',
        component: CompanyListComponent,
        title: 'Report',
        canActivate: [AuthGuard],
      },
      {
        path: 'profile',
        component: ProfileComponent,
        title: 'My Profile',
        canActivate: [AuthGuard],
      },
      {
        path: 'setting',
        component: SettingComponent,
        title: 'Setting',
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    title: 'Super Admin',
    children: [
      {
        path: 'dashboad',
        component: DashboardComponent,
        title: 'Dashboard',
        canActivate: [AuthGuard],
      },
      {
        path: 'orders/add',
        component: OrderAddComponent,
        title: 'Add Order',
        canActivate: [AuthGuard],
      },
      {
        path: 'warehouse',
        component: WarehouseListComponent,
        title: 'Warehouse List',
        canActivate: [AuthGuard],
      },
      {
        path: 'warehouse/add',
        component: WarehouseAddComponent,
        title: 'Warehouse Add',
        canActivate: [AuthGuard],
      },
      {
        path: 'driver',
        component: DriverListComponent,
        title: 'Driver List',
        canActivate: [AuthGuard],
      },
      {
        path: 'driver/add',
        component: DriverAddComponent,
        title: 'Driver Add',
        canActivate: [AuthGuard],
      },
      {
        path: 'driver/locate',
        component: LocateDriverComponent,
        title: 'Driver Locate',
        canActivate: [AuthGuard],
      },
      {
        path: 'tickets',
        component: TicketListComponent,
        title: 'Tickets',
        canActivate: [AuthGuard],
      },
      {
        path: 'tickets/:id',
        component: TicketDetailComponent,
        title: 'Ticket Detail',
        canActivate: [AuthGuard],
      },
      {
        path: 'notification',
        component: NotificationListComponent,
        title: 'Notification List',
        canActivate: [AuthGuard],
      },
      {
        path: 'profile',
        component: ProfileComponent,
        title: 'My Profile',
        canActivate: [AuthGuard],
      },
      {
        path: 'setting',
        component: SettingComponent,
        title: 'Setting',
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: '**',
    component: NotFoundComponent,
    title: 'Not Found',
  },
];

// { path: 'user-profile/:id', component: DashboardComponent, canActivate: [AuthGuard] }
// { path: 'a', loadChildren: () => import('./modulea/modulea.module').then(m => m.ModuleaModule) },
// { path: 'admin', loadComponent: () => import('./app/admin/admin.component').then(mod => mod.AdminComponent), canActivate: [() => inject(authService).getDashboard()] },
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
  providers: [{ provide: TitleStrategy, useClass: TemplatePageTitleStrategy }],
})
export class AppRoutingModule {}
