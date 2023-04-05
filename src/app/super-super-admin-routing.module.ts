import { Routes } from '@angular/router';
import { AuthGuard } from './_shared/auth.guard';

export const CHILDREN_ROUTES: Routes = [
  {
    path: 'dashboad',
    // component: DashboardComponent,
    title: 'Dashboard',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('../app/back/dashboard/dashboard.component').then(
        (mod) => mod.DashboardComponent
      ),
  },
  {
    path: 'company',
    // component: CompanyListComponent,
    title: 'Company List',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./back/supersuperadmin/company-list/company-list.component').then(
        (mod) => mod.CompanyListComponent
      ),
  },
  {
    path: 'company/add',
    // component: CompanyAddComponent,
    title: 'Add Company',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import(
        './back/supersuperadmin/company-list/company-add/company-add.component'
      ).then((mod) => mod.CompanyAddComponent),
  },
  {
    path: 'plans',
    // component: PlanListComponent,
    title: 'Plans',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./back/supersuperadmin/plan-list/plan-list.component').then(
        (mod) => mod.PlanListComponent
      ),
  },
  {
    path: 'plans/add',
    // component: PlanAddComponent,
    title: 'Add Plan',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import(
        './back/supersuperadmin/plan-list/plan-add/plan-add.component'
      ).then((mod) => mod.PlanAddComponent),
  },
  {
    path: 'plans/:id',
    // component: PlanAddComponent,
    title: 'Edit Plan',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import(
        './back/supersuperadmin/plan-list/plan-add/plan-add.component'
      ).then((mod) => mod.PlanAddComponent),
  },
  {
    path: 'tickets',
    // component: TicketListComponent,
    title: 'Tickets',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('../app/back/common/ticket-list/ticket-list.component').then(
        (mod) => mod.TicketListComponent
      ),
  },
  {
    path: 'tickets/:id',
    // component: TicketDetailComponent,
    title: 'Ticket',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import(
        '../app/back/common/ticket-list/ticket-detail/ticket-detail.component'
      ).then((mod) => mod.TicketDetailComponent),
  },
  {
    path: 'report',
    // component: CompanyListComponent,
    title: 'Report',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./back/supersuperadmin/company-list/company-list.component').then(
        (mod) => mod.CompanyListComponent
      ),
  },
  {
    path: 'profile',
    // component: ProfileComponent,
    title: 'My Profile',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('../app/back/common/profile/profile.component').then(
        (mod) => mod.ProfileComponent
      ),
  },
  {
    path: 'setting',
    // component: SettingComponent,
    title: 'Setting',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('../app/back/common/setting/setting.component').then(
        (mod) => mod.SettingComponent
      ),
  }
];
