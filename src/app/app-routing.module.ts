import { Injectable, NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  RouterModule,
  RouterStateSnapshot,
  Routes,
  TitleStrategy,
} from '@angular/router';
import { FrontGuard } from './_shared/front.guard';
import { NotFoundComponent } from './front/not-found/not-found.component';

const routes: Routes = [
  {
    title: 'Home',
    canActivate: [FrontGuard],
    path: '',
    loadChildren: () =>
      import('./front-routing.module').then((m) => m.CHILDREN_ROUTES),
  },
  {
    title: 'Super Admin',
    canActivate: [FrontGuard],
    path: 'superadmin',
    loadChildren: () =>
      import('./super-super-admin-routing.module').then(
        (m) => m.CHILDREN_ROUTES
      ),
  },
  {
    title: 'Admin',
    canActivate: [FrontGuard],
    path: 'admin',
    loadChildren: () =>
      import('./super-admin-routing.module').then((m) => m.CHILDREN_ROUTES),
  },
  {
    path: '**',
    // component: NotFoundComponent,
    title: 'Not Found',
    loadComponent: () =>
      import('./front/not-found/not-found.component').then(
        (mod) => mod.NotFoundComponent
      ),
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
