import { Injectable, enableProdMode, importProvidersFrom } from '@angular/core';
import { Title, bootstrapApplication } from '@angular/platform-browser';
import {
  Routes,
  TitleStrategy,
  RouterStateSnapshot,
  RouterModule,
  Route,
} from '@angular/router';
import { FrontGuard } from './app/_shared/front.guard';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './app/_shared/auth.interceptor';
import { ToastrModule } from 'ngx-toastr';

if (environment.production) {
  enableProdMode();
}

export const ROUTES: Route[] = [
  {
    title: 'Home',
    canActivate: [FrontGuard],
    path: '',
    loadChildren: () =>
      import('./app/front-routing.module').then((m) => m.CHILDREN_ROUTES),
  },
  {
    title: 'Super Admin',
    canActivate: [FrontGuard],
    path: 'superadmin',
    loadChildren: () =>
      import('./app/super-super-admin-routing.module').then(
        (m) => m.CHILDREN_ROUTES
      ),
  },
  {
    title: 'Admin',
    canActivate: [FrontGuard],
    path: 'admin',
    loadChildren: () =>
      import('./app/super-admin-routing.module').then((m) => m.CHILDREN_ROUTES),
  },
  {
    path: '**',
    title: 'Not Found',
    loadComponent: () =>
      import('./app/front/not-found/not-found.component').then(
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

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      RouterModule.forRoot(ROUTES),
      HttpClientModule,
      ToastrModule
    ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: TitleStrategy,
      useClass: TemplatePageTitleStrategy,
    },
  ],
});

// platformBrowserDynamic().bootstrapModule(AppModule)
//   .catch(err => console.error(err));
